// Requisito 4 - Adiciona as validações para o endpoint /login
const isAuthEmail = (req, res, next) => {
  const { email } = req.body;

  const authEmailInputRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const authEmail = authEmailInputRegex.test(email);

  if (!email || email === '') { 
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }

  if (!authEmail) { 
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }  

  next();
};

const isAuthPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password || password === '') { 
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) { 
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

// Requisito 5 - 
const isAuthToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || token === '') {
    return res.status(401).json({ message: 'Token não encontrado' });
  } 
  if (token.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

const isAuthName = (req, res, next) => {
  const { name } = req.body;
  if (!name || name === '') {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const isAuthAge = (req, res, next) => {
  const { age } = req.body;
  if (!age || age === undefined) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

const isAuthTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk || talk === undefined) {
    return (
      res.status(400).json(
        { message: 'O campo "talk" é obrigatório' },
      )
    );
  }
  next();
};

const isAuthWatched = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  if (!watchedAt || watchedAt === undefined) {
    return (
      res.status(400).json(
        { message: 'O campo "watchedAt" é obrigatório' },
      )
    );
  }
  const regex = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
  if (!regex.test(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const isAuthRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (!rate && rate !== 0) {
    return (
      res.status(400).json(
        { message: 'O campo "rate" é obrigatório' },
      )
    );
  }
  if (rate < 1 || rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

module.exports = {
  isAuthEmail,
  isAuthPassword,
  isAuthToken,
  isAuthName,
  isAuthAge,
  isAuthTalk,
  isAuthRate,
  isAuthWatched,
 };