# SQLaaS: SQL-as-a-service
Firebase for SQL

No migrations, backups, or sharding; NOT FOR PRODUCTION!

## Usage
```js
const config = {apiKey: "<API_KEY>", dbUrl: "http://sqlaas.io/dbs/<DB_NAME>"}
sqlaas("select * from employees;", config)
.then(queryResults => console.log("query results", queryResults))
.catch(error => console.error(error))
```

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
