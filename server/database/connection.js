const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const migrations = require('./migrations');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, 'app.db');
  }

  // Inicializar conexão com o banco
  init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('❌ Erro ao conectar com SQLite:', err.message);
          reject(err);
        } else {
          console.log('✅ Conectado ao banco SQLite');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  // Criar tabelas baseadas nas migrações
  createTables() {
    return new Promise((resolve, reject) => {
      const queries = this.generateQueriesFromMigrations();
      
      if (queries.length === 0) {
        console.log('⚠️ Nenhuma migração encontrada');
        resolve();
        return;
      }

      let completed = 0;
      const total = queries.length;

      console.log(`🔄 Executando ${total} migração(ões)...`);

      queries.forEach((queryInfo) => {
        this.db.run(queryInfo.query, (err) => {
          if (err) {
            console.error(`❌ Erro ao criar tabela '${queryInfo.tableName}':`, err.message);
            reject(err);
          } else {
            console.log(`✅ Tabela '${queryInfo.tableName}' criada/verificada`);
            completed++;
            if (completed === total) {
              console.log('🎉 Todas as migrações executadas com sucesso!');
              resolve();
            }
          }
        });
      });
    });
  }

  // Gerar queries SQL a partir das migrações
  generateQueriesFromMigrations() {
    const queries = [];
    
    Object.keys(migrations).forEach(migrationKey => {
      const migration = migrations[migrationKey];
      const { tableName, columns, foreignKeys = [] } = migration;
      
      // Construir colunas
      const columnDefinitions = Object.keys(columns).map(columnName => {
        return `${columnName} ${columns[columnName]}`;
      });
      
      // Adicionar foreign keys se existirem
      const allDefinitions = [...columnDefinitions, ...foreignKeys];
      
      // Construir query completa
      const query = `CREATE TABLE IF NOT EXISTS ${tableName} (\n  ${allDefinitions.join(',\n  ')}\n)`;
      
      queries.push({
        tableName,
        query
      });
    });
    
    return queries;
  }

  // Executar query
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Buscar um registro
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Buscar múltiplos registros
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Fechar conexão
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ Conexão com SQLite fechada');
          resolve();
        }
      });
    });
  }
}

module.exports = new Database();