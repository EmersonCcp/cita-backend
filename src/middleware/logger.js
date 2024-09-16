// middlewares/logger.js
import chalk from "chalk";

const logger = (req, res, next) => {
  const { method, url } = req;
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    // Definir colores basados en el código de estado
    let statusColor;
    if (statusCode >= 500) {
      statusColor = chalk.red;
    } else if (statusCode >= 400) {
      statusColor = chalk.yellow;
    } else if (statusCode >= 300) {
      statusColor = chalk.cyan;
    } else if (statusCode >= 200) {
      statusColor = chalk.green;
    } else {
      statusColor = chalk.white;
    }

    // Formatear la salida con colores
    console.log(
      `${chalk.blue(method)} ${chalk.magenta(url)} - ${statusColor(
        statusCode
      )} - ${chalk.gray(duration + "ms")}`
    );
  });

  next();
};

export default logger;
