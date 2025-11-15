# 📚 Sistema de Gerenciamento de Biblioteca

> API REST para gerenciamento de autores e livros com interface React

## 📋 Descrição

Sistema completo de gerenciamento de biblioteca desenvolvido como projeto de estudos, implementando uma API RESTful em Node.js com banco de dados MongoDB e interface web em React para consumo dos dados.

O sistema permite cadastrar autores e seus respectivos livros, mantendo o relacionamento entre as collections e oferecendo operações completas de CRUD.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web para Node.js
- **MongoDB** - Banco de dados NoSQL orientado a documentos
- **Mongoose** - ODM (Object Data Modeling) para MongoDB

### Frontend
- **React** - Biblioteca JavaScript para construção de interfaces
- **Axios** - Cliente HTTP para requisições à API

## 📊 Modelagem de Dados

### Collection: Autores
```json
{
  "_id": "ObjectId",
  "nome": "String",
  "nacionalidade": "String",
  "dataNascimento": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection: Livros
```json
{
  "_id": "ObjectId",
  "titulo": "String",
  "autor_id": "ObjectId (ref: Autor)",
  "isbn": "String",
  "anoPublicacao": "Number",
  "genero": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Relacionamento:** Um autor pode ter vários livros (1:N)

## 🛠️ Estrutura do Projeto

```
biblioteca-sistema/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── Autor.js
│   │   │   └── Livro.js
│   │   ├── controllers/
│   │   │   ├── autorController.js
│   │   │   └── livroController.js
│   │   └── routes/
│   │       ├── autorRoutes.js
│   │       └── livroRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── AutorForm.js
    │   │   ├── AutorList.js
    │   │   ├── LivroForm.js
    │   │   └── LivroList.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    ├── .gitignore
    └── package.json
```

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [MongoDB](https://www.mongodb.com/try/download/community) (local) ou conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud gratuito)
- [Git](https://git-scm.com/)
- Editor de código (recomendado: [VS Code](https://code.visualstudio.com/))

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-seu-repositorio>
cd biblioteca-sistema
```

### 2. Configurar Backend

```bash
# Navegar para pasta backend
cd backend

# Instalar dependências
npm install

# Criar arquivo .env na raiz da pasta backend
# Adicionar a variável:
MONGODB_URI=mongodb://localhost:27017/biblioteca
# ou se usar MongoDB Atlas:
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/biblioteca

# Iniciar servidor de desenvolvimento
npm run dev
```

O servidor estará rodando em: `http://localhost:5000`

### 3. Configurar Frontend

```bash
# Abrir novo terminal e navegar para pasta frontend
cd frontend

# Instalar dependências
npm install

# Iniciar aplicação React
npm start
```

A aplicação estará rodando em: `http://localhost:3000`

## 🌐 Endpoints da API

### Autores

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/autores` | Lista todos os autores |
| GET | `/autores/:id` | Busca autor por ID |
| POST | `/autores` | Cria novo autor |
| PUT | `/autores/:id` | Atualiza autor existente |
| DELETE | `/autores/:id` | Remove autor |

### Livros

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/livros` | Lista todos os livros (com dados do autor) |
| GET | `/livros/:id` | Busca livro por ID |
| POST | `/livros` | Cria novo livro |
| PUT | `/livros/:id` | Atualiza livro existente |
| DELETE | `/livros/:id` | Remove livro |

## 📝 Exemplos de Uso da API

### Criar Autor
```bash
POST http://localhost:5000/autores
Content-Type: application/json

{
  "nome": "Machado de Assis",
  "nacionalidade": "Brasileiro",
  "dataNascimento": "1839-06-21"
}
```

### Criar Livro
```bash
POST http://localhost:5000/livros
Content-Type: application/json

{
  "titulo": "Dom Casmurro",
  "autor_id": "ID_DO_AUTOR_AQUI",
  "isbn": "978-8535908777",
  "anoPublicacao": 1899,
  "genero": "Romance"
}
```

## 🧪 Testando a API

Recomenda-se usar uma das ferramentas:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- Extensão REST Client do VS Code

## 📚 Funcionalidades

### Backend
- ✅ CRUD completo de Autores
- ✅ CRUD completo de Livros
- ✅ Relacionamento entre collections
- ✅ Validação de dados
- ✅ Tratamento de erros
- ✅ Populate de dados relacionados

### Frontend
- ✅ Listagem de autores
- ✅ Cadastro de autores
- ✅ Listagem de livros com nome do autor
- ✅ Cadastro de livros
- ✅ Interface responsiva básica

## 🎯 Próximos Passos (Melhorias Futuras)

- [ ] Implementar autenticação JWT
- [ ] Adicionar paginação nas listagens
- [ ] Implementar busca e filtros avançados
- [ ] Adicionar validações no frontend
- [ ] Implementar edição e exclusão no frontend
- [ ] Adicionar testes unitários e de integração
- [ ] Melhorar interface com biblioteca de componentes (Material-UI, etc)

## 👨‍💻 Autor

**Seu Nome Aqui**
- GitHub: [@Felipe-SMZ](https://github.com/Felipe-SMZ)
- LinkedIn: [Felipe Shimizu](https://www.linkedin.com/in/felipesshimizu)
- Portifólio: [Dev Felipe](https://www.devfelipeshimizu.me/)

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.


---

⭐ Desenvolvido como projeto de estudos - Node.js + MongoDB + React
