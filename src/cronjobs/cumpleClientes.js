import cron from "node-cron";
import { Sequelize } from "sequelize";
import { Cita } from "../models/Cita.js";
import { Funcionario } from "../models/Funcionario.js";
import { Cliente } from "../models/Cliente.js";
import { Notificacion } from "../models/Notificacion.js";
import { sendNotification } from "../app.js";
import { sequelize } from "../database/database.js";
import moment from "moment-timezone";

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

//se ejecuta una vez a las 8:00 am
cron.schedule("*/10 * * * * *", async () => {
  try {
    // Fecha actual
    const now = moment().tz("America/Asuncion");
    const todayMonthDay = now.format("MM-DD"); // Mes y día de hoy

    // Obtener todos los clientes cuya fecha de cumpleaños (mes y día) coincide con la fecha de hoy
    const clientes = await sequelize.query(
      `SELECT
    cli_nombre,
    cli_apellido
FROM
    clientes
WHERE
    EXTRACT(MONTH FROM TO_DATE(cli_fecha_nacimiento, 'YYYY-MM-DD')) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(DAY FROM TO_DATE(cli_fecha_nacimiento, 'YYYY-MM-DD')) = EXTRACT(DAY FROM CURRENT_DATE);`,
      { type: sequelize.QueryTypes.SELECT }
    );

    // Enviar notificación para cada cliente que cumple años
    clientes.forEach(async (cliente) => {
      const mensaje = `Hoy es el cumpleaños de ${cliente.cli_nombre} ${cliente.cli_apellido}!`;

      let notificacion = await Notificacion.create({
        noti_mensaje: mensaje,
        noti_visto: false,
        // cita_codigo: cita.cita_codigo,
        noti_rango: 0,
      });

      sendNotification(notificacion);
    });
  } catch (error) {
    console.error("Error al enviar las notificaciones de cumpleaños:", error);
  }
});
