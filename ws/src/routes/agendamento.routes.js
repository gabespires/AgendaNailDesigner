const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Horario = require('../models/horario');
const Agendamento = require('../models/agendamento');
const Cliente = require('../models/cliente');
const Salao = require('../models/salao');
const Servico = require('../models/servico');
const pagarme = require('../services/pagarme');
const moment = require('moment');
const util = require('../util');

router.post('/', async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { clienteId, salaoId, servicoId } = req.body;

    const cliente = await Cliente.findById(clienteId).select('nome endereco customerId');
    const salao = await Salao.findById(salaoId).select('recipientId');
    const servico = await Servico.findById(servicoId).select('preco titulo comissao');

    if (!cliente || !salao || !servico) {
      throw new Error('Cliente, salão ou serviço não encontrado.');
    }

    // Preço em centavos (corrigido: remover *100 extra)
    const precoFinal = util.toCents(servico.preco);

    // Criar pagamento via Pagar.me
    const createPayment = await pagarme('/transactions', {
      amount: precoFinal,
      card_number: '4111111111111111', // ⚠️ Substituir por dados reais no frontend seguro
      card_cvv: '123',
      card_expiration_date: '0922',
      card_holder_name: 'Morpheus Fishburne', // ⚠️ Substituir
      customer: {
        id: cliente.customerId,
      },
      billing: {
        name: cliente.nome,
        address: {
          country: cliente.endereco.pais.toLowerCase(),
          state: cliente.endereco.uf.toLowerCase(),
          city: cliente.endereco.cidade,
          street: cliente.endereco.logradouro,
          street_number: cliente.endereco.numero,
          zipcode: cliente.endereco.cep,
        },
      },
      items: [
        {
          id: servicoId,
          title: servico.titulo,
          unit_price: precoFinal,
          quantity: 1,
          tangible: false,
        },
      ],
      split_rules: [
        {
          recipient_id: salao.recipientId,
          amount: precoFinal - keys.app_fee,
        },
        {
          recipient_id: keys.recipient_id,
          amount: keys.app_fee,
          charge_processing_fee: false,
        },
      ],
    });

    if (createPayment.error) {
      throw new Error(createPayment.message);
    }

    // Criar o agendamento
    const agendamento = {
      ...req.body,
      transactionId: createPayment.data.id,
      comissao: servico.comissao,
      valor: servico.preco,
    };

    await new Agendamento(agendamento).save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ error: false, agendamento: createPayment.data });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message || 'Erro ao processar agendamento.' });
  }
});

module.exports = router;
