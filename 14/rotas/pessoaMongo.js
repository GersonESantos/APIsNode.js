// Importar a dependência do Express
const express = require('express');

// Criar um objeto de rota
const router = express.Router();

// Importa o ObjectId, necessário para trabalhar com os _id dos documentos do MongoDB
const { ObjectId } = require('mongodb');

// Ter acesso a função responsável por obter os dados via MongoDB
const { getPessoasCollection } = require('../conexao/mongo');

// Função auxiliar para validar o ObjectId
function validarObjectId(codigo, res) {
  if (!ObjectId.isValid(codigo)) {
    res.status(400).json({ mensagem: 'Código inválido.' });
    return null;
  }
  return new ObjectId(codigo);
}

// GET /pessoas - Lista todas as pessoas
router.get('/', async (req, res) => {
  try {
    const pessoas = await getPessoasCollection().find().toArray();
    res.json(pessoas);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar pessoas' });
  }
});

// GET /pessoas/:codigo - Busca uma pessoa por ID (_id)
router.get('/:codigo', async (req, res) => {
  const objectId = validarObjectId(req.params.codigo, res);
  if (!objectId) return;

  try {
    const pessoa = await getPessoasCollection().findOne({ _id: objectId });
    if (!pessoa) {
      return res.status(404).json({ mensagem: 'Pessoa não encontrada.' });
    }
    res.json(pessoa);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar a pessoa' });
  }
});

// POST /pessoas - Cadastra uma nova pessoa
router.post('/', async (req, res) => {
  const { nome, idade, cidade } = req.body;

  if (!nome || !idade || !cidade) {
    return res.status(400).json({ mensagem: 'Nome, idade e cidade são obrigatórios.' });
  }

  try {
    const resultado = await getPessoasCollection().insertOne({ nome, idade, cidade });
    res.status(201).json({ id: resultado.insertedId, nome, idade, cidade });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar pessoa' });
  }
});

// PUT /pessoas/:codigo - Atualiza todos os campos de uma pessoa
router.put('/:codigo', async (req, res) => {
  const objectId = validarObjectId(req.params.codigo, res);
  if (!objectId) return;

  const { nome, idade, cidade } = req.body;

  if (!nome || !idade || !cidade) {
    return res.status(400).json({ mensagem: 'Nome, idade e cidade são obrigatórios.' });
  }

  try {
    const resultado = await getPessoasCollection().updateOne(
      { _id: objectId },
      { $set: { nome, idade, cidade } }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ mensagem: 'Pessoa não encontrada.' });
    }

    res.status(200).json({ id: req.params.codigo, nome, idade, cidade });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar pessoa', detalhes: err.message });
  }
});

// PATCH /pessoas/:codigo - Atualiza parcialmente os campos de uma pessoa
router.patch('/:codigo', async (req, res) => {
  const objectId = validarObjectId(req.params.codigo, res);
  if (!objectId) return;

  const { nome, idade, cidade } = req.body;
  const updateFields = {};

  if (nome !== undefined) updateFields.nome = nome;
  if (idade !== undefined) updateFields.idade = idade;
  if (cidade !== undefined) updateFields.cidade = cidade;

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ mensagem: 'Nenhum campo informado para atualização.' });
  }

  try {
    const resultado = await getPessoasCollection().updateOne(
      { _id: objectId },
      { $set: updateFields }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ mensagem: 'Pessoa não encontrada.' });
    }

    res.status(200).json({ id: req.params.codigo, ...updateFields });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar parcialmente a pessoa', detalhes: err.message });
  }
});

// DELETE /pessoas/:codigo - Remove uma pessoa pelo ID
router.delete('/:codigo', async (req, res) => {
  const objectId = validarObjectId(req.params.codigo, res);
  if (!objectId) return;

  try {
    const resultado = await getPessoasCollection().deleteOne({ _id: objectId });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ mensagem: 'Pessoa não encontrada.' });
    }

    res.status(200).json({ mensagem: 'Pessoa removida com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover pessoa', detalhes: err.message });
  }
});

// Exporta todas as rotas para uso no app principal
module.exports = router;

