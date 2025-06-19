const { body, param, query } = require('express-validator');
const { routes, registerRoutes, listRoutes, addRoute, removeRoute, listWebRoutes } = require('./router');

// Sistema de Rotas Web - Extensão do router.js
// Defina suas rotas aqui de forma simples e elas serão automaticamente
// adicionadas ao sistema de rotas unificado

// ===== DEFINA SUAS ROTAS AQUI =====

// Rota principal - Tela de boas vindas
routes['GET /'] = {
  controller: 'Controller',
  method: 'index',
  description: 'Tela de boas vindas'
};

// Rota fornecedor - Página
routes['GET /fornecedor'] = {
  controller: 'Controller',
  method: 'fornecedor',
  description: 'Página de fornecedores'
};

// API Fornecedores - CRUD
routes['GET /api/fornecedores'] = {
  controller: 'FornecedorController',
  method: 'index',
  description: 'Listar todos os fornecedores'
};

routes['GET /api/fornecedores/:id'] = {
  controller: 'FornecedorController',
  method: 'show',
  description: 'Buscar fornecedor por ID'
};

routes['POST /api/fornecedores'] = {
  controller: 'FornecedorController',
  method: 'store',
  description: 'Criar novo fornecedor'
};

routes['PUT /api/fornecedores/:id'] = {
  controller: 'FornecedorController',
  method: 'update',
  description: 'Atualizar fornecedor'
};

routes['DELETE /api/fornecedores/:id'] = {
  controller: 'FornecedorController',
  method: 'destroy',
  description: 'Deletar fornecedor'
};

// Rota produto - Página
routes['GET /produto'] = {
  controller: 'Controller',
  method: 'produto',
  description: 'Página de produtos'
};

// API Produtos - CRUD
routes['GET /api/produtos'] = {
  controller: 'ProdutoController',
  method: 'index',
  description: 'Listar todos os produtos'
};

routes['GET /api/produtos/:id'] = {
  controller: 'ProdutoController',
  method: 'show',
  description: 'Buscar produto por ID'
};

routes['POST /api/produtos'] = {
  controller: 'ProdutoController',
  method: 'store',
  description: 'Criar novo produto'
};

routes['PUT /api/produtos/:id'] = {
  controller: 'ProdutoController',
  method: 'update',
  description: 'Atualizar produto'
};

routes['DELETE /api/produtos/:id'] = {
  controller: 'ProdutoController',
  method: 'destroy',
  description: 'Deletar produto'
};

// API Relacionamento Fornecedor-Produto
routes['GET /api/fornecedores/:fornecedor_id/produtos'] = {
  controller: 'FornecedorProdutoController',
  method: 'produtosPorFornecedor',
  description: 'Listar produtos de um fornecedor'
};

routes['GET /api/produtos/:produto_id/fornecedores'] = {
  controller: 'FornecedorProdutoController',
  method: 'fornecedoresPorProduto',
  description: 'Listar fornecedores de um produto'
};

routes['POST /api/fornecedor-produto/vincular'] = {
  controller: 'FornecedorProdutoController',
  method: 'vincularProduto',
  description: 'Vincular produto a fornecedor'
};

routes['DELETE /api/fornecedor-produto/:fornecedor_id/:produto_id'] = {
  controller: 'FornecedorProdutoController',
  method: 'desvincularProduto',
  description: 'Desvincular produto de fornecedor'
};

routes['GET /api/fornecedores/:fornecedor_id/produtos-disponiveis'] = {
  controller: 'FornecedorProdutoController',
  method: 'produtosDisponiveis',
  description: 'Listar produtos disponíveis para vincular'
};

routes['GET /api/produtos/:produto_id/fornecedores-disponiveis'] = {
  controller: 'FornecedorProdutoController',
  method: 'fornecedoresDisponiveis',
  description: 'Listar fornecedores disponíveis para vincular'
};

// Exemplos de como definir rotas:

// Rota simples
// routes['GET /api/produtos'] = {
//   controller: 'ProdutoController',
//   method: 'index',
//   description: 'Listar todos os produtos'
// };

// Rota com validação
// routes['POST /api/produtos'] = {
//   controller: 'ProdutoController',
//   method: 'store',
//   description: 'Criar um novo produto',
//   validation: [
//     body('nome').notEmpty().withMessage('Nome é obrigatório'),
//     body('preco').isFloat({ min: 0 }).withMessage('Preço deve ser válido')
//   ]
// };

// Rota com parâmetros
// routes['GET /api/produtos/:id'] = {
//   controller: 'ProdutoController',
//   method: 'show',
//   description: 'Mostrar um produto específico',
//   validation: [
//     param('id').isInt({ min: 1 }).withMessage('ID deve ser válido')
//   ]
// };

// Rota com query parameters
// routes['GET /api/produtos/search'] = {
//   controller: 'ProdutoController',
//   method: 'search',
//   description: 'Buscar produtos',
//   validation: [
//     query('q').notEmpty().withMessage('Termo de busca é obrigatório'),
//     query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser válida')
//   ]
// };

// Exporta as funções do router.js (incluindo as funções auxiliares)
module.exports = {
  routes,
  registerRoutes,
  listRoutes,
  addRoute,
  removeRoute,
  listWebRoutes
};

// Log de inicialização
console.log('🌐 Sistema de Rotas Web carregado - Rotas definidas em web.js');