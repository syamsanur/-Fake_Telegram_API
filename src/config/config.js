const mysql = require('mysql2')
const env = require('../helper/env')

const db = mysql.createConnection({
    host: env.HOST,
    user: env.USER,
    database: env.DATABASE,
    dateStrings: 'date'
})

module.exports = db