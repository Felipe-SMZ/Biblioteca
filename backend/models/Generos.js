const db = require('../config/db');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GenerosSchema = new Schema({
    genero: {
        type: String,
        required: true
    }
}, {collection: 'Generos'});

const Generos = mongoose.model("Generos", GenerosSchema);

module.exports = Generos;