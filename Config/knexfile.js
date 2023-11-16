// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
require("dotenv").config();
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.MYSQL_HOST || "localhost",
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "rJutkIS30032545!",
      database: process.env.MYSQL_DB || "ModCampaign",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  // production: {
  //   client: "mysql2",
  //   connection: {
  //     host: process.env.MYSQL_HOST,
  //     port: process.env.MYSQL_PORT,
  //     user: process.env.MYSQL_USER,
  //     password: process.env.MYSQL_PASSWORD,
  //     database: process.env.MYSQL_DB,
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10,
  //   },
  //   migrations: {
  //     tableName: "knex_migrations",
  //   },
  // },
};
