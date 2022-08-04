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

// Requisito 01 - Criando um endpoint GET /talker (Retorna uma pessoa palestrante)
app.get('/talker', rescue(async (req, res) => {
  const talker = await talk.getTalk();

  res.status(200).json(talker);
}));

// Requisito 02 - Criando o endpoint GET /talker/:id (Retorna uma pessoa palestrante)
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

// Requisito 05 - Criando o endpoint POST /talker (Adiciona uma pessoa palestrante)
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

// Requisito 6 - Crie o endpoint PUT /talker/:id (Editar uma pessoa palestrante)
app.put(
  '/talker/:id',
  isAuthToken,
  isAuthName,
  isAuthAge,
  isAuthTalk,
  isAuthRate,
  isAuthWatched,
  rescue(async (req, res) => {
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const { id } = req.params;
    const talker = await talk.getTalk();
    const talkToUpdate = talker.findIndex((e) => e.id === parseInt(id, 10));
    const talkUpdate = {
      id: parseInt(id, 10),
      name,
      age,
      talk: {
        watchedAt,
        rate,
      },
    };
    const newTalkers = [...talker];
    newTalkers[talkToUpdate] = talkUpdate;
    await talk.setTalk(newTalkers);
    res.status(200).json(talkUpdate);
  }),
);

// Requisito 7 - Crie o endpoint DELETE /talker/:id (Deletar uma pessoa palestrante)
app.delete('/talker/:id', isAuthToken, rescue(async (req, res) => {
  const { id } = req.params;
  const talker = await talk.getTalk();
  const talkToDelete = talker.findIndex((e) => e.id !== talker.length - 1);

  await talk.setTalk(talkToDelete);
  res.status(204).json(talkToDelete);
}));