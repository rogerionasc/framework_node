import React from 'react';
import './Home.css';

const Home = () => {

  return (
    <div className="home-container">
      <div className="welcome-card">
        <h1 className="welcome-title">
          Bem-vindo ao Sistema de Gestão
        </h1>
        <div className="welcome-actions">
          <a href="/fornecedores" className="action-btn primary">
            Fornecedores
          </a>
          <a href="/produtos" className="action-btn primary">
            Produtos
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;