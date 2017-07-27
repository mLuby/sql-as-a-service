# sqlaas: SQL-as-a-service
Firebase for SQL

## Quick Start
1. Create a free instance of this app on Heroku by clicking this button:
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
2. When it's done deploying, click View App button and record the URL of your heroku app. It'll be something like "https://calm-plateau-12345.herokuapp.com".
3. Follow the usage guide on connecting browser and node clients to start reading and writing SQL!

## Usage
```js
const dbUrl = "https://<APP_NAME>.herokuapp.com"
sqlaas("select * from employees;", dbUrl)
.then(queryResults => console.log("query results", queryResults))
.catch(error => console.error(error))
// expect 3 rows with columns id title name salary start_date
```
You can also write SQL directly in your browser URL bar:
>https://<APP_NAME>.herokuapp.com/?`sql=select * from employees;`

## Installation
### Node:
```sh
npm install --save sqlaas
```
```js
const sqlaas = require("sqlaas")
```
### Browser:
```html
<script src="../src/client.js"></script>
<!-- available as window.sqlaas -->
```

## Server
To run your own SQL-as-a-service, clone down this repo and run
```sh
npm install
npm start
```
You'll need postgres running.
`npm start` will tell you what to do if anything is missing.
It will also create an example "employees" database if none exists.

## Notes
- Heroku doesn't allow programmatic database creation, so this has to be per-user.
- No migrations, backups, or sharding; NOT FOR PRODUCTION! Very insecure!
