// cronJobs.js

import cron from "node-cron";
import { Sequelize } from "sequelize";
import { Cita } from "../models/Cita.js";
import { Funcionario } from "../models/Funcionario.js";
import { Cliente } from "../models/Cliente.js";
import { Notificacion } from "../models/Notificacion.js";
import { sendNotification } from "../app.js";
import moment from "moment-timezone";

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const scheduleCitaNotification = () => {
  cron.schedule("*/10 * * * * *", async () => {
    console.log(`Cron job ejecutado: Verificando citas próximas a vencer...`);

    try {
      // Fecha actual
      const currentDate = moment()
        .tz("America/Asuncion")
        .startOf("day")
        .toDate();
      // Fecha objetivo: un día después
      const targetDate = new Date(currentDate);
      targetDate.setDate(currentDate.getDate() + 1);

      const targetDateString = formatDate(targetDate);

      // Obtener todas las citas cuya fecha es igual a la fecha objetivo
      const citas = await Cita.findAll({
        where: Sequelize.where(
          Sequelize.fn("DATE", Sequelize.col("cita_fecha")),
          targetDateString
        ),
      });

      // Iterar sobre las citas y enviar notificaciones
      for (const cita of citas) {
        const citaData = cita.get();

        let cliente = await Cliente.findOne({
          where: { cli_codigo: citaData.fk_cliente },
        });

        const clienteData = cliente.get();

        let funcionario = await Funcionario.findOne({
          where: { fun_codigo: citaData.fk_funcionario },
        });

        const funcionarioData = funcionario.get();

        const clienteNombre = `${clienteData.cli_nombre} ${clienteData.cli_apellido}`;
        const funcionarioNombre = `${funcionarioData.fun_nombre} ${funcionarioData.fun_apellido}`;

        const mensaje = `Recordatorio: ${funcionarioNombre}, Tienes una cita con ${clienteNombre} el ${citaData.cita_fecha} a las ${citaData.cita_hora}.`;

        // Crear una notificación
        let notificacion = await Notificacion.create({
          noti_mensaje: mensaje,
          noti_visto: false,
        //   cita_codigo: cita.cita_codigo,
          noti_rango: 0,
        });

        // Aquí puedes implementar la función para enviar notificaciones, ya sea por correo o push
        sendNotification(notificacion);

        // console.log(
        //   `---------Notificación creada para la cita con ${clienteNombre} el ${fechaCita} a las ${horaCita}---------`
        // );
      }

      console.log("Verificación de citas completada.");
    } catch (error) {
      console.error("Error al verificar citas próximas:", error);
    }
  });
};

// scheduleCitaNotification();
