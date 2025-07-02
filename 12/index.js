// Importa o módulo Express para usar suas funcionalidades 
const express = require("express");
const path = require("path");

const cors = require('cors');
// Cria uma instância do aplicativo Express
const app = express();

app.use(cors()); // Permite requisições de outros domínios (CORS)
app.use(express.json()); // Permite que o Express entenda JSON

// Serve os arquivos estáticos da pasta 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));

// Importa as rotas definidas em pessoa.js
const pessoaRouter = require('./rotas/pessoa');

// Usa o router definido para o caminho "/api" para não conflitar com o frontend
app.use('/api', pessoaRouter);


// Executa o projeto na porta especificada 
app.listen(8080, () => {
    console.log('Servidor rodando em http://localhost:8080');
});