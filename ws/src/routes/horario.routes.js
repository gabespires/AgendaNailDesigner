const express = require('express');
const router = express.Router();
const Horario = require('../models/horario');
const moment = require('moment');

// Rota para criar um novo horário
router.post('/', async (req, res) => {
  try {
    await new Horario(req.body).save();
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// Rota para buscar horários de um salão específico
router.get('/salao/:salaoId', async (req, res) => {
  try {
    const { salaoId } = req.params;
    const horarios = await Horario.find({ salaoId });
    res.json({ error: false, horarios });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// Rota para atualizar um horário existente
router.put('/:horarioId', async (req, res) => {
  try {
    const { horarioId } = req.params;
    const horario = req.body;
    await Horario.findByIdAndUpdate(horarioId, horario);
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// Rota para deletar um horário
router.delete('/:horarioId', async (req, res) => {
  try {
    const { horarioId } = req.params;
    await Horario.findByIdAndDelete(horarioId);
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
