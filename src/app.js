const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

    return response.json(repositories); // Listagem de todos os repositórios
});

app.post("/repositories", (request, response) => {

    const {title, url, techs} = request.body;

    const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
    }

    repositories.push(repository);

    return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {

  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // Verificação da não existência do repositório:
  
  if (repositoryIndex === -1)
  {
    return response.status(400).json({error: 'Repository does not exist.'});
  }
  

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes // Impedindo a alteração manual do número de likes
  };

  repositories[repositoryIndex] = repository;
 
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  
  const {id} = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id); // Retorna -1, por isso a verificação se repositoryIndex < 0

  if(repositoryIndex >= 0)
  {
    repositories.splice(repositoryIndex, 1);
  }
  else
  {
    return response.status(400).json({error: 'Repository does not exist.'})
  }

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => { // Rota que aumenta o número de likes
  
    const {id} = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if(repositoryIndex === -1)
    {
      return response.status(400).json({error: 'Repository does not exist.'});
    }

    repositories[repositoryIndex].likes += 1;

    return response.json(repositories[repositoryIndex]);
});

module.exports = app;