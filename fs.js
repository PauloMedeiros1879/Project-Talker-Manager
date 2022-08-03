const fs = require('fs').promises;

function getTalk() {
  const talker = fs.readFile('./talker.json', 'utf-8')
    .then((fileContent) => JSON.parse(fileContent))
    .catch((_error) => []); 

  return talker;
}

function setTalk(newTalk) {
  return fs.writeFile('./talker.json', JSON.stringify(newTalk));
}

module.exports = { getTalk, setTalk };