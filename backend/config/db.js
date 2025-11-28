const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// Conexão com o banco de dados MongoDB usando a variável de ambiente
mongoose.connect(process.env.MONGODB_URI);

//Obter a conexão
const db = mongoose.connection;

// Tratar erros de conexão
db.on('error', console.error.bind(console, 'Erro de conexão com o mongodb!'));

// Verifica se a conexão foi estabelecida 
db.once('open', function(){
    console.log('Conexão com mongodb estabelecida!')
})

module.exports = db;