const db = require('../database/connection');

class Controller {

  // Listar todas
  async index(req, res) {
    try {
        // Buscar produtos do banco de dados
        const produtos = await new Promise((resolve, reject) => {
          db.db.all('SELECT * FROM produto ORDER BY nome', (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
  
        // Mapear dados para o formato esperado pelo frontend
        const produtosFormatados = produtos.map(produto => ({
          id: produto.id,
          nome: produto.nome,
          descricao: produto.descricao,
          codigo_barras: produto.codigo_barras,
          categoria: produto.categoria,
          data_validade: produto.data_validade,

        }));
  
        res.json({
          success: true,
          message: 'Página de Produtos',
          component: 'Produto',
          data: {
            title: 'Gestão de Produtos',
            subtitle: 'Gerencie seus produtos de forma eficiente',
            produtos: produtosFormatados,
            actions: [
              { label: 'Novo Produto', action: 'create' },
              { label: 'Exportar Lista', action: 'export' }
            ]
          }
        });
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({
          success: false,
          message: 'Erro ao buscar produtos',
          error: error.message
        });
      }
  }

  // Buscar ID
  async show(req, res) {
    try {
      const { id } = req.params;
      
      const produto = await new Promise((resolve, reject) => {
        db.db.get('SELECT * FROM produto WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });

      if (!produto) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Produto encontrado',
        data: {
          id: produto.id,
          nome: produto.nome,
          descricao: produto.descricao,
          codigo_barras: produto.codigo_barras,
          categoria: produto.categoria,
          data_validade: produto.data_validade,

          data_criacao: produto.data_criacao
        }
      });
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produto',
        error: error.message
      });
    }
  }

  // Criar novo
  async store(req, res) {
    try {
      const { nome, descricao, codigo_barras, categoria, data_validade } = req.body;

      // Validação básica
      if (!nome) {
        return res.status(400).json({
          success: false,
          message: 'Nome é obrigatório'
        });
      }

      // Verificar se código de barras já existe
      if (codigo_barras) {
        const produtoExistente = await new Promise((resolve, reject) => {
          db.db.get('SELECT id FROM produto WHERE codigo_barras = ?', [codigo_barras], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });

        if (produtoExistente) {
          return res.status(400).json({
            success: false,
            message: 'Código de barras já cadastrado'
          });
        }
      }

      // Inserir produto
      const result = await new Promise((resolve, reject) => {
        db.db.run(
          'INSERT INTO produto (nome, descricao, codigo_barras, categoria, data_validade) VALUES (?, ?, ?, ?, ?)',
          [nome, descricao, codigo_barras, categoria, data_validade],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: this.lastID });
            }
          }
        );
      });

      res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso',
        data: {
          id: result.id,
          nome,
          descricao,
          codigo_barras,
          categoria,
          data_validade,

        }
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar produto',
        error: error.message
      });
    }
  }

  // Atualizar
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, codigo_barras, categoria, data_validade } = req.body;

      // Validação básica
      if (!nome) {
        return res.status(400).json({
          success: false,
          message: 'Nome é obrigatório'
        });
      }

      // Verificar se produto existe
      const produtoExistente = await new Promise((resolve, reject) => {
        db.db.get('SELECT id FROM produto WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });

      if (!produtoExistente) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      // Verificar se código de barras já existe em outro produto
      if (codigo_barras) {
        const produtoComCodigo = await new Promise((resolve, reject) => {
          db.db.get('SELECT id FROM produto WHERE codigo_barras = ? AND id != ?', [codigo_barras, id], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });

        if (produtoComCodigo) {
          return res.status(400).json({
            success: false,
            message: 'Código de barras já cadastrado em outro produto'
          });
        }
      }

      // Atualizar produto
      await new Promise((resolve, reject) => {
        db.db.run(
          'UPDATE produto SET nome = ?, descricao = ?, codigo_barras = ?, categoria = ?, data_validade = ? WHERE id = ?',
          [nome, descricao, codigo_barras, categoria, data_validade, id],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });

      res.json({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: {
          id: parseInt(id),
          nome,
          descricao,
          codigo_barras,
          categoria,
          data_validade,
          imagem_produto
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar produto',
        error: error.message
      });
    }
  }

  // Deletar
  async destroy(req, res) {
    try {
      const { id } = req.params;

      // Verificar se produto existe
      const produto = await new Promise((resolve, reject) => {
        db.db.get('SELECT * FROM produto WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });

      if (!produto) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      // Deletar produto
      await new Promise((resolve, reject) => {
        db.db.run('DELETE FROM produto WHERE id = ?', [id], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      res.json({
        success: true,
        message: 'Produto deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar produto',
        error: error.message
      });
    }
  }
}

module.exports = new Controller();