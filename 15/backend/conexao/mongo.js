// Importando a classe MongoClient do pacote 'mongodb'.
const { MongoClient } = require('mongodb');

// A URI de conexão é lida da variável de ambiente.
const uri = process.env.MONGO_URI;

// Valida se a URI do MongoDB foi carregada ANTES de tentar criar o client.
if (!uri) {
  throw new Error('A variável de ambiente MONGO_URI não está definida. Verifique se o arquivo .env existe e se o pacote dotenv está instalado e configurado corretamente.');
}

// Criando uma instância do MongoClient, que será usada para estabelecer a conexão com o banco de dados.
const client = new MongoClient(uri);

// Variável para armazenar a coleção 'pessoas' que será usada nas operações CRUD.
let pessoasCollection;

// Função assíncrona para conectar ao MongoDB.
async function conectarMongo() {
  try {
    // Usando o `await` para aguardar a conexão do MongoDB ser estabelecida através da URI fornecida.
    await client.connect();
    
    // Após a conexão bem-sucedida, acessamos o banco de dados 'api_db'.
    const db = client.db('api_db');
    
    // Agora que temos o banco de dados, acessamos a coleção 'pessoas' e armazenamos em `pessoasCollection` para uso posterior.
    pessoasCollection = db.collection('pessoas');
    
    // Exibimos uma mensagem no console caso a conexão seja bem-sucedida.
    console.log('MongoDB conectado com sucesso!');
  } catch (err) {
    // Se houver algum erro durante a conexão com o MongoDB, ele será capturado aqui.
    console.error('Erro ao conectar com o MongoDB:', err);
  }
}

// Função para obter a coleção 'pessoas' após a conexão com o MongoDB.
function getPessoasCollection() {
  // Se a coleção não foi definida (caso a conexão não tenha ocorrido com sucesso),
  if (!pessoasCollection) {
    throw new Error('Coleção não conectada.');
  }
  
  // Se a coleção foi conectada, retornamos o objeto da coleção 'pessoas',
  return pessoasCollection;
}

// Exportando as funções para que possam ser usadas em outras partes do código.
module.exports = { conectarMongo, getPessoasCollection };
