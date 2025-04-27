const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salao = new Schema({
    salaoId: {
        type: mongoose.Types.ObjectId,
        ref: 'Salao', 
        required: true,
    },
    nome: {
        type: String,
        require: [true, 'Nome é obrigatório.']
    },
    foto: String,
    capa: String,
    email: {
        type: String,
        require: [true, 'E-mail é obrigatório.']
    },
    senha: {
        type: String,
        default: null,
    },
    telefone: String,
    endereco: {
        cidade: String,
        uf: String,
        cep: String,
        numero: String,
        pais: String,
    },
    geo: {
        tipo: String,
        coordinates: [Number],
    },
    dataCadastro: {
        type: Date,
        default: Date.now,
    },
});

salao.index({geo: '2dsphere'});

module.exports = mongoose.model('Salao', salao);
