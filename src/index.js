import app from "./app.js";
import { server } from "./app.js";
import { sequelize } from "./database/database.js";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const client = createClient({
  url: process.env.REDIS_URL,
});

async function main() {
  try {
    await sequelize.sync({ force: false });
    await sequelize.authenticate();
    await client.connect();
    client.on("connect", () => {
      console.log("Conexión a Redis establecida");
    });
    server.listen(3000);
    console.log("Servidor ejecutando en el puerto 3000");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();
