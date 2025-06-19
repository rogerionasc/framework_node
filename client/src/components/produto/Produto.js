import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Produto.css';

const Produto = ({ data }) => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduto, setEditingProduto] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    codigo_barras: '',
    categoria: '',
    data_validade: '',

  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (data?.produtos) {
      setProdutos(data.produtos);
    } else {
      // Carregar produtos automaticamente se não foram passados via props
      fetchProdutos();
    }
  }, [data]);

  useEffect(() => {
    // Carregar produtos na montagem do componente
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
    setLoading(true);
    setError('');

    try {
      const url = editingProduto 
        ? `/api/produtos/${editingProduto.id}`
        : '/api/produtos';
      
      const method = editingProduto ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Recarregar a lista de produtos
        await fetchProdutos();
        handleCloseModal();
      } else {
        setError(result.message || 'Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      setError('Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  const fetchProdutos = async () => {
    try {
      const response = await fetch('/api/produtos');
      const result = await response.json();
      
      if (result.success) {
        setProdutos(result.data.produtos);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleEdit = (produto) => {
    setEditingProduto(produto);
    setFormData({
      nome: produto.nome || '',
      descricao: produto.descricao || '',
      codigo_barras: produto.codigo_barras || '',
      categoria: produto.categoria || '',
      data_validade: produto.data_validade || '',

    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/produtos/${deletingId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setShowDeleteModal(false);
        setDeletingId(null);
        await fetchProdutos();
      } else {
        setError(result.message || 'Erro ao excluir produto');
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      setError('Erro ao excluir produto');
    } finally {
      setLoading(false);
    }
  };

  const handleNewProduto = () => {
    setEditingProduto(null);
    setFormData({
      nome: '',
      descricao: '',
      codigo_barras: '',
      categoria: '',
      data_validade: '',

    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduto(null);
    setError('');
    setFormData({
      nome: '',
      descricao: '',
      codigo_barras: '',
      categoria: '',
      data_validade: '',

    });
  };

  return (
    <div className="produto-container">
      <div className="produto-header">
        <div className="header-content">
          <h1>{data?.title || 'Gestão de Produtos'}</h1>
          <p className="subtitle">{data?.subtitle || 'Gerencie seus produtos de forma eficiente'}</p>
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
            onClick={handleNewProduto}
            style={{marginLeft: '15px'}}
          >
            <span className="btn-icon">+</span>
            Novo Produto
          </button>
        </div>
      </div>

      <div className="produto-stats">
        <div className="stat-card">
          <div className="stat-number">{produtos.length}</div>
          <div className="stat-label">Total de Produtos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{produtos.filter(p => p.data_validade && new Date(p.data_validade) > new Date()).length}</div>
          <div className="stat-label">Produtos Válidos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{produtos.filter(p => p.categoria).length}</div>
          <div className="stat-label">Com Categoria</div>
        </div>
      </div>

      <div className="produto-list">
        <div className="list-header">
          <h2>Registros de Produtos</h2>
        </div>
        
        <div className="produto-table">
          <div className="table-header">
            <div className="table-cell">Nome</div>
            <div className="table-cell">Código de Barras</div>
            <div className="table-cell">Categoria</div>
            <div className="table-cell">Data de Validade</div>
            <div className="table-cell">Ações</div>
          </div>
          
          {produtos && produtos.length > 0 ? (
            produtos.map((produto) => (
              <div key={produto.id} className="table-row">
                <div className="table-cell">{produto.nome}</div>
                <div className="table-cell">{produto.codigo_barras || 'N/A'}</div>
                <div className="table-cell">{produto.categoria || 'N/A'}</div>
                <div className="table-cell">
                  {produto.data_validade ? new Date(produto.data_validade).toLocaleDateString('pt-BR') : 'N/A'}
                </div>
                <div className="table-cell">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(produto)}
                  >
                    Editar
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(produto.id)}
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
      
      {/* Modal para Novo Produto */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduto ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="produto-form">
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nome">Nome *</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Digite o nome do produto"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="codigo_barras">Código de Barras</label>
                  <input
                    type="text"
                    id="codigo_barras"
                    name="codigo_barras"
                    value={formData.codigo_barras}
                    onChange={handleInputChange}
                    placeholder="Digite o código de barras"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="categoria">Categoria</label>
                  <input
                    type="text"
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    placeholder="Digite a categoria"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="data_validade">Data de Validade</label>
                  <input
                    type="date"
                    id="data_validade"
                    name="data_validade"
                    value={formData.data_validade}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Digite a descrição do produto"
                  rows="3"
                />
              </div>
              

              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : (editingProduto ? 'Atualizar' : 'Criar')}
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
              <p>Tem certeza que deseja excluir este produto?</p>
              <p className="warning-text">Esta ação não pode ser desfeita.</p>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn-delete"
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produto;