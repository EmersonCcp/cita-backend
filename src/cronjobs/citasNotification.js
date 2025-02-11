// cronJobs.js

import cron from "node-cron";
import { Sequelize } from "sequelize";
import { Cita } from "../models/Cita.js";
import { Funcionario } from "../models/Funcionario.js";
import { Cliente } from "../models/Cliente.js";
import { Notificacion } from "../models/Notificacion.js";
import { sendNotification } from "../app.js";
import moment from "moment-timezone";
import { sequelize } from "../database/database.js";

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const scheduleCitaNotification = () => {
  cron.schedule("0 7 * * *", async () => {
    console.log(`Cron job ejecutado: Verificando citas próximas a vencer...`);

    console.log("Ejecutando cron job para verificar citas de mañana...");

    try {
      // Obtener la fecha de mañana en formato YYYY-MM-DD
      const fechaManana = moment().add(1, "days").format("YYYY-MM-DD");

      // Buscar citas programadas para mañana
      const citas = await sequelize.query(
        `SELECT 
                              c.cita_codigo,
                              c.cita_fecha,
                              c.cita_estado,
                              c.cita_hora,
                              cl.cli_nombre,
                              cl.cli_apellido,
                              cl.fk_empresa
                          FROM citas c
                          JOIN clientes cl ON c.fk_cliente = cl.cli_codigo
                          WHERE TO_DATE(c.cita_fecha, 'YYYY-MM-DD') = CURRENT_DATE + INTERVAL '1 day';`,
        { type: sequelize.QueryTypes.SELECT }
      );

      if (citas.length === 0) {
        console.log("No hay citas programadas para mañana.");
        return;
      }

      console.log(`Se encontraron ${citas.length} citas para mañana.`);

      // Crear notificaciones para cada cita encontrada
      const notificaciones = citas.map((cita) => {
        const mensaje = `${cita.cli_nombre} ${cita.cli_apellido} Tiene una cita programada para ${fechaManana} a las ${cita.cita_hora}.`;

        // Crear el objeto de notificación
        const notificacion = {
          noti_mensaje: mensaje,
          noti_rango: 1, // Puedes definir el rango según la prioridad
          fk_empresa: cita.fk_empresa,
        };

        // Llamar al método senNotification para enviar la notificación
        sendNotification(notificacion);

        return notificacion;
      });

      // Guardar notificaciones en la base de datos
      await Notificacion.bulkCreate(notificaciones);

      console.log("Notificaciones creadas exitosamente.");
    } catch (error) {
      console.error("Error al ejecutar el cron job:", error);
    }
  });
};

scheduleCitaNotification();
