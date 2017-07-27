const sqlaas = require("../src/client")
const dbUrl = "http://localhost:5000/"
sqlaas("select * from employees;", dbUrl)
.then(queryResults => console.log("query results", queryResults))
.catch(error => console.error(error))
// expect 3 rows with columns id title name salary start_date
