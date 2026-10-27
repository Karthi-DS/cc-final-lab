const { Sequelize } = require("sequelize");
const path = require("path");

let db;
let dialectInUse = "sqlite";

// Configure Sequelize instance
if (process.env.PG_STRING && process.env.FORCE_POSTGRES === "true") {
  db = new Sequelize(process.env.PG_STRING, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
  dialectInUse = "postgres";
} else {
  // Use SQLite for instant, zero-network-dependency local storage
  db = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "..", "restaurant.sqlite"),
    logging: false,
  });
  dialectInUse = "sqlite";
}

const testConnection = async () => {
  try {
    await db.authenticate();
    console.log(`[Database] Connected successfully using dialect: ${dialectInUse}`);
    return true;
  } catch (error) {
    console.warn(`[Database] Failed to connect using ${dialectInUse}:`, error.message);
    if (dialectInUse !== "sqlite") {
      console.log("[Database] Falling back to local SQLite database...");
      db = new Sequelize({
        dialect: "sqlite",
        storage: path.join(__dirname, "..", "restaurant.sqlite"),
        logging: false,
      });
      await db.authenticate();
      dialectInUse = "sqlite";
      console.log("[Database] SQLite fallback connection successful!");
      return true;
    }
    throw error;
  }
};

module.exports = {
  db,
  testConnection,
  getDialect: () => dialectInUse,
};
