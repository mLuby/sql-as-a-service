const IS_NODE = typeof require !== "undefined"
if (IS_NODE) {
  module.exports = {
    sqlConnect,
    sqlExecute,
  }
} else { // IS_BROWSER
  window.Sqlaas =  {
    sqlConnect,
    sqlExecute,
  }
}

const pg = require("pg")
const parseUrl = require("url").parse

function sqlConnect (connectionParams) {
  return new Promise((resolve, reject) => {
    const DATABASE_URL = "postgres://mLuby:@localhost:5432/sqlaas-example"
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
    pool.on("error", err => console.error("Pool error, idle client", err.message, err.stack))
    return resolve(pool)
  })
}

function sqlExecute (sqlString) {
  return pool => new Promise((resolve, reject) => {
    pool.connect((connectError, client, done) => {
      if (connectError) {
        done(connectError) // release the client back to the pool (or destroy it if there is an error)
        reject(new Error(`Connect Error: ${connectError}`))
      } else {
        client.query(sqlString, (queryError, result) => {
          done(queryError) // release the client back to the pool (or destroy it if there is an error)
          if (queryError) {
            reject(new Error(`Query Error: ${queryError}`))
          } else {
            resolve(result.rows)
          }
        })
      }
    })
  })
}
