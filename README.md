# API de Gerenciamento de Pedidos

API simples desenvolvida em Node.js utilizando Express e MySQL para gerenciamento de pedidos. O projeto foi criado como desafio de integração de sistemas e implementa operações de criação, consulta, atualização e remoção de pedidos (CRUD).

Tecnologias utilizadas:
Node.js  
Express  
MySQL  
mysql2  
JavaScript

Estrutura do Pedido

A API recebe um JSON no seguinte formato:

{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}

Antes de salvar no banco de dados, a API realiza o mapping dos campos transformando para o formato abaixo:

{
  "orderId": "v10089015vdb",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}

Endpoints da API

POST /order  
Cria um novo pedido no banco de dados.

GET /order/list  
Retorna todos os pedidos cadastrados.

GET /order/:orderId  
Retorna um pedido específico pelo número do pedido.

PUT /order/:orderId  
Atualiza um pedido existente.

DELETE /order/:orderId  
Remove um pedido do banco de dados.

Banco de Dados

O projeto utiliza MySQL com duas tabelas principais.

Tabela orders  
orderId (VARCHAR)  
value (DECIMAL)  
creationDate (DATETIME)

Tabela items  
id (INT AUTO_INCREMENT)  
orderId (VARCHAR)  
productId (INT)  
quantity (INT)  
price (DECIMAL)

Como executar o projeto

1. Clonar o repositório

git clone https://github.com/Matheus-Dev404/Projeto_Prova.git

2. Entrar na pasta do projeto

cd Projeto_Prova

3. Instalar dependências

npm install

4. Configurar a conexão com MySQL no arquivo db.js

5. Executar o servidor

node server.js

Servidor rodando em:

http://localhost:3000

Autor

Matheus Vinic
