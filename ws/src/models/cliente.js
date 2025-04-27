const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cliente = new Schema({
    clienteId: {
        type: mongoose.Types.ObjectId,
        ref: 'Cliente', 
        required: true,
    },
    nome: {
        type: String,
        require: [true, 'Nome é obrigatório.']
    },
    foto: String,
    sexo: {
        type: String,
        enum: ['M', 'F'],
        required: true,
    },
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
    dataNascimento: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        required: true,
        enum: ['A', 'I'],
        default: 'A',
    },
    dataCadastro: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model('Cliente', cliente);
