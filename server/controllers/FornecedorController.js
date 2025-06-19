const { validationResult } = require('express-validator');
const db = require('../database/connection');

class Controller {

  // Listar todas
  async index(req, res) {
    try {
        // Buscar fornecedores do banco de dados
        const fornecedores = await new Promise((resolve, reject) => {
          db.db.all('SELECT * FROM fornecedor ORDER BY nome', (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
  
        // Mapear dados para o formato esperado pelo frontend
        const fornecedoresFormatados = fornecedores.map(fornecedor => ({
          id: fornecedor.id,
          nome: fornecedor.nome,
          cnpj: fornecedor.cnpj,
          email: fornecedor.email,
          telefone: fornecedor.telefone,
          endereco: fornecedor.endereco,
          contato_principal: fornecedor.contato_principal,
        }));
  
        res.json({
          success: true,
          message: 'Página de Fornecedores',
          component: 'Fornecedor',
          data: {
            title: 'Gestão de Fornecedores',
            subtitle: 'Gerencie seus fornecedores de forma eficiente',
            fornecedores: fornecedoresFormatados,
            actions: [
              { label: 'Novo Fornecedor', action: 'create' },
              { label: 'Exportar Lista', action: 'export' }
            ]
          }
        });
      } catch (error) {
        console.error('Erro ao buscar fornecedores:', error);
        res.status(500).json({
          success: false,
          message: 'Erro ao buscar fornecedores',
          error: error.message
        });
      }
  }

  // Buscar ID
  async show(req, res) {
    try {
      const { id } = req.params;
      
      const fornecedor = await new Promise((resolve, reject) => {
        db.db.get('SELECT * FROM fornecedor WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });

      if (!fornecedor) {
        return res.status(404).json({
          success: false,
          message: 'Fornecedor não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Fornecedor encontrado',
        data: {
          id: fornecedor.id,
          nome: fornecedor.nome,
          cnpj: fornecedor.cnpj,
          email: fornecedor.email,
          telefone: fornecedor.telefone,
          endereco: fornecedor.endereco,
          contato_principal: fornecedor.contato_principal,
          data_criacao: fornecedor.data_criacao
        }
      });
    } catch (error) {
      console.error('Erro ao buscar fornecedor:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar fornecedor',
        error: error.message
      });
    }
  }

  // Criar novo
  async store(req, res) {
    try {
      const { nome, cnpj, email, telefone, endereco, contato_principal } = req.body;

      // Validações básicas
      if (!nome) {
        return res.status(400).json({
          success: false,
          message: 'Nome é obrigatório'
        });
      }

      // Verificar se CNPJ já existe (se fornecido)
      if (cnpj) {
        const cnpjExistente = await new Promise((resolve, reject) => {
          db.db.get('SELECT id FROM fornecedor WHERE cnpj = ?', [cnpj], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        if (cnpjExistente) {
          return res.status(400).json({
            success: false,
            message: 'CNPJ já cadastrado'
          });
        }
      }

      // Inserir novo fornecedor
      const resultado = await new Promise((resolve, reject) => {
        const query = `
          INSERT INTO fornecedor (nome, cnpj, email, telefone, endereco, contato_principal, data_criacao)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        `;
        
        db.db.run(query, [nome, cnpj, email, telefone, endereco, contato_principal], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, changes: this.changes });
          }
        });
      });

      res.status(201).json({
        success: true,
        message: 'Fornecedor criado com sucesso',
        data: {
          id: resultado.id,
          nome,
          cnpj,
          email,
          telefone,
          endereco,
          contato_principal
        }
      });
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
      
      // Tratar erro específico de email duplicado
      if (error.message && error.message.includes('UNIQUE constraint failed: fornecedor.email')) {
        return res.status(400).json({
          success: false,
          message: 'Este email já está cadastrado. Por favor, use um email diferente.',
          error: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Erro ao criar fornecedor',
        error: error.message
      });
    }
  }

  // Atualizar
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, cnpj, email, telefone, endereco, contato_principal } = req.body;

      // Verificar se fornecedor existe
      const fornecedorExistente = await new Promise((resolve, reject) => {
        db.db.get('SELECT * FROM fornecedor WHERE id = ?', [id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (!fornecedorExistente) {
        return res.status(404).json({
          success: false,
          message: 'Fornecedor não encontrado'
        });
      }

      // Validações básicas
      if (!nome) {
        return res.status(400).json({
          success: false,
          message: 'Nome é obrigatório'
        });
      }

      // Verificar se CNPJ já existe em outro fornecedor (se fornecido)
      if (cnpj && cnpj !== fornecedorExistente.cnpj) {
        const cnpjExistente = await new Promise((resolve, reject) => {
          db.db.get('SELECT id FROM fornecedor WHERE cnpj = ? AND id != ?', [cnpj, id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        if (cnpjExistente) {
          return res.status(400).json({
            success: false,
            message: 'CNPJ já cadastrado para outro fornecedor'
          });
        }
      }

      // Atualizar fornecedor
      const resultado = await new Promise((resolve, reject) => {
        const query = `
          UPDATE fornecedor 
          SET nome = ?, cnpj = ?, email = ?, telefone = ?, endereco = ?, contato_principal = ?
          WHERE id = ?
        `;
        
        db.db.run(query, [nome, cnpj, email, telefone, endereco, contato_principal, id], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        });
      });

      if (resultado.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Fornecedor não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Fornecedor atualizado com sucesso',
        data: {
          id: parseInt(id),
          nome,
          cnpj,
          email,
          telefone,
          endereco,
          contato_principal
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar fornecedor',
        error: error.message
      });
    }
  }

  // Deletar
  async destroy(req, res) {
    try {
      const { id } = req.params;

      // Verificar se fornecedor existe
      const fornecedorExistente = await new Promise((resolve, reject) => {
        db.db.get('SELECT * FROM fornecedor WHERE id = ?', [id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (!fornecedorExistente) {
        return res.status(404).json({
          success: false,
          message: 'Fornecedor não encontrado'
        });
      }

      // Deletar fornecedor
      const resultado = await new Promise((resolve, reject) => {
        db.db.run('DELETE FROM fornecedor WHERE id = ?', [id], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        });
      });

      if (resultado.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Fornecedor não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Fornecedor deletado com sucesso',
        data: {
          id: parseInt(id),
          nome: fornecedorExistente.nome
        }
      });
    } catch (error) {
      console.error('Erro ao deletar fornecedor:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar fornecedor',
        error: error.message
      });
    }
  }
}

module.exports = new Controller();