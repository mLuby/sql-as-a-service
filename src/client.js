const IS_NODE = typeof require !== "undefined"
let fetch
let btoa
if (IS_NODE) {
  fetch = require('isomorphic-fetch') // global so matches browser
  btoa = require('btoa') // global so matches browser
  module.exports = sqlaas
} else { // IS_BROWSER
  fetch = window.fetch
  btoa = window.btoa
  window.sqlaas = sqlaas
}

function sqlaas (sqlString, config) {
  if (!config.dbUrl) {throw new Error("Must specify dbUrl property")}
  if (!config.apiKey) {throw new Error("Must specify apiKey property")}

  const dbName = config.dbUrl.split("/dbs/")[1] // "sqlaas_example" // TODO parse instead?

  const Authorization = "Basic " + btoa(`${dbName}:${config.apiKey}`)
  const options = {headers: {Authorization}}
  return fetch(`${config.dbUrl}?sql=${sqlString}`, options)
  .then(response => response.json())
}
