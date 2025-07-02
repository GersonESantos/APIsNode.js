// Importa o módulo Express para usar suas funcionalidades 
const express = require("express");

// Cria uma instância do aplicativo Express
const app = express();

app.use(express.json()); // Permite que o Express entenda JSON 

// Importa as rotas definidas em pessoa.js
const pessoaRouter = require('./rotas/pessoa');

// Usa o router definido para o caminho "/pessoa"
app.use('/', pessoaRouter);


// Executa o projeto na porta especificada 
app.listen(8080, () => {
    console.log('Servidor rodando em http://localhost:8080');
});