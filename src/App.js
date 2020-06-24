import React, { useState, useEffect } from "react";

import "./styles.css";
import api from "./services/api";


function App() {
  //criando o array de repositorios com a utilizacao do useState
  const [repositories, setRepositories] = useState([]);

  //lendo todos os objetos contidos na api e inserindo dentro do array
  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);
  //funcao que insere objeto na api
  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: `New Repo ${Date.now()}`,
      url: "http://git.com",
      techs: "reactjs, react, nodejs"
    });
    
    const repository = response.data;
    //atualizando  o useState pra atualizar o frontend
    setRepositories([...repositories, repository]);

  }
  //funcao que deleta objeto na api
  async function handleRemoveRepository(id) {
    const response = await api.delete(`repositories/${id}`);
    //verifica a resposta e caso o objeto tenah sido deletado, deleta o objeto do array e atualiza o frontend
    if (response.status === 204) {
      const repositoryIndex = repositories.findIndex(repository => repository.id === id);
      repositories.splice(repositoryIndex, 1);
      setRepositories([...repositories]);
    };
    
  }
  //gerando a tabela e preenchendo com os itens do array juntamente com um botao de delete para cada item.
  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => <li key={repository.id}>
          {repository.title}
          <button onClick={() => handleRemoveRepository(repository.id)}>
            Remover
          </button>
        </li>)}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
