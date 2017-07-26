# SQL-as-a-service
Firebase for SQL

No migrations, backups, or sharding; NOT FOR PRODUCTION!

## Usage
```js
sqlConnect({apiKey: "<API_KEY>", databaseURL: "https://sqlaas.io/<DATABASE_NAME>"})
.then(sqlExecute("select * from <TABLE_NAME> limit 1;"))
.then(queryResults => console.log("query results", queryResults))
.catch(console.error)
```

## Installation
### Node:
```sh
npm install --save sqlaas
```
```js
const {sqlConnect, sqlExecute} = require("sqlaas")
```
### Browser:
```html
<script src="https://sqlaas.io/latest"></script>
<script>const {sqlConnect, sqlExecute} = window.Sqlaas</script>
```

# TODO
- generate API_KEYs tied to DATABASE_NAME.
  - user goes to sqlaas.io/register.
  - display warning "Data may be overwritten at any time while in development."
  - user enters email and DATABASE_NAME.
  - if DATABASE_NAME not taken, display API_KEY.
  - API_KEY and DATABASE_NAME give auth to database.
  - allow `CREATE TABLE` `INSERT INTO` `UPDATE` `SELECT` `DELETE`
