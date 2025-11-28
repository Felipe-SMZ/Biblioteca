// controllers/autoresController.js

// 1. IMPORTAR o service
// O controller chama as funções do service
const autoresService = require('../services/autoresService');

// 2. CRIAR um novo autor
// Recebe a requisição HTTP, extrai os dados e chama o service
const criarAutor = async (req, res) => {
    try {
        // req.body contém os dados enviados no corpo da requisição
        const dados = req.body;
        
        // Chama a função do service para criar o autor
        const novoAutor = await autoresService.criarAutor(dados);
        
        // Retorna sucesso (status 201 = Created)
        return res.status(201).json({
            sucesso: true,
            mensagem: 'Autor criado com sucesso',
            dados: novoAutor
        });
    } catch (error) {
        // Retorna erro (status 400 = Bad Request)
        return res.status(400).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

// 3. BUSCAR todos os autores
const buscarTodosAutores = async (req, res) => {
    try {
        // Chama o service para buscar todos
        const autores = await autoresService.buscarTodosAutores();
        
        // Retorna sucesso (status 200 = OK)
        return res.status(200).json({
            sucesso: true,
            quantidade: autores.length,
            dados: autores
        });
    } catch (error) {
        return res.status(500).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

// 4. BUSCAR um autor por ID
const buscarAutorPorId = async (req, res) => {
    try {
        // req.params contém os parâmetros da URL
        // Exemplo: /autores/123 -> req.params.id = "123"
        const { id } = req.params;
        
        const autor = await autoresService.buscarAutorPorId(id);
        
        return res.status(200).json({
            sucesso: true,
            dados: autor
        });
    } catch (error) {
        // Status 404 = Not Found (quando não encontra)
        return res.status(404).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

// 5. ATUALIZAR um autor
const atualizarAutor = async (req, res) => {
    try {
        const { id } = req.params;  // ID vem da URL
        const dados = req.body;     // Novos dados vêm do body
        
        const autorAtualizado = await autoresService.atualizarAutor(id, dados);
        
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Autor atualizado com sucesso',
            dados: autorAtualizado
        });
    } catch (error) {
        return res.status(400).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

// 6. DELETAR um autor
const deletarAutor = async (req, res) => {
    try {
        const { id } = req.params;
        
        await autoresService.deletarAutor(id);
        
        // Status 204 = No Content (deletado com sucesso, sem retorno)
        // Ou use 200 se quiser retornar uma mensagem
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Autor deletado com sucesso'
        });
    } catch (error) {
        return res.status(404).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

// 7. EXPORTAR todas as funções do controller
module.exports = {
    criarAutor,
    buscarTodosAutores,
    buscarAutorPorId,
    atualizarAutor,
    deletarAutor
};

/* 
===========================================
ENTENDENDO O CONTROLLER:
===========================================

O Controller é a PONTE entre:
- A requisição HTTP (req)
- O Service (lógica de negócio)
- A resposta HTTP (res)

===========================================
ESTRUTURA DE CADA FUNÇÃO:
===========================================

const nomeFuncao = async (req, res) => {
    try {
        // 1. Extrair dados de req.body ou req.params
        // 2. Chamar o service
        // 3. Retornar resposta com res.status().json()
    } catch (error) {
        // Retornar erro
    }
};

===========================================
PRINCIPAIS STATUS HTTP:
===========================================

200 - OK (sucesso geral)
201 - Created (criado com sucesso)
204 - No Content (deletado, sem retorno)
400 - Bad Request (erro nos dados enviados)
404 - Not Found (não encontrado)
500 - Internal Server Error (erro do servidor)

===========================================
REQ (REQUEST) - REQUISIÇÃO:
===========================================

req.body     → Dados enviados no corpo (POST/PUT)
             Exemplo: { "nome": "Machado de Assis" }

req.params   → Parâmetros da URL
             Exemplo: /autores/123 -> req.params.id = "123"

req.query    → Query strings da URL
             Exemplo: /autores?nome=Machado -> req.query.nome = "Machado"

===========================================
RES (RESPONSE) - RESPOSTA:
===========================================

res.status(200)      → Define o código HTTP
res.json({ ... })    → Envia resposta em JSON
res.send("texto")    → Envia texto simples

Geralmente usamos junto:
res.status(200).json({ dados: ... })

===========================================
PADRÃO DE RESPOSTA JSON:
===========================================

Sucesso:
{
    "sucesso": true,
    "mensagem": "Operação realizada",
    "dados": { ... }
}

Erro:
{
    "sucesso": false,
    "mensagem": "Descrição do erro"
}

===========================================
PARA REPLICAR NOS OUTROS CONTROLLERS:
===========================================

1. Troque "autores" pelo nome do recurso
2. Troque "autor" no singular
3. Importe o service correspondente
4. Mantenha a mesma estrutura!

Para livrosController, é IDÊNTICO!
Apenas troque os nomes.
*/