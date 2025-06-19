# Scripts do Banco de Dados

## Reset do Banco de Dados

Este diretório contém scripts para gerenciamento do banco de dados SQLite.

### reset-database.js

Script para limpar e recriar todas as tabelas do banco de dados baseado nas migrações definidas em `../database/migrations.js`.

#### Como usar:

**Opção 1: Via npm script (Recomendado)**
```bash
# Na raiz do projeto
npm run reset-db
```

**Opção 2: Diretamente com Node.js**
```bash
# Na raiz do projeto
node server/scripts/reset-database.js
```

#### O que o script faz:

1. **Conecta** ao banco de dados SQLite
2. **Lista** todas as tabelas existentes
3. **Remove** todas as tabelas (exceto tabelas do sistema SQLite)
4. **Recria** todas as tabelas baseadas nas migrações
5. **Fecha** a conexão com o banco

#### Quando usar:

- ✅ Durante desenvolvimento quando você quer limpar todos os dados
- ✅ Após modificar a estrutura das tabelas nas migrações
- ✅ Para resolver problemas de inconsistência no banco
- ✅ Para resetar o ambiente de desenvolvimento

#### ⚠️ Atenção:

- **TODOS OS DADOS SERÃO PERDIDOS** após executar este script
- Use apenas em ambiente de desenvolvimento
- Faça backup dos dados importantes antes de executar
- O script não pode ser desfeito

#### Exemplo de saída:

```
🚀 Iniciando reset do banco de dados...
✅ Conectado ao banco SQLite
🗑️ Removendo 3 tabela(s)...
✅ Tabela 'fornecedor_produto' removida
✅ Tabela 'produto' removida
✅ Tabela 'fornecedor' removida
🎉 Todas as 3 tabela(s) foram removidas!
🔄 Criando 3 tabela(s)...
✅ Tabela 'fornecedor' criada
✅ Tabela 'produto' criada
✅ Tabela 'fornecedor_produto' criada
🎉 Todas as tabelas foram criadas com sucesso!
✅ Conexão com SQLite fechada
✨ Reset do banco de dados concluído com sucesso!
```

#### Estrutura das tabelas criadas:

O script recria as seguintes tabelas baseadas em `migrations.js`:

- **fornecedor**: Dados dos fornecedores
- **produto**: Catálogo de produtos
- **fornecedor_produto**: Relacionamento entre fornecedores e produtos

#### Troubleshooting:

Se encontrar erros:

1. Verifique se o arquivo `app.db` não está sendo usado por outro processo
2. Certifique-se de que as migrações em `migrations.js` estão corretas
3. Verifique se o SQLite3 está instalado corretamente
4. Pare o servidor antes de executar o reset se estiver rodando