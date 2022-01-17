# Users Service

O User Service é uma sistema simples para gerenciamento de usuarios que permite o cadastro, consulta, login e alteracoes.

### Tecnologias usadas:
* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/pt-br/)

### Bibliotecas:
* [bcryptjs](https://www.npmjs.com/package/bcryptjs)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [sucrase](https://www.npmjs.com/package/sucrase)
* [uuid](https://www.npmjs.com/package/uuid)
* [yup](https://www.npmjs.com/package/yup)
* [nodemon](https://www.npmjs.com/package/nodemon)


## Instalacao:

Para obeter a aplicacao voce pode usar o seguinte comando em seu termianal:

```bash
# Esse comando ira baixar a aplicacao
git clone git@gitlab.com:Troyack_Vinicius/user-service.git
```

Depois de terminar de baixar sera necessario acessar o diretorio e instalar as dependencias:

```bash
# Entrar na pasta
cd user-service

# Installar dependencias
yarn add
```

Agora com tudo instalado use o seguinte comando para rodar o script de execucao da aplicacao:

```bash
yarn dev
```

## Rotas

### GET /users

Esta rota retorna todos os usuarios cadastrados.
É necessairo um token para obter a resposta da rota.

``RESPONSE STATUS -> HTTP 200 (ok)``

**Resposta**:
```json
[
	{
		"createdOn": "2022-01-17T12:53:24.871Z",
		"password": "$2a$10$8aRFH81Sq8.1yYCqUmLlxOC45G1WA3lDbKDmD4Ugzr.PHVmDtTsvy",
		"age": 30,
		"email": "batdev@kenzie.com",
		"username": "Batman Dev",
		"id": "79a85ce2-0aed-48a4-8cae-82231e365590"
	},
	{
		"createdOn": "2022-01-17T12:54:27.611Z",
		"password": "$2a$10$GvR.6kS0x6MFQj8jKjKSM.FMX8U.P51iijWKMQIKJangjDlZbnM1K",
		"age": 25,
		"email": "Aquadev@kenzie.com",
		"username": "Aquaman Dev",
		"id": "d8515bdb-b077-433c-9969-f784c6764f97"
	}
]
```

### POST /signup

Esta rota é para criacao de um novo usuario

``RESPONSE STATUS -> HTTP 201 (Created)``

**Body**:
```json
{
    "age": 25,
    "username": "Aquaman Dev",
    "email": "Aquadev@kenzie.com",
    "password": "1234Kenzie!"
}
```

**Resposta**
```json
{
	"createdOn": "2022-01-17T12:54:27.611Z",
	"age": 25,
	"email": "Aquadev@kenzie.com",
	"username": "Aquaman Dev",
	"id": "d8515bdb-b077-433c-9969-f784c6764f97"
}
```

### POST /login

Esta rota é para logar um usuario na aplicacao.

``RESPONSE STATUS -> HTTP 200 (OK)``

**Body**:
```json
{
    "username": "Batman Dev",
    "password": "1234Kenzie!"
}
```

**Resposta**
```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJhdG1hbiBEZXYiLCJpYXQiOjE2NDI0MjQwNzMsImV4cCI6MTY0MjQyNzY3M30.RSfdkHFTtKz3ttnhEGX76i61XvoCanB67wPx5IHSyxE"
}
```


### PUT /users/:id/password

Esta rota é para a troca de senha.
É necessario passar o ID como parametro na URL.
O usuario podera alterar apenas sua propria senha.

``RESPONSE STATUS -> HTTP 204 (no content)``
