const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cliente = require('../models/cliente');
const SalaoCliente = require('../models/salaoCliente');
const pagarme = require('../services/pagarme');
const moment = require('moment');

router.post('/', async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { cliente, salaoId } = req.body;
    let newClient = null;

    // Verifica se já existe um cliente com o mesmo e-mail ou telefone
    const existentClient = await Cliente.findOne({
      $or: [
        { email: cliente.email },
        { telefone: cliente.telefone },
      ],
    });

    // Se não existir, cria novo cliente
    if (!existentClient) {
      const _id = new mongoose.Types.ObjectId();

      const pagarmeCliente = await pagarme('/customers', {
        external_id: _id.toString(),
        name: cliente.nome,
        type: cliente.documento.tipo === 'cpf' ? 'individual' : 'corporation',
        country: 'br',
        email: cliente.email,
        documents: [
          {
            type: cliente.documento.tipo,
            number: cliente.documento.numero,
          },
        ],
        phone_numbers: ['+55' + cliente.telefone],
        birthday: cliente.dataNascimento,
      });

      if (pagarmeCliente.error) {
        throw pagarmeCliente;
      }

      newClient = await new Cliente({
        _id,
        ...cliente,
        customerId: pagarmeCliente.data.id,
      }).save({ session });
    }

    const clienteId = existentClient ? existentClient._id : newClient._id;

    // Verifica se já existe vínculo com o salão
    const existentRelationship = await SalaoCliente.findOne({
      salaoId,
      clienteId,
    });

    // Se não existir vínculo, cria
    if (!existentRelationship) {
      await new SalaoCliente({
        salaoId,
        clienteId,
      }).save({ session });
    }

    // Se vínculo existir, mas estiver inativo, reativa
    if (existentRelationship && existentRelationship.status === 'I') {
      await SalaoCliente.findOneAndUpdate(
        { salaoId, clienteId },
        { status: 'A' },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    // Se o cliente já existia e já tinha vínculo ativo
    if (
      existentRelationship &&
      existentRelationship.status === 'A' &&
      existentClient
    ) {
      res.json({ error: true, message: 'Cliente já cadastrado!' });
    } else {
      res.json({ error: false });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});

// Filtrar clientes por critérios personalizados
router.post('/filter', async (req, res) => {
  try {
    const clientes = await Cliente.find(req.body.filters);
    res.json({ error: false, clientes });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// Listar clientes vinculados a um salão
router.get('/salao/:salaoId', async (req, res) => {
  try {
    const clientes = await SalaoCliente.find({
      salaoId: req.params.salaoId,
      status: 'A',
    })
      .populate('clienteId')
      .select('clienteId');

    res.json({
      error: false,
      clientes: clientes.map((c) => ({
        ...c.clienteId._doc,
        vinculoId: c._id,
        dataCadastro: moment(c.dataCadastro).format('DD/MM/YYYY'),
      })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// Remover vínculo (status inativo)
router.delete('/vinculo/:id', async (req, res) => {
  try {
    await SalaoCliente.findByIdAndUpdate(req.params.id, { status: 'I' });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
