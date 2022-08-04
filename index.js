const express = require('express');
const bodyParser = require('body-parser');
const rescue = require('express-rescue'); // É um wrapper que ajuda os middlewares assíncronos
const crypto = require('crypto');
const talk = require('./fs');

const {
  isAuthEmail,
  isAuthPassword,
  isAuthToken,
  isAuthName,
  isAuthAge,
  isAuthTalk,
  isAuthRate,
  isAuthWatched,
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
app.post('/login', isAuthEmail, isAuthPassword, (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');

  req.token = token;
  res.status(200).json({ token });
});

// Requisito 05 - Criando o endpoint POST /talker
app.post(
  '/talker',
  isAuthToken,
  isAuthName,
  isAuthAge,
  isAuthTalk,
  isAuthRate,
  isAuthWatched,
  rescue(async (req, res) => {
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const talker = await talk.getTalk();
    const newTalker = {
      id: talker.length + 1,
      name,
      age,
      talk: {
        watchedAt,
        rate,
      },
    };
    const newTalkers = [...talker, newTalker];

    await talk.setTalk(newTalkers);
    res.status(201).json(newTalker);
  }),
);