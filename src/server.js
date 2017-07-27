const hat = require("hat")
const express = require("express")
const cors = require("cors")
// const bodyParser = require("body-parser")
const pg = require("pg")
const formatSql = require("pg-format")
const parseUrl = require("url").parse
const passport = require("passport")
const BasicStrategy = require('passport-http').BasicStrategy
// var DigestStrategy = require('passport-http').DigestStrategy


const dbs = {sqlaas_example: ["sqlaas_example"]} // {String dbName: [String apiKey]}
passport.use(new BasicStrategy((dbName, apiKey, done) => {
  const apiKeys = dbs[dbName]
  return done(null, apiKeys && apiKeys.includes(apiKey))
  // const apiKeysQuery = formatSql("SELECT api_key FROM db_api_keys WHERE db_name = %s", dbName)
  // getPool("dbName")
  // .then(runSql(apiKeysQuery))
  // .then(apiKeys => {
  //   if (err) { return done(err); }
  //   if (!user) { return done(null, false); }
  //   return done(null, user, api_key);
  // })
}))
const useAuthentication = passport.authenticate("basic", {session: false})
const app = express()
app.use(cors())
// app.use(bodyParser.json())
const PORT = process.env.PORT || 5000
const dbAlreadyRegisteredError = new Error("DB is already registered. If it's yours use the API key; otherwise please retry with a different DB name.")
const DB_EXISTS_ERROR_CODE = "42P04" // https://github.com/jrf0110/pg-destroy-create-db/blob/master/index.js#L13-L14


// http://localhost:5000/dbs/foo/register
app.get("/dbs/:dbName/register", function(request, response){
  const dbName = request.params.dbName
  registerDb(dbName)
  .then(apiKey => response.send(`Your API key is ${apiKey}. Write it down since you'll need it to access your DB and you can't recover it.`))
  .catch(e => response.send(e))
})


// https://localhost:5000/dbs/sqlaas_example?sql="select * from employees;"
app.get("/dbs/:dbName", useAuthentication, function(request, response){
  // console.log("params", request.params, "query", request.query, "body", request.body, dbs)
  const dbName = request.params.dbName
  const apiKey = request.query.api_key
  // const sqlString = request.body.sqlString
  const sqlString = request.query.sql || "SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema = 'public';"
  getPool(dbName)
  .then(runSql(sqlString)) // TODO SQL injection? Can't escape properly…
  .then(rows => response.json(rows))
  .catch(e => response.send(e))
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}…`))


// registerDb :: String -> Promise String
function registerDb (dbName) {
  return new Promise((resolve, reject) => {
    getPool("sqlaas_example") // just need a DB to create another; should always exist.
    .then(runSql(formatSql("CREATE DATABASE %s", dbName)))
    .then(() => {
      const apiKey = hat()
      dbs[dbName] = (dbs[dbName] || []).concat(apiKey)
      resolve(apiKey)
    })
    .catch(error => reject(error.code === DB_EXISTS_ERROR_CODE ? dbAlreadyRegisteredError : error))
  })
}

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

// getPool :: String -> Promise Pool
function getPool (dbName) {
  return new Promise((resolve, reject) => {
    const DATABASE_URL = `postgres://${process.env.USER}:@localhost:5432/${dbName}`
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
