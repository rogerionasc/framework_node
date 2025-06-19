const express = require('express');
const { body } = require('express-validator');

// Sistema de Rotas Unificado
// Defina suas rotas aqui apontando para Controller@método

// Objeto para armazenar todas as rotas
const routes = {};

// Função para carregar controllers dinamicamente
function loadController(controllerName) {
  try {
    return require(`../controllers/${controllerName}`);
  } catch (error) {
    console.error(`❌ Erro ao carregar controller '${controllerName}':`, error.message);
    return null;
  }
}

// Função para registrar rotas automaticamente
function registerRoutes(app) {
  const router = express.Router();
  let routesRegistered = 0;
  
  console.log('🔄 Registrando rotas...');
  
  Object.keys(routes).forEach(routeKey => {
    const [method, path] = routeKey.split(' ');
    const routeConfig = routes[routeKey];
    const { controller: controllerName, method: controllerMethod, validation = [], description } = routeConfig;
    
    // Carregar controller
    const controller = loadController(controllerName);
    if (!controller) {
      console.error(`❌ Controller '${controllerName}' não encontrado para rota '${routeKey}'`);
      return;
    }
    
    // Verificar se o método existe no controller
    if (typeof controller[controllerMethod] !== 'function') {
      console.error(`❌ Método '${controllerMethod}' não encontrado no controller '${controllerName}'`);
      return;
    }
    
    // Registrar rota
    const httpMethod = method.toLowerCase();
    if (router[httpMethod]) {
      // Aplicar validação se existir
      if (validation.length > 0) {
        router[httpMethod](path, validation, controller[controllerMethod]);
      } else {
        router[httpMethod](path, controller[controllerMethod]);
      }
      
      console.log(`✅ ${method.padEnd(6)} ${path.padEnd(25)} -> ${controllerName}@${controllerMethod}`);
      routesRegistered++;
    } else {
      console.error(`❌ Método HTTP '${method}' não suportado`);
    }
  });
  
  console.log(`🎉 ${routesRegistered} rota(s) registrada(s) com sucesso!`);
  
  return router;
}

// Função para listar todas as rotas (útil para debug)
function listRoutes() {
  console.log('\n📋 Rotas Disponíveis:');
  console.log('=' .repeat(80));
  
  Object.keys(routes).forEach(routeKey => {
    const [method, path] = routeKey.split(' ');
    const { controller, method: controllerMethod, description } = routes[routeKey];
    
    console.log(`${method.padEnd(6)} ${path.padEnd(25)} -> ${controller}@${controllerMethod}`);
    if (description) {
      console.log(`       ${description}`);
    }
    console.log('');
  });
  
  console.log('=' .repeat(80));
}

// ===== FUNÇÕES AUXILIARES =====

/**
 * Adiciona uma nova rota ao sistema
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {string} path - Caminho da rota
 * @param {string} controller - Nome do controller
 * @param {string} controllerMethod - Nome do método no controller
 * @param {Array} validation - Array de validações (opcional)
 * @param {string} description - Descrição da rota (opcional)
 */
function addRoute(method, path, controller, controllerMethod, validation = [], description = '') {
  const routeKey = `${method.toUpperCase()} ${path}`;
  routes[routeKey] = {
    controller,
    method: controllerMethod,
    validation,
    description
  };
  console.log(`✅ Rota adicionada: ${routeKey} -> ${controller}@${controllerMethod}`);
}

/**
 * Remove uma rota do sistema
 * @param {string} method - Método HTTP
 * @param {string} path - Caminho da rota
 */
function removeRoute(method, path) {
  const routeKey = `${method.toUpperCase()} ${path}`;
  if (routes[routeKey]) {
    delete routes[routeKey];
    console.log(`🗑️ Rota removida: ${routeKey}`);
  } else {
    console.log(`⚠️ Rota não encontrada: ${routeKey}`);
  }
}

/**
 * Lista todas as rotas definidas no sistema
 */
function listWebRoutes() {
  console.log('\n🌐 Rotas Web Definidas:');
  console.log('=' .repeat(80));
  
  const webRoutes = Object.keys(routes).filter(key => {
    // Filtra apenas as rotas que foram definidas
    return key.includes('/api/');
  });
  
  webRoutes.forEach(routeKey => {
    const [method, path] = routeKey.split(' ');
    const { controller, method: controllerMethod, description } = routes[routeKey];
    
    console.log(`${method.padEnd(6)} ${path.padEnd(25)} -> ${controller}@${controllerMethod}`);
    if (description) {
      console.log(`       ${description}`);
    }
    console.log('');
  });
  
  console.log('=' .repeat(80));
  console.log(`📊 Total: ${webRoutes.length} rotas web definidas`);
}

module.exports = {
  routes,
  registerRoutes,
  listRoutes,
  addRoute,
  removeRoute,
  listWebRoutes
};