const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const migrations = require('../database/migrations');

class DatabaseReset {
  constructor() {
    this.dbPath = path.join(__dirname, '../database/app.db');
    this.db = null;
  }

  // Conectar ao banco de dados
  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('❌ Erro ao conectar com SQLite:', err.message);
          reject(err);
        } else {
          console.log('✅ Conectado ao banco SQLite');
          resolve();
        }
      });
    });
  }

  // Obter lista de todas as tabelas
  getTables() {
    return new Promise((resolve, reject) => {
      const query = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'";
      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => row.name));
        }
      });
    });
  }

  // Dropar todas as tabelas
  dropAllTables() {
    return new Promise(async (resolve, reject) => {
      try {
        const tables = await this.getTables();
        
        if (tables.length === 0) {
          console.log('ℹ️ Nenhuma tabela encontrada para remover');
          resolve();
          return;
        }

        console.log(`🗑️ Removendo ${tables.length} tabela(s)...`);
        
        // Desabilitar foreign keys temporariamente
        await this.run('PRAGMA foreign_keys = OFF');
        
        let completed = 0;
        const total = tables.length;

        for (const table of tables) {
          await this.run(`DROP TABLE IF EXISTS ${table}`);
          console.log(`✅ Tabela '${table}' removida`);
          completed++;
        }

        // Reabilitar foreign keys
        await this.run('PRAGMA foreign_keys = ON');
        
        console.log(`🎉 Todas as ${total} tabela(s) foram removidas!`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
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

  // Gerar queries SQL a partir das migrações
  generateQueriesFromMigrations() {
    const queries = [];
    
    Object.keys(migrations).forEach(migrationKey => {
      const migration = migrations[migrationKey];
      const { tableName, columns } = migration;
      
      // Construir colunas
      const columnDefinitions = Object.keys(columns).map(columnName => {
        return `${columnName} ${columns[columnName]}`;
      });
      
      // Construir query completa
      const query = `CREATE TABLE IF NOT EXISTS ${tableName} (\n  ${columnDefinitions.join(',\n  ')}\n)`;
      
      queries.push({
        tableName,
        query
      });
    });
    
    return queries;
  }

  // Criar tabelas baseadas nas migrações
  createTables() {
    return new Promise(async (resolve, reject) => {
      try {
        const queries = this.generateQueriesFromMigrations();
        
        if (queries.length === 0) {
          console.log('⚠️ Nenhuma migração encontrada');
          resolve();
          return;
        }

        console.log(`🔄 Criando ${queries.length} tabela(s)...`);

        for (const queryInfo of queries) {
          await this.run(queryInfo.query);
          console.log(`✅ Tabela '${queryInfo.tableName}' criada`);
        }

        console.log('🎉 Todas as tabelas foram criadas com sucesso!');
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Fechar conexão
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('✅ Conexão com SQLite fechada');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // Executar reset completo
  async reset() {
    try {
      console.log('🚀 Iniciando reset do banco de dados...');
      
      await this.connect();
      await this.dropAllTables();
      await this.createTables();
      await this.close();
      
      console.log('✨ Reset do banco de dados concluído com sucesso!');
    } catch (error) {
      console.error('❌ Erro durante o reset:', error.message);
      await this.close();
      process.exit(1);
    }
  }
}

// Executar o script se chamado diretamente
if (require.main === module) {
  const resetDb = new DatabaseReset();
  resetDb.reset();
}

module.exports = DatabaseReset;