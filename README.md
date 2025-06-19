# Sistema de Gestão de Fornecedores e Produtos

Um sistema completo em Node.js + React + SQLite para gerenciamento de fornecedores e produtos com vinculação e precificação.

## Características

- ✅ **Gestão de Fornecedores** - CRUD completo de fornecedores
- ✅ **Gestão de Produtos** - CRUD completo de produtos
- ✅ **Vinculação Fornecedor-Produto** - Sistema de relacionamento com preços personalizados
- ✅ **Interface React** - Frontend moderno e responsivo
- ✅ **Banco SQLite** - Banco de dados leve e sem configuração
- ✅ **API RESTful** - Endpoints organizados e documentados

## Estrutura do Projeto

```
framework_node/
├── server/
│   ├── controllers/          # Controllers da aplicação
│   │   ├── FornecedorController.js
│   │   ├── ProdutoController.js
│   │   └── FornecedorProdutoController.js
│   ├── database/            # Configuração do banco
│   │   ├── connection.js
│   │   ├── migrations.js
│   │   └── app.db
│   ├── routes/              # Definição das rotas
│   │   ├── router.js
│   │   └── web.js
│   └── index.js            # Servidor principal
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   └── services/      # Serviços de API
│   └── package.json
└── package.json
```

## Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/rogerionasc/framework_node.git
cd framework_node
```

2. **Instalar dependências:**

   **Opção A: Instalar todas as dependências automaticamente (Recomendado)**
   ```bash
   npm run install-all
   ```
   
   **Opção B: Instalar manualmente**
   ```bash
   # Instalar dependências do servidor
   cd server
   npm install
   cd ..
   
   # Instalar dependências do cliente
   cd client
   npm install
   cd ..
   
   # Instalar dependências da raiz (scripts de automação)
   npm install
   ```

### Executando o Projeto

#### Opção 1: Desenvolvimento Completo (Recomendado)
```bash
npm run dev
```
Este comando inicia simultaneamente:
- Servidor backend na porta 9000+ (porta automática)
- Cliente React na porta 3000

#### Opção 2: Apenas o Servidor
```bash
npm run server
```

#### Opção 3: Apenas o Cliente
```bash
npm run client
#### Opção 4: Produção
```bash
npm start
```

### Scripts Úteis

#### Reset do Banco de Dados
Para limpar e recriar todas as tabelas do banco:
```bash
npm run reset-db
```

⚠️ **Atenção**: Este comando remove TODOS os dados do banco. Use apenas em desenvolvimento.

### Acessando a Aplicação

- **Frontend (React):** http://localhost:3000
- **Backend (API):** http://localhost:9000+ (porta automática)

### Funcionalidades Disponíveis

1. **Gestão de Fornecedores:**
   - Cadastro, edição e exclusão
   - Campos: Nome, CNPJ, Email, Telefone
   - Vinculação direta de produtos durante o cadastro/edição

2. **Gestão de Produtos:**
   - Cadastro, edição e exclusão
   - Campos: Nome, Descrição, Preço

3. **Vinculação Fornecedor-Produto:**
   - Associação de produtos a fornecedores
   - Preços personalizados por fornecedor
   - Gestão integrada no modal do fornecedor

## API Endpoints

### Fornecedores

| Método | Endpoint | Descrição |
|--------|----------|----------|
| GET | `/api/fornecedores` | Listar todos os fornecedores |
| GET | `/api/fornecedores/:id` | Buscar fornecedor por ID |
| POST | `/api/fornecedores` | Criar novo fornecedor |
| PUT | `/api/fornecedores/:id` | Atualizar fornecedor |
| DELETE | `/api/fornecedores/:id` | Deletar fornecedor |

### Produtos

| Método | Endpoint | Descrição |
|--------|----------|----------|
| GET | `/api/produtos` | Listar todos os produtos |
| GET | `/api/produtos/:id` | Buscar produto por ID |
| POST | `/api/produtos` | Criar novo produto |
| PUT | `/api/produtos/:id` | Atualizar produto |
| DELETE | `/api/produtos/:id` | Deletar produto |

