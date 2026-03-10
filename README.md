# API de Gerenciamento de Pedidos

API simples desenvolvida em **Node.js + Express + MySQL** para gerenciamento de pedidos.  
O projeto foi criado como desafio de integração de sistemas.

## Tecnologias utilizadas

- Node.js
- Express
- MySQL
- mysql2
- JavaScript

## Estrutura do Pedido

A API recebe um JSON no seguinte formato:

```json
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
