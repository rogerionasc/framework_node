import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Fornecedor.css';

const Fornecedor = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    contato_principal: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Estados para gerenciar produtos no modal
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(false);

  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const response = await fetch('./api/fornecedores');
      if (!response.ok) {
        throw new Error('Falha ao carregar dados dos fornecedores');
      }
      const result = await response.json();
      setData(result.data || result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProdutos = async () => {
    try {
      setLoadingProdutos(true);
      const response = await fetch('./api/produtos');
      if (!response.ok) {
        throw new Error('Falha ao carregar produtos');
      }
      const result = await response.json();
      setProdutosDisponiveis(result.data?.produtos || []);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoadingProdutos(false);
    }
  };

  useEffect(() => {
    fetchFornecedores();
    fetchProdutos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const url = editingId ? `./api/fornecedores/${editingId}` : './api/fornecedores';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData.message || `Erro HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      const fornecedorId = result.data?.id || editingId;
      
      // Gerenciar produtos vinculados
      if (produtosSelecionados.length > 0) {
        if (editingId) {
          // Se estiver editando, primeiro remover todos os produtos vinculados
          try {
            await fetch(`./api/fornecedores/${editingId}/produtos`, {
              method: 'DELETE'
            });
          } catch (error) {
            console.error('Erro ao remover produtos vinculados:', error);
          }
        }
        
        // Vincular produtos selecionados
        for (const produto of produtosSelecionados) {
          try {
            await fetch('./api/fornecedor-produto/vincular', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fornecedor_id: fornecedorId,
                produto_id: produto.id,
                preco_fornecedor: produto.preco || null
              })
            });
          } catch (error) {
            console.error('Erro ao vincular produto:', error);
          }
        }
      } else if (editingId) {
        // Se não há produtos selecionados e está editando, remover todos
        try {
          await fetch(`./api/fornecedores/${editingId}/produtos`, {
            method: 'DELETE'
          });
        } catch (error) {
          console.error('Erro ao remover produtos vinculados:', error);
        }
      }
      
      // Reset form and close modal
      setFormData({
        nome: '',
        cnpj: '',
        email: '',
        telefone: '',
        endereco: '',
        contato_principal: ''
      });
      setProdutosSelecionados([]);
      setShowModal(false);
      setEditingId(null);
      
      await fetchFornecedores();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (fornecedor) => {
    setFormData({
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      email: fornecedor.email,
      telefone: fornecedor.telefone,
      endereco: fornecedor.endereco,
      contato_principal: fornecedor.contato_principal || ''
    });
    setEditingId(fornecedor.id);
    
    // Carregar produtos vinculados ao fornecedor
    try {
      setLoadingProdutos(true);
      const response = await fetch(`./api/fornecedores/${fornecedor.id}/produtos`);
      if (response.ok) {
        const result = await response.json();
        const produtosVinculados = result.data?.produtos || [];
        setProdutosSelecionados(produtosVinculados.map(produto => ({
          ...produto,
          preco: produto.preco_fornecedor || ''
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar produtos do fornecedor:', error);
    } finally {
      setLoadingProdutos(false);
    }
    
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    
    setSubmitting(true);
    try {
      const response = await fetch(`./api/fornecedores/${deletingId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData.message || `Erro HTTP ${response.status}: ${errorText}`);
      }
      
      setShowDeleteModal(false);
      setDeletingId(null);
      await fetchFornecedores();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      nome: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: '',
      contato_principal: ''
    });
  };



  if (loading) {
    return (
      <div className="fornecedor-container">
        <div className="fornecedor-card">
          <p>Carregando fornecedores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fornecedor-container">
        <div className="fornecedor-card">
          <p>Erro: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fornecedor-container">
      <div className="fornecedor-header">
        <div className="header-content">
          <h1 className="fornecedor-title">{data?.title || 'Gestão de Fornecedores'}</h1>
          <p className="fornecedor-subtitle">
            {data?.subtitle || 'Gerencie seus fornecedores de forma eficiente'}
          </p>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/')}
          >
            <span className="btn-icon"><i className="fas fa-home"></i></span>
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowModal(true)}
            style={{marginLeft: '15px'}}
          >
            <span className="btn-icon">+</span>
            Novo Fornecedor
          </button>
        </div>
      </div>

      <div className="fornecedor-list">
        <div className="list-header">
          <h2>Registros de Fornecedores</h2>
        </div>
        
        <div className="fornecedor-table">
          <div className="table-header">
            <div className="table-cell">Nome</div>
            <div className="table-cell">CNPJ</div>
            <div className="table-cell">Email</div>
            <div className="table-cell">Telefone</div>
            <div className="table-cell">Ações</div>
          </div>
          
          {data?.fornecedores && data.fornecedores.length > 0 ? (
            data.fornecedores.map((fornecedor) => (
              <div key={fornecedor.id} className="table-row">
                <div className="table-cell">{fornecedor.nome}</div>
                <div className="table-cell">{fornecedor.cnpj}</div>
                <div className="table-cell">{fornecedor.email}</div>
                <div className="table-cell">{fornecedor.telefone}</div>
                <div className="table-cell">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(fornecedor)}
                  >
                    Editar
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(fornecedor.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="table-row no-data">
              <div className="table-cell no-data-cell" colSpan="5">
                Nenhum registro encontrado
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal para Novo Fornecedor */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
              <button 
                className="close-btn" 
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="fornecedor-form">
              <div className="form-group">
                <label htmlFor="nome">Nome *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  placeholder="Nome do fornecedor"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group form-group-half">
                  <label htmlFor="cnpj">CNPJ *</label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    required
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                
                <div className="form-group form-group-half">
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="text"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group form-group-half">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div className="form-group form-group-half">
                  <label htmlFor="contato_principal">Contato Principal</label>
                  <input
                    type="text"
                    id="contato_principal"
                    name="contato_principal"
                    value={formData.contato_principal}
                    onChange={handleInputChange}
                    placeholder="Nome do contato principal"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="endereco">Endereço</label>
                <textarea
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  placeholder="Endereço completo"
                  rows="3"
                ></textarea>
              </div>
              
              {/* Seção de Produtos */}
              {(
                <div className="produtos-section">
                  <h3>{editingId ? 'Gerenciar Produtos' : 'Produtos'}</h3>
                  <div className="produtos-container">
                    <div className="produtos-disponiveis">
                      <label>{editingId ? 'Adicionar Produtos:' : 'Produtos Disponíveis:'}</label>
                      {loadingProdutos ? (
                        <p>Carregando produtos...</p>
                      ) : (
                        <div className="produtos-list">
                          {produtosDisponiveis.map(produto => (
                            <div key={produto.id} className="produto-item">
                              <input
                                type="checkbox"
                                id={`produto-${produto.id}`}
                                checked={produtosSelecionados.some(p => p.id === produto.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setProdutosSelecionados(prev => [...prev, { ...produto, preco: '' }]);
                                  } else {
                                    setProdutosSelecionados(prev => prev.filter(p => p.id !== produto.id));
                                  }
                                }}
                              />
                              <label htmlFor={`produto-${produto.id}`}>
                                {produto.nome} - R$ {produto.preco}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {produtosSelecionados.length > 0 && (
                      <div className="produtos-selecionados">
                        <label>{editingId ? 'Produtos Vinculados:' : 'Produtos Selecionados:'}</label>
                        <div className="produtos-list">
                          {produtosSelecionados.map(produto => (
                            <div key={produto.id} className="produto-selecionado">
                              <span>{produto.nome}</span>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Preço do fornecedor"
                                value={produto.preco}
                                onChange={(e) => {
                                  setProdutosSelecionados(prev => 
                                    prev.map(p => 
                                      p.id === produto.id 
                                        ? { ...p, preco: e.target.value }
                                        : p
                                    )
                                  );
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setProdutosSelecionados(prev => prev.filter(p => p.id !== produto.id));
                                }}
                                className="btn-remove"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={submitting}
                >
                  {submitting ? (editingId ? 'Atualizando...' : 'Salvando...') : (editingId ? 'Atualizar' : 'Salvar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmar Exclusão</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <p>Tem certeza que deseja excluir este fornecedor?</p>
              <p className="warning-text">Esta ação não pode ser desfeita.</p>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn-delete"
                onClick={confirmDelete}
                disabled={submitting}
              >
                {submitting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
      

    </div>
  );
};

export default Fornecedor;