const express = require('express');
const bodyParser = require('body-parser');
const rescue = require('express-rescue'); // É um wrapper que ajuda os middlewares assíncronos
const talk = require('./fs');

const {
  isAuthEmail,
  isAuthPassword,
} = require('./authentication');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

// Requisito 01 - Criando um endpoint GET /talker
app.get('/talker', rescue(async (req, res) => {
  const talker = await talk.getTalk();
  res.status(200).json(talker);
}));

// Requisito 02 - Criando o endpoint GET /talker/:id
app.get('/talker/:id', rescue(async (req, res) => {
  const { id } = req.params;
  const talker = await talk.getTalk();
  const talkerFindId = talker.find((e) => e.id === parseInt(id, 10));

  if (!talkerFindId) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' }); 

  res.status(200).json(talkerFindId);
}));

// Requisito 03 - Criando o endpoint POST /login
app.post('/login', isAuthEmail, isAuthPassword, (_req, res) => {
  res.status(200).json({ token: '7mqaVRXJSp886CGr' });
});