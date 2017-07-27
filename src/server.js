const fs = require("fs")
const parseUrl = require("url").parse
const express = require("express")
const cors = require("cors")
const pg = require("pg")


const PORT = process.env.PORT || 5000
const dbAlreadyRegisteredError = new Error("DB is already registered. If it's yours use the API key; otherwise please retry with a different DB name.")
const TABLE_EXISTS_ERROR_CODE = "42P07"
const DEFAULT_DATABASE = "postgres"
const DATABASE_URL = process.env.DATABASE_URL || `postgres://${process.env.USER}:@localhost:5432/${process.env.DB_NAME || DEFAULT_DATABASE}`
let pool
getPool() // connect early so first request isn't slow.


const app = express()
app.use(cors())
// https://localhost:5000?sql="select * from employees;"
app.get("/", function(request, response){
  console.log("Executing SQL:", request.query.sql)
  const sqlString = request.query.sql || "SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema = 'public';"
  getPool()
  .then(runSql(sqlString)) // TODO SQL injection? Can't escape properly…
  .then(rows => response.json(rows))
  .catch(e => response.send(e))
})
app.listen(PORT, () => console.log(`Listening on port ${PORT}…`))


// if it doesn't exist, create employees table and add test data
fs.readFile("src/employees.sql", 'utf8', (readError, sqlString) => {
  if (readError) { console.log("read error"); throw readError }
  console.log(sqlString)
  getPool()
  .then(runSql(sqlString))
  .then(() => console.log("Created employees table and loaded sample data."))
  .catch(runSqlError => runSqlError.code === TABLE_EXISTS_ERROR_CODE ? console.log("Table employees already exists.") : console.error(runSqlError))
})

// runSql :: Pool -> String -> Promise Error | Rows
function runSql (sqlString) {
  return pool => new Promise((resolve, reject) => {
    pool.connect((connectError, client, done) => {
      if (connectError) {
        done(connectError) // release the client back to the pool (or destroy it if there is an error)
        reject(connectError)
      } else {
        client.query(sqlString, (queryError, result) => {
          done(queryError) // release the client back to the pool (or destroy it if there is an error)
          queryError ? reject(queryError) : resolve(result.rows)
        })
      }
    })
  })
}

// getPool :: () -> Promise Pool
function getPool () {
  if (pool) { return Promise.resolve(pool) }
  return new Promise((resolve, reject) => {
    const dbParams = parseUrl(DATABASE_URL)
    const dbAuth = dbParams.auth.split(":")
    const dbConfig = {
      database: dbParams.pathname.split("/")[1],
      host: dbParams.hostname,
      password: dbAuth[1],
      port: dbParams.port,
      ssl: Boolean(dbAuth[1]),
      user: dbAuth[0],
    }
    const pool = new pg.Pool(dbConfig)
    pool.on("error", reject)
    return resolve(pool)
  })
}

// Add Error.toJSON for serialization
if (!('toJSON' in Error.prototype)) Object.defineProperty(Error.prototype, 'toJSON', { // https://stackoverflow.com/a/18391400
  value: function () { var alt = {}; Object.getOwnPropertyNames(this).forEach(function (key) {
      alt[key] = this[key];
      if (key === "stack") { alt[key] = alt[key].split("\n"); }
    }, this);
    return alt;
  },
  configurable: true,
  writable: true
})
