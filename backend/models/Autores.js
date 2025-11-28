//importando a conexao com db
const db = require('../config/db');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AutoresSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
}, { collection: 'Autores' });

const Autores = mongoose.model("Autores", AutoresSchema);

module.exports = Autores;