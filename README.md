# 🐾 PetConnect

O PetConnect é uma aplicação de backend desenvolvida para modernizar o processo de adoção de um abrigo de animais. O sistema visa agilizar o cadastro de pets disponíveis e facilitar a conexão com possíveis adotantes, tornando o processo mais eficiente e acessível.

Este projeto foi desenvolvido como parte do curso de Desenvolvimento Full Stack Básico (DFS-2025.3).

## ✨ Funcionalidades

* **Gerenciamento de Pets:** CRUD completo para cadastrar, visualizar, atualizar e remover pets do sistema.
* **Gerenciamento de Adotantes:** CRUD completo para gerenciar as informações dos possíveis adotantes.
* **Sistema de Adoção:** Lógica para registrar uma adoção, conectando um pet a um adotante e atualizando o status do pet para "adotado" automaticamente.
* **Filtros Avançados:** Permite a busca de pets por espécie, status, tamanho, personalidade e faixa de idade.

## 🚀 Tecnologias Utilizadas

* **Backend:** Node.js
* **Framework:** Express.js
* **ORM:** Prisma
* **Banco de Dados:** MySQL
* **Middlewares:** Helmet, CORS, Morgan
* **Variáveis de Ambiente:** Dotenv

## 🔧 Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

**Pré-requisitos:**
* Node.js (versão 18 ou superior)
* NPM ou Yarn
* Um servidor de banco de dados MySQL rodando localmente

**Passo a passo:**

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/sarahaffonco/PetConnect.git](https://github.com/sarahaffonco/PetConnect.git)
    ```

2.  **Acesse a pasta do projeto:**
    ```bash
    cd PetConnect
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Configure as variáveis de ambiente:**
    * Crie um arquivo chamado `.env` na raiz do projeto.
    * Copie e cole o conteúdo abaixo no arquivo, substituindo com as suas credenciais do MySQL.
    ```env
    # String de conexão do banco de dados
    DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/NOME_DO_BANCO"
    
    # Porta do servidor
    PORT=3000
    ```

5.  **Execute as migrações do banco de dados:**
    * Este comando irá criar as tabelas no seu banco de dados com base no schema do Prisma.
    ```bash
    npx prisma migrate dev
    ```

6.  **(Opcional) Popule o banco com dados de teste:**
    * Este comando executa o script `seed.js` para adicionar pets e adotantes de exemplo.
    ```bash
    npx prisma db seed
    ```

7.  **Inicie o servidor:**
    ```bash
    npm run dev
    ```
    * A API estará rodando no endereço `http://localhost:3000`.

## 📚 Documentação da API

A URL base para todas as requisições é `http://localhost:3000/api`.

### Pets (`/pets`)
| Método | Endpoint         | Descrição                            |
|--------|------------------|----------------------------------------|
| `POST` | `/pets`          | Cadastra um novo pet.                 |
| `GET`  | `/pets`          | Lista todos os pets com filtros.      |
| `GET`  | `/pets/:id`      | Busca um pet específico por ID.     |
| `PUT`  | `/pets/:id`      | Atualiza um pet específico por ID.    |
| `DELETE`| `/pets/:id`    | Deleta um pet específico por ID.      |

### Adotantes (`/adopter`)
| Método | Endpoint         | Descrição                                |
|--------|------------------|--------------------------------------------|
| `POST` | `/adopter`       | Cadastra um novo adotante.             |
| `GET`  | `/adopter`       | Lista todos os adotantes.          |
| `GET`  | `/adopter/:id`   | Busca um adotante específico por ID. |
| `PUT`  | `/adopter/:id`   | Atualiza um adotante específico por ID.|
| `DELETE`| `/adopter/:id` | Deleta um adotante específico por ID.  |

### Adoções (`/adoptions`)
| Método | Endpoint         | Descrição                           |
|--------|------------------|---------------------------------------|
| `POST` | `/adoptions`     | Registra uma nova adoção.            |
| `GET`  | `/adoptions`     | Lista todas as adoções.          |
| `GET`  | `/adoptions/:id` | Busca uma adoção específica por ID.|
| `DELETE`| `/adoptions/:id`| Cancela uma adoção.                |