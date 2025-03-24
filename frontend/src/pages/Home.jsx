import React from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();  
  const { first_name, email } = location.state || {}; 

  return (
    <div>
      <h1>Bienvenue sur la page d'accueil</h1>
      {first_name && email ? (
        <div>
          <p><strong>Nom : </strong>{first_name}</p>
          <p><strong>Email : </strong>{email}</p>
        </div>
      ) : (
        <p>Aucune information utilisateur disponible.</p>
      )}
    </div>
  );
};

export default Home;
