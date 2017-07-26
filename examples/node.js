const {sqlConnect, sqlExecute} = require("../src/sqlaas")

sqlConnect({apiKey: "example", databaseURL: "https://sqlaas.io/example"})
.then(sqlExecute("select * from employees;"))
.then(queryResults => console.log("query results", queryResults))
.catch(console.error)
// expect 3 rows with columns id title name salary start_date
