// Importa o módulo Express para usar suas funcionalidades 
const express = require("express");

// Cria uma instância do aplicativo Express
const app = express();

// Vetor de pessoas com código, nome, idade e cidade
let pessoas = [
  { "codigo": 1, "nome": "Ana Souza", "idade": 28, "cidade": "São Paulo" },
  { "codigo": 2, "nome": "Bruno Oliveira", "idade": 34, "cidade": "Rio de Janeiro" },
  { "codigo": 3, "nome": "Carla Mendes", "idade": 22, "cidade": "Belo Horizonte" },
  { "codigo": 4, "nome": "Diego Lima", "idade": 40, "cidade": "Curitiba" },
  { "codigo": 5, "nome": "Eduarda Costa", "idade": 30, "cidade": "Porto Alegre" },
  { "codigo": 6, "nome": "Felipe Rocha", "idade": 26, "cidade": "Brasília" },
  { "codigo": 7, "nome": "Gabriela Martins", "idade": 31, "cidade": "Recife" },
  { "codigo": 8, "nome": "Henrique Silva", "idade": 29, "cidade": "Fortaleza" },
  { "codigo": 9, "nome": "Isabela Ferreira", "idade": 25, "cidade": "Salvador" },
  { "codigo": 10, "nome": "João Pedro Ramos", "idade": 33, "cidade": "Natal" }
];


// Define uma rota GET para o caminho raiz ("/") 
app.get('/', (req, res) => {
    
    res.json(pessoas);
        
});

// Rota para exibir uma pessoa específica através do código
app.get('/:codigo', (req, res) => {
  // Obter o código
  const codigo = parseInt(req.params.codigo);

  res.send(codigo);
});

// Executa o projeto na porta especificada 
app.listen(8080, () => {
    console.log('Servidor rodando em http://localhost:8080');
});