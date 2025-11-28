import axios from 'axios';

// URL base do seu backend Express (ajuste a porta se for diferente)
const API_BASE_URL = 'http://localhost:3000/api';

// Configura uma instância do Axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// =================================================================
// Funções de Tratamento (Lida com o padrão de resposta: { sucesso: true, dados: ... })
// =================================================================

function handleApiResponse(response) {
    // Para respostas DELETE que retornam status 204 (No Content) sem corpo,
    // garantimos que o retorno seja tratado como sucesso.
    if (response.status === 204 || (response.data && response.data.sucesso)) {
        return response.data ? response.data.dados : { mensagem: 'Operação realizada com sucesso.' };
    } else {
        // Lança um erro com a mensagem do backend
        throw new Error(response.data.mensagem || 'Erro desconhecido do servidor.');
    }
}

// =================================================================
// Endpoints específicos para Consumo (CRUD Completo)
// =================================================================

// --- LIVROS ---
export const LivrosApi = {
    criarLivro: async (dados) => {
        const response = await api.post('/livros', dados);
        return handleApiResponse(response);
    },
    // Busca todos os livros (com filtro de título opcional)
    buscarTodosLivros: async (titulo = '') => {
        const params = titulo ? { titulo } : {};
        const response = await api.get('/livros', { params });
        return handleApiResponse(response);
    },
    buscarLivroPorId: async (id) => {
        const response = await api.get(`/livros/${id}`);
        return handleApiResponse(response);
    },
    atualizarLivro: async (id, dados) => {
        const response = await api.put(`/livros/${id}`, dados);
        return handleApiResponse(response);
    },
    deletarLivro: async (id) => {
        const response = await api.delete(`/livros/${id}`);
        // O backend pode retornar 204 (No Content) ou 200 com mensagem
        return handleApiResponse(response);
    },
};

// --- AUTORES ---
export const AutoresApi = {
    criarAutor: async (dados) => {
        const response = await api.post('/autores', dados);
        return handleApiResponse(response);
    },
    buscarTodosAutores: async () => {
        const response = await api.get('/autores');
        return handleApiResponse(response);
    },
    buscarAutorPorId: async (id) => {
        const response = await api.get(`/autores/${id}`);
        return handleApiResponse(response);
    },
    atualizarAutor: async (id, dados) => {
        const response = await api.put(`/autores/${id}`, dados);
        return handleApiResponse(response);
    },
    deletarAutor: async (id) => {
        const response = await api.delete(`/autores/${id}`);
        return handleApiResponse(response);
    },
};

// --- GENEROS ---
export const GenerosApi = {
    criarGenero: async (dados) => {
        const response = await api.post('/generos', dados);
        return handleApiResponse(response);
    },
    buscarTodosGeneros: async () => {
        const response = await api.get('/generos');
        return handleApiResponse(response);
    },
    buscarGeneroPorId: async (id) => {
        const response = await api.get(`/generos/${id}`);
        return handleApiResponse(response);
    },
    atualizarGenero: async (id, dados) => {
        const response = await api.put(`/generos/${id}`, dados);
        return handleApiResponse(response);
    },
    deletarGenero: async (id) => {
        const response = await api.delete(`/generos/${id}`);
        return handleApiResponse(response);
    },
};