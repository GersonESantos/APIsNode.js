// Importa o módulo Express para usar suas funcionalidades 

require('dotenv').config(); // Carrega as variáveis do .env
const express = require("express");
const path = require("path");

const cors = require('cors');
// Cria uma instância do aplicativo Express

// Importando a função `conectarMongo` do arquivo `conexao/mongo.js`
const { conectarMongo } = require('./conexao/mongo');

const app = express();

app.use(cors()); // Permite requisições de outros domínios (CORS)
app.use(express.json()); // Permite que o Express entenda JSON

// Serve os arquivos estáticos da pasta 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));

// Importa as rotas definidas em pessoa.js
const pessoaRouter = require('./rotas/pessoa');
const pessoaMongoRouter = require('./rotas/pessoaMongo');
// Usa o router definido para o caminho "/api" para não conflitar com o frontend
app.use('/pessoa', pessoaRouter);
app.use('/pessoaMongo', pessoaMongoRouter);


// Executa o projeto na porta especificada 
// Chamar a função `conectarMongo()` para estabelecer a conexão
conectarMongo().then(() => {
  // Após a conexão com o MongoDB ser bem-sucedida, o servidor Express é iniciado
  app.listen(5500, () => console.log('Servidor rodando na porta 5050 e conectado ao MongoDB'));
  
}).catch(err => {
  // Caso ocorra algum erro, ele será exibido no console e a aplicação não será iniciada.
  console.error('Erro ao conectar ao MongoDB ou iniciar o servidor:', err);
});