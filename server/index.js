const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const db = require('./database/connection');
const { registerRoutes, listRoutes, listWebRoutes } = require('./routes/web');

const app = express();
const PORT = parseInt(process.env.PORT) || 9000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Registrar rotas automaticamente
const routes = registerRoutes(app);
app.use('/', routes);

// Listar rotas disponíveis (apenas em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  listRoutes();
  listWebRoutes();
}

// Servir arquivos estáticos do React apenas em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Rota catch-all para servir o React
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
} else {
  // Em desenvolvimento, apenas uma rota de teste
  app.get('/', (req, res) => {
    res.json({ 
      message: 'API do Framework Node.js + React', 
      status: 'Rodando em modo desenvolvimento',
      frontend: 'http://localhost:3000',
      api: `http://localhost:${PORT}/api`
    });
  });
}

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Algo deu errado!', 
    error: process.env.NODE_ENV === 'production' ? {} : err 
  });
});

// Função para tentar iniciar o servidor em uma porta disponível
function startServer(port) {
  return new Promise((resolve, reject) => {
    // Limitar tentativas para evitar portas muito altas
    if (port > 65000) {
      reject(new Error('Não foi possível encontrar uma porta disponível'));
      return;
    }
    
    const server = app.listen(port, () => {
      console.log(`🚀 Servidor rodando na porta ${port}`);
      console.log(`📱 Frontend: http://localhost:3000`);
      console.log(`🔗 API: http://localhost:${port}/api`);
      console.log(`⏳ Carregando ...`);
      resolve(server);
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Porta ${port} em uso, tentando porta ${port + 1}...`);
        startServer(port + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

// Inicializar banco de dados e servidor
console.log('🔄 Inicializando banco de dados e executando migrações...');
db.init().then(() => {
  console.log('🎯 Todas as migrações executadas com sucesso!');
  return startServer(PORT);
}).catch(err => {
  console.error('❌ Erro ao inicializar banco de dados ou executar migrações:', err);
  process.exit(1);
});

module.exports = app;