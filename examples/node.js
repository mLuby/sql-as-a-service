const sqlaas = require("../src/client")
const config = {apiKey: "sqlaas_example", dbUrl: "http://localhost:5000/dbs/sqlaas_example"}
sqlaas("select * from employees;", config)
.then(queryResults => console.log("query results", queryResults))
.catch(error => console.error(error))
// expect 3 rows with columns id title name salary start_date