### Vinculação Fornecedor-Produto

| Método | Endpoint | Descrição |
|--------|----------|----------|
| GET | `/api/fornecedor-produtos/:fornecedorId` | Listar produtos de um fornecedor |
| POST | `/api/fornecedor-produtos` | Vincular produto a fornecedor |
| PUT | `/api/fornecedor-produtos/:fornecedorId/:produtoId` | Atualizar preço do produto |
| DELETE | `/api/fornecedor-produtos/:fornecedorId/:produtoId` | Desvincular produto |

## Exemplos de Uso

### Criar um Fornecedor

```bash
curl -X POST http://localhost:9000/api/fornecedores \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Fornecedor ABC Ltda",
    "cnpj": "12.345.678/0001-90",
    "email": "contato@fornecedorabc.com",
    "telefone": "(11) 99999-9999"
  }'
```

### Criar um Produto

```bash
curl -X POST http://localhost:9000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Notebook Dell",
    "descricao": "Notebook Dell Inspiron 15 3000",
    "preco": 2500.00
  }'
```

### Vincular Produto a Fornecedor

```bash
curl -X POST http://localhost:9000/api/fornecedor-produtos \
  -H "Content-Type: application/json" \
  -d '{
    "fornecedor_id": 1,
    "produto_id": 1,
    "preco_fornecedor": 2300.00
  }'
```

### Listar Fornecedores

```bash
curl http://localhost:9000/api/fornecedores
```

### Listar Produtos de um Fornecedor

```bash
curl http://localhost:9000/api/fornecedor-produtos/1
```

## Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite3** - Banco de dados
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Segurança HTTP
- **Morgan** - Logger HTTP
- **Dotenv** - Gerenciamento de variáveis de ambiente
- **Nodemon** - Auto-restart em desenvolvimento
- **Concurrently** - Execução simultânea de comandos

### Frontend
- **React** - Biblioteca para interfaces de usuário
- **Styled-components** - CSS-in-JS para estilização
- **Axios** - Cliente HTTP para requisições
- **React Router** - Roteamento para aplicações React

## Estrutura do Banco de Dados

### Tabela: fornecedores
- `id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `nome` - TEXT NOT NULL
- `cnpj` - TEXT UNIQUE NOT NULL
- `email` - TEXT NOT NULL
- `telefone` - TEXT NOT NULL
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

### Tabela: produtos
- `id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `nome` - TEXT NOT NULL
- `descricao` - TEXT
- `preco` - REAL NOT NULL
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

### Tabela: fornecedor_produtos (relacionamento)
- `id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `fornecedor_id` - INTEGER (FK para fornecedores)
- `produto_id` - INTEGER (FK para produtos)
- `preco_fornecedor` - REAL
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` - DATETIME DEFAULT CURRENT_TIMESTAMP
- UNIQUE(fornecedor_id, produto_id)

## Configuração

O servidor usa porta dinâmica (padrão 9000+) e encontra automaticamente uma porta disponível.

Para configurar uma porta específica, edite o arquivo `.env`:

```
PORT=3001
NODE_ENV=development
```

## Troubleshooting

### Problemas Comuns

1. **Erro de porta em uso:**
   - O sistema encontra automaticamente uma porta disponível
   - Verifique se não há outros processos usando as portas 3000 ou 9000+

2. **Erro ao instalar dependências:**
   ```bash
   # Limpar cache do npm
   npm cache clean --force
   
   # Reinstalar dependências
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Banco de dados não inicializa:**
   - O banco SQLite é criado automaticamente na primeira execução
   - Verifique as permissões de escrita na pasta `server/database/`

4. **Frontend não conecta com backend:**
   - Verifique se ambos os serviços estão rodando
   - Confirme as URLs de API no frontend

### Logs e Debug

- Logs do servidor aparecem no terminal onde `npm run server` foi executado
- Logs do cliente aparecem no terminal onde `npm run client` foi executado
- Use as ferramentas de desenvolvedor do navegador para debug do frontend

## Licença

MIT License - veja o arquivo LICENSE para detalhes.