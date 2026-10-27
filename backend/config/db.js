
const { Sequelize } = require("sequelize");

if (!process.env.PG_STRING) {
  throw new Error("PG_STRING is not configured.");
}

const db = new Sequelize(process.env.PG_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

const testConnection = async () => {
  await db.authenticate();

  console.log("[Database] Connected successfully using PostgreSQL");
  return true;
};

module.exports = {
  db,
  testConnection,
  getDialect: () => "postgres",
};
