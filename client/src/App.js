import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Fornecedor from './components/fornecedor';
import Produto from './components/produto';
import './App.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fornecedor" element={<Fornecedor />} />
          <Route path="/fornecedores" element={<Fornecedor />} />
          <Route path="/produto" element={<Produto />} />
          <Route path="/produtos" element={<Produto />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
