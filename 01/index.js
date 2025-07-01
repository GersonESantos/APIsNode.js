// Importa o módulo Express para usar suas funcionalidades 
const express = require("express");

// Cria uma instância do aplicativo Express
const app = express();

// Define uma rota GET para o caminho raiz ("/") 
app.get('/', (req, res) => {
    // Envia a resposta "Hello World!" para quem acessar a rota "/" 
    res.send('Hello World!');
});

// Executa o projeto na porta especificada 
app.listen(8080, () => {
    console.log('Servidor rodando em http://localhost:8080');
});