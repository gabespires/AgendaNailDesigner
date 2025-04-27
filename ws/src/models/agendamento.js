const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agendamento = new Schema({
    clienteId: {
        type: mongoose.Types.ObjectId,
        ref: 'Cliente', 
        required: true,
    },
    salaoId: {
        type: mongoose.Types.ObjectId,
        ref: 'Salao', 
        required: true,
    },
    servicoId: {
        type: mongoose.Types.ObjectId,
        ref: 'Servico', 
        required: true,
    },
    data: {
        type: Date,
        default: Date.now,
    },
    valor: {
        type: Number,
        require: true,
    },
    dataCadastro: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model('Agendamento', agendamento);
