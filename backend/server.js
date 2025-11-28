const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express(); // ⬅️ Cria o aplicativo Express diretamente aqui

// 1. IMPORTAÇÕES DE ROTAS E DB
// Importa a conexão com o banco (garantindo que o DB está conectado)
require('./config/db');

const autoresRoutes = require('./routes/Autores.routes');
const generosRoutes = require('./routes/Generos.routes');
const livrosRoutes = require('./routes/Livros.routes');

// 2. MIDDLEWARES ESSENCIAIS (INCLUINDO CORS)
app.use(cors()); // Configuração simples de CORS para desenvolvimento
app.use(express.json()); // Middleware para parsear JSON

// 3. CONEXÃO DAS ROTAS
app.use('/api/autores', autoresRoutes);
app.use('/api/generos', generosRoutes);
app.use('/api/livros', livrosRoutes);

// Rota de teste/saúde
app.get('/', (req, res) => {
    res.send('API de Livraria funcionando!');
});

// 4. TRATAMENTO DE ERROS 404
app.use((req, res, next) => {
    const error = new Error(`Não encontrado - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// 5. MIDDLEWARE DE TRATAMENTO DE ERROS GERAL
app.use((error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        sucesso: false,
        mensagem: error.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
    });
});


// 6. INICIALIZAÇÃO DO SERVIDOR (listen)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

