const db = require('../database/connection');

class FornecedorProdutoController {
  // Listar produtos de um fornecedor
  async produtosPorFornecedor(req, res) {
    try {
      const { fornecedor_id } = req.params;
      
      const query = `
        SELECT 
          p.id,
          p.nome,
          p.descricao,
          p.codigo_barras,
          p.categoria,
          p.data_validade,

          fp.preco_fornecedor,
          fp.data_vinculo,
          fp.ativo as vinculo_ativo
        FROM produto p
        INNER JOIN fornecedor_produto fp ON p.id = fp.produto_id
        WHERE fp.fornecedor_id = ? AND fp.ativo = 1
        ORDER BY p.nome
      `;
      
      const produtos = await db.all(query, [fornecedor_id]);
      
      res.json({
        success: true,
        data: {
          produtos: produtos || [],
          total: produtos ? produtos.length : 0
        }
      });
    } catch (error) {
      console.error('Erro ao buscar produtos do fornecedor:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Listar fornecedores de um produto
  async fornecedoresPorProduto(req, res) {
    try {
      const { produto_id } = req.params;
      
      const query = `
        SELECT 
          f.id,
          f.nome,
          f.cnpj,
          f.telefone,
          f.email,
          f.endereco,
          f.contato_principal,
          fp.preco_fornecedor,
          fp.data_vinculo,
          fp.ativo as vinculo_ativo
        FROM fornecedor f
        INNER JOIN fornecedor_produto fp ON f.id = fp.fornecedor_id
        WHERE fp.produto_id = ? AND fp.ativo = 1
        ORDER BY f.nome
      `;
      
      const fornecedores = await db.all(query, [produto_id]);
      
      res.json({
        success: true,
        data: {
          fornecedores: fornecedores || [],
          total: fornecedores ? fornecedores.length : 0
        }
      });
    } catch (error) {
      console.error('Erro ao buscar fornecedores do produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Vincular produto a fornecedor
  async vincularProduto(req, res) {
    try {
      const { fornecedor_id, produto_id, preco_fornecedor } = req.body;
      
      // Validações
      if (!fornecedor_id || !produto_id) {
        return res.status(400).json({
          success: false,
          message: 'Fornecedor e produto são obrigatórios'
        });
      }

      // Verificar se o vínculo já existe
      const existeVinculo = await db.get(
        'SELECT id FROM fornecedor_produto WHERE fornecedor_id = ? AND produto_id = ?',
        [fornecedor_id, produto_id]
      );

      if (existeVinculo) {
        // Atualizar vínculo existente
        await db.run(
          `UPDATE fornecedor_produto 
           SET preco_fornecedor = ?, ativo = 1, data_vinculo = CURRENT_TIMESTAMP 
           WHERE fornecedor_id = ? AND produto_id = ?`,
          [preco_fornecedor || null, fornecedor_id, produto_id]
        );
      } else {
        // Criar novo vínculo
        await db.run(
          `INSERT INTO fornecedor_produto (fornecedor_id, produto_id, preco_fornecedor) 
           VALUES (?, ?, ?)`,
          [fornecedor_id, produto_id, preco_fornecedor || null]
        );
      }
      
      res.json({
        success: true,
        message: 'Produto vinculado ao fornecedor com sucesso'
      });
    } catch (error) {
      console.error('Erro ao vincular produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Desvincular produto de fornecedor
  async desvincularProduto(req, res) {
    try {
      const { fornecedor_id, produto_id } = req.params;
      
      await db.run(
        'UPDATE fornecedor_produto SET ativo = 0 WHERE fornecedor_id = ? AND produto_id = ?',
        [fornecedor_id, produto_id]
      );
      
      res.json({
        success: true,
        message: 'Produto desvinculado do fornecedor com sucesso'
      });
    } catch (error) {
      console.error('Erro ao desvincular produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Listar produtos disponíveis para vincular a um fornecedor
  async produtosDisponiveis(req, res) {
    try {
      const { fornecedor_id } = req.params;
      
      const query = `
        SELECT 
          p.id,
          p.nome,
          p.descricao,
          p.codigo_barras,
          p.categoria,
          p.data_validade
        FROM produto p
        WHERE p.id NOT IN (
          SELECT fp.produto_id 
          FROM fornecedor_produto fp 
          WHERE fp.fornecedor_id = ? AND fp.ativo = 1
        )
        ORDER BY p.nome
      `;
      
      const produtos = await db.all(query, [fornecedor_id]);
      
      res.json({
        success: true,
        data: {
          produtos: produtos || [],
          total: produtos ? produtos.length : 0
        }
      });
    } catch (error) {
      console.error('Erro ao buscar produtos disponíveis:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Listar fornecedores disponíveis para vincular a um produto
  async fornecedoresDisponiveis(req, res) {
    try {
      const { produto_id } = req.params;
      
      const query = `
        SELECT 
          f.id,
          f.nome,
          f.cnpj,
          f.telefone,
          f.email
        FROM fornecedor f
        WHERE f.id NOT IN (
          SELECT fp.fornecedor_id 
          FROM fornecedor_produto fp 
          WHERE fp.produto_id = ? AND fp.ativo = 1
        )
        ORDER BY f.nome
      `;
      
      const fornecedores = await db.all(query, [produto_id]);
      
      res.json({
        success: true,
        data: {
          fornecedores: fornecedores || [],
          total: fornecedores ? fornecedores.length : 0
        }
      });
    } catch (error) {
      console.error('Erro ao buscar fornecedores disponíveis:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new FornecedorProdutoController();