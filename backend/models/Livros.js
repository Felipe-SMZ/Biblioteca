//importando a conexao com db
const db = require('../config/db');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LivrosSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    autor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Autores',
        required: true
    },
    genero_id: {
        type: Schema.Types.ObjectId,
        ref: 'Generos',
        required: true
    },
    data_publicacao: {
        type: Date
    }
}, {collection: 'Livros'});

const Livros = mongoose.model("Livros", LivrosSchema);

    module.exports = Livros;