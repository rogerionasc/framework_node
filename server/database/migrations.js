// Sistema de Migrações - Defina suas tabelas aqui
// Cada migração deve ter um nome único e a estrutura da tabela

const migrations = {

  // ========================================
  // ADICIONE SUAS NOVAS TABELAS AQUI
  // ========================================
  
  // Exemplo de nova tabela:
  // exemplo_tabela: {
  //   tableName: 'exemplo_tabela',
  //   columns: {
  //     id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  //     nome: 'TEXT NOT NULL',
  //     email: 'TEXT UNIQUE',
  //     ativo: 'BOOLEAN DEFAULT 1',
  //     data_criacao: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
  //   }
  // },
  
  fornecedor : {
    tableName: 'fornecedor',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      nome: 'TEXT NOT NULL',
      cnpj: 'TEXT UNIQUE',
      telefone: 'TEXT',
      endereco: 'TEXT',
      contato_principal: 'TEXT',
      email: 'TEXT UNIQUE',
      data_criacao: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
    }
  },

  produto : {
    tableName: 'produto',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      nome: 'TEXT NOT NULL',
      descricao: 'TEXT',
      codigo_barras: 'TEXT UNIQUE',
      categoria: 'TEXT',
      data_validade: 'DATE'
    }
  },

  fornecedor_produto: {
    tableName: 'fornecedor_produto',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      fornecedor_id: 'INTEGER NOT NULL',
      produto_id: 'INTEGER NOT NULL',
      preco_fornecedor: 'DECIMAL(10,2)',
      data_vinculo: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
      ativo: 'BOOLEAN DEFAULT 1',
      'FOREIGN KEY (fornecedor_id)': 'REFERENCES fornecedor(id) ON DELETE CASCADE',
      'FOREIGN KEY (produto_id)': 'REFERENCES produto(id) ON DELETE CASCADE',
      'UNIQUE (fornecedor_id, produto_id)': ''
    }
  }
};

module.exports = migrations;