// Importa o módulo Express para usar suas funcionalidades 
const express = require("express");

// Cria uma instância do aplicativo Express
const app = express();

app.use(express.json()); // Permite que o Express entenda JSON 

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
let indiceCadastro = 11

// Define uma rota GET para o caminho raiz ("/") 
app.get('/', (req, res) => {
    
    res.status(200).json(pessoas);
        
});

// Rota para exibir uma pessoa específica através do código
app.get('/:codigo', (req, res) => {
  // Obter o código
  const codigo = parseInt(req.params.codigo);

  // Localizar o objeto
  const pessoa = pessoas.find(obj => obj.codigo == codigo);

  // Exibir pessoa
  if(pessoa){
    res.status(200).json(pessoa);
  }else{
    res.status(404).json({mensagem:'Pessoa não encontrada.'});
  }
});
// Rota para cadastrar pessoas   
app.post('/', (req, res) => {
  // Extrair as características do objeto
  const { nome, idade, cidade } = req.body;

  // Caso o nome, idade ou cidade não sejam informados, retorna um status 400
  if (!nome || !idade || !cidade) {
    return res.status(400).json({ mensagem: "Nome, idade e cidade são obrigatórios." });
  }

  // Criar nova pessoa
  const novaPessoa = {
    codigo: indiceCadastro,
    nome,
    idade,
    cidade
  };

  // Incrementar variável indiceCadastro
  indiceCadastro++;

  // Adicionar ao vetor
  pessoas.push(novaPessoa);

  // Retornar a nova pessoa
  res.status(201).json(novaPessoa);
});
// Executa o projeto na porta especificada 
app.listen(8080, () => {
    console.log('Servidor rodando em http://localhost:8080');
});