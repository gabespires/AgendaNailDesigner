const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const servico = new Schema({
    servicoId: {
        type: mongoose.Types.ObjectId,
        ref: 'Servico', 
        required: true,
    },
    salaoId: {
        type: mongoose.Types.ObjectId,
        ref: 'Salao', 
        required: true,
    },
    titulo: {
        type: String,
        require: true,
    },
    preco: {
        type: Number,
        require: true,
    },
    duracao: {
        type: Number, // Duração em minutos 
        require: true,
    },
    recorrencia: {
        type: Number, // Periodo de refação do serviço em dias 
        require: true,
    },
    descricao: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        require: true,
        enum: ['A', 'I', 'E'],
        default: 'A',
    },
    dataCadastro: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Servico', servico);
