const IS_NODE = typeof require !== "undefined"
let fetch
if (IS_NODE) {
  fetch = require('isomorphic-fetch') // global so matches browser
  module.exports = sqlaas
} else { // IS_BROWSER
  fetch = window.fetch
  window.sqlaas = sqlaas
}

function sqlaas (sqlString, dbUrl) {
  if (!dbUrl) {throw new Error("Must specify dbUrl property")}
  return fetch(`${dbUrl}?sql=${sqlString}`)
  .then(response => response.json())
}
