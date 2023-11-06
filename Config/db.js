const knex = require('knex');
const knexFile = require('./knexfile.js');

const db = knex(knexFile.development);
module.exports = db
// const mysql = require('mysql');

// const db = mysql.createPool({
//   host:'localhost',
//   user:'root',
//   password:'password',
//   database:'ModCampaign'
// })
// db.getConnection((err, connection) => {})

// module.exports = db