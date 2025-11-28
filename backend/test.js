const mongoose = require('mongoose');
const Autores = require('./models/Autores');
const Generos = require('./models/Generos');
const Livros = require('./models/Livros');

async function testar() {
    try {
        // Criar um autor
        const autor = await Autores.create({
            nome: "Machado de Assis"
        });
        console.log("Autor criado:", autor);

        // Criar um gênero
        const genero = await Generos.create({
            genero: "Romance"
        });
        console.log("Gênero criado:", genero);

        // Criar um livro
        const livro = await Livros.create({
            titulo: "Dom Casmurro",
            autor_id: autor._id,
            genero_id: genero._id,
            data_publicacao: new Date("1899-01-01")
        });
        console.log("Livro criado:", livro);

        console.log("Livro criado:", livro);

        // ADICIONE ESTAS LINHAS DE DEBUG:

        // Buscar diretamente sem populate
        const livroSemPopulate = await Livros.findById(livro._id);
        console.log("Livro buscado SEM populate:", livroSemPopulate);

        // Contar quantos livros existem
        const totalLivros = await Livros.countDocuments();
        console.log("Total de livros no banco:", totalLivros);

        // Listar TODOS os livros
        const todosLivros = await Livros.find();
        console.log("Todos os livros:", todosLivros);

        // Verificar em qual collection está salvando
        console.log("Collection name:", Livros.collection.name);

        // Aguardar um pouco antes de buscar
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Buscar livro com populate
        const livroBuscado = await Livros.findById(livro._id)
            .populate('autor_id')
            .populate('genero_id');
        console.log("Livro com dados populados:", livroBuscado);

        // Fechar conexão graciosamente
        await mongoose.connection.close();
        console.log("Conexão encerrada");
        process.exit(0);
    } catch (error) {
        console.error("Erro:", error);
        process.exit(1);
    }
}

testar();