# 💸 Sistema PIX API

API REST com operações básicas de autenticação, cadastro de usuários, criação de chaves pix e transações.

---

## 📚 Sumário

- [📚 Sumário](#-sumário)
- [📌 Descrição](#-descrição)
- [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🔐 Autenticação com JWT](#-autenticação-com-jwt)
- [📦 Endpoints Principais](#-endpoints-principais)
- [💻 Tutorial para rodar o projeto](#-tutorial-rodar-projeto) 
---

## 📌 Descrição

Este projeto foi desenvolvido como trabalho prático na disciplina de Tópicos Especiais em Desenvolvimento de Software II no curso de Análise e Desenvolvimento de Sistemas. O projeto contém tais funcionalidades:

- Registro, listagem e autenticação de usuários
- Cadastro e listagem de chaves pix
- Criação e listagem de transações
- Segurança com JWT

---

## 🚀 Tecnologias Utilizadas

- Typescript
- Node v18.19.1
- Jsonwebtoken v9.0.2
- Bcrypt v6.0.0
- Cors v2.8.5
- Cpf-cnpj-validator v1.0.3
- Dotenv v17.2.2
- Express v5.1.0
- Express-validator v7.2.1
- Passport-jwt v4.0.1
- Supertest v7.1.4
- Typeorm v0.3.27

---

## 📁 Estrutura do Projeto

```
src/
│
├── controllers          # Controladores que recebem as requisições HTTP
├── database             # Configuração da conexão com o banco de dados
├── dtos                 # Objetos de transferência de dados
├── entities             # Entidades: Usuario, Chave, Transação.
│   └── enums            # Enumerações: TipoChave
├── routes               # Rotas da aplicação
├── services             # Lógica de negócio
├── utils                # Classes/Métodos utils como JwtUtils
├── validators           # Regras/Middleware de validação
└── app.ts               # Arquivo principal
```

---

## 🔐 Autenticação com JWT

A API é protegida com autenticação JWT. Para acessar os endpoints protegidos:

- Registre um novo usuário via POST v1/usuarios.
- Realize login via POST v1/auth e receba o token.
- Use o token no cabeçalho das requisições: Authorization: Bearer <token>

---

## 📦 Endpoints da Aplicação
      
| Método |           Endpoint                    |          Descrição               |       Protegido          |
| ------ | ------------------------------------- | -------------------------------- | ------------------------ | 
| POST   | /v1/usuarios                          | Criação de novo usuário          | ❌ |
| DELETE | /v1/usuarios/{usuarioID}              | Deletar um usuário               | ✅ |
| PATCH  | /v1/usuarios/{usuarioID}              | Atualizar um usuário             | ✅ |
| GET    | /v1/usuarios                          | Buscar todos usuários            | ✅ |
| GET    | /v1/usuarios/{usuarioID}              | Buscar determinado usuário       | ✅ |
| GET    | /v1/usuarios/{usuarioID}/chaves       | Buscar chaves de um usuário      | ❌ |
| GET    | /v1/usuarios/{usuarioID}/transacoes   | Buscar transações de um usuário  | ✅ |
| POST   | /v1/auth                              | Realizar Login                   | ❌ |
| POST   | /v1/logout                            | Realizar Logout                  | ✅ |
| POST   | /v1/chaves/{usuarioID}                | Criar chave PIX                  | ✅ |
| GET    | /v1/chaves                            | Buscar todas as chaves           | ✅ |
| GET    | /v1/chaves/{chaveID}                  | Buscar chave pelo ID             | ✅ |
| DELETE | /v1/chaves/{chaveID}                  | Deletar chave pelo ID            | ✅ |
| POST   | /v1/transacoes                        | Criar nova transação             | ✅ |
| GET    | /v1/transacoes/{transacaoID}          | Buscar transação pelo ID         | ✅ |
| GET    | /v1/transacoes                        | Buscar todas transações          | ✅ |

---

## 💻 Tutorial para rodar o projeto
 
- Passo 1: Instalar o [https://nodejs.org/en/](NodeJS) ou sudo apt install -y nodejs no Linux.
- Passo 2: Clonar o projeto em sua máquina
- Passo 3: Abrir o terminal e executar npm install
- Passo 4: Criar um arquivo .env e um arquivo .env.test na raiz do projeto com as seguintes variáveis de ambiente: 
    - DB_NAME=
    - DB_USER=
    - DB_PASSWORD=
    - DB_HOST=
    - DB_PORT=
      
    - JWT_SECRET=
    - JWT_EXPIRES=
- OBS: Atribuir valores de acordo com seu banco de dados de desenvolvimento e de testes e sua configuração JWT
- Passo 5: npm run dev -> para executar o projeto
- Passo 6: npm run test -> para executar os testes
    
