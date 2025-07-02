const { MongoClient } = require('mongodb');

// Usando as variáveis do .env
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri);

let pessoasCollection;

async function conectarMongo() {
  try {
    await client.connect();
    console.log('MongoDB conectado com sucesso!');

    const db = client.db(dbName); // Usa o nome do banco do .env
    pessoasCollection = db.collection('pessoas');
  } catch (err) {
    console.error('Erro ao conectar com o MongoDB:', err);
  }
}

function getPessoasCollection() {
  if (!pessoasCollection) {
    throw new Error('Coleção não conectada.');
  }
  return pessoasCollection;
}

module.exports = { conectarMongo, getPessoasCollection };