import { Sequelize } from "sequelize";
import dbConfig from "../config/dbConfig";


export const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect as any,
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default sequelize;


// export const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect as any,
//   port: dbConfig.port,
//   dialectOptions: dbConfig.dialectOptions,
//   logging: false, // optional: turn off SQL logging
// });
