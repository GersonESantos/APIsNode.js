const express = require('express');
const router = express.Router();
const { getPessoasCollection } = require('../conexao/mongo');
const { ObjectId } = require('mongodb'); // Essencial para buscar por ID

// Função auxiliar para simplificar o tratamento de erros em rotas assíncronas
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ROTA GET /api/ - Listar todas as pessoas
router.get('/', asyncHandler(async (req, res) => {
    const collection = getPessoasCollection();
    const pessoas = await collection.find({}).toArray();
    res.json(pessoas);
}));

// ROTA GET /api/:id - Buscar uma pessoa pelo ID
router.get('/:id', asyncHandler(async (req, res) => {
    const collection = getPessoasCollection();
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'O ID fornecido é inválido.' });
    }
    const pessoa = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!pessoa) {
        return res.status(404).json({ msg: 'Pessoa não encontrada.' });
    }
    res.json(pessoa);
}));

// ROTA POST /api/ - Cadastrar uma nova pessoa
router.post('/', asyncHandler(async (req, res) => {
    const { nome, idade, cidade } = req.body;
    if (!nome || !idade || !cidade) {
        return res.status(400).json({ msg: 'Dados incompletos. Forneça nome, idade e cidade.' });
    }
    const collection = getPessoasCollection();
    const novaPessoa = { nome, idade: parseInt(idade, 10), cidade };
    const result = await collection.insertOne(novaPessoa);
    
    // Retorna o documento recém-criado com o _id gerado pelo MongoDB
    const documentoInserido = { _id: result.insertedId, ...novaPessoa };
    res.status(201).json(documentoInserido);
}));

// ROTA PUT /api/:id - Atualizar uma pessoa
router.put('/:id', asyncHandler(async (req, res) => {
    const { nome, idade, cidade } = req.body;
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'O ID fornecido é inválido.' });
    }
    const collection = getPessoasCollection();
    const pessoaAtualizada = { nome, idade: parseInt(idade, 10), cidade };
    const result = await collection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: pessoaAtualizada }
    );
    if (result.matchedCount === 0) {
        return res.status(404).json({ msg: 'Pessoa não encontrada para atualizar.' });
    }
    res.json({ msg: 'Pessoa atualizada com sucesso.' });
}));

// ROTA DELETE /api/:id - Excluir uma pessoa
router.delete('/:id', asyncHandler(async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'O ID fornecido é inválido.' });
    }
    const collection = getPessoasCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
        return res.status(404).json({ msg: 'Pessoa não encontrada para excluir.' });
    }
    res.status(204).send(); // 204 No Content é uma boa resposta para um DELETE bem-sucedido
}));

module.exports = router;