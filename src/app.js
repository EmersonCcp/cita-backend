//routes
import userRoutes from "./routes/users.routes.js";
import authenticationRoutes from "./routes/authentication.routes.js";
import clienteRoutes from "./routes/clientes.routes.js";
import servicioRoutes from "./routes/servicios.routes.js";
import citaRoutes from "./routes/citas.routes.js";
import citaServicioRoutes from "./routes/citas_servicios.routes.js";
import proveedoresRoutes from "./routes/proveedores.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import comprasRoutes from "./routes/compras.routes.js";
import detallesComprasRoutes from "./routes/detalles_compras.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import detallesVentasRoutes from "./routes/detalles_ventas.routes.js";
import cobrosRoutes from "./routes/cobros.routes.js";
import cuotasRoutes from "./routes/cuotas.routes.js";
import sqlExecuteRoutes from "./routes/sql_execute.routes.js";
import funcionariosRoutes from "./routes/funcionarios.routes.js";
import vendedoresRoutes from "./routes/vendedores.routes.js";
import notificacionesRoutes from "./routes/notificaciones.routes.js";
import pagosRoutes from "./routes/pagos.routes.js";
import valesRoutes from "./routes/vales.routes.js";
import horaExtraRoutes from "./routes/hora_extra.routes.js";

//library
import express from "express";
import http from "http";
import { Server as WebSocketServer } from "socket.io";
import cors from "cors";

//cronjob
// import "./cronjobs/citasNotification.js";
// import "./cronjobs/cumpleClientes.js";

//middleware
import logger from "./middleware/logger.js";

const app = express();

export const server = http.createServer(app);

const io = new WebSocketServer(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(logger);
app.get("/serve", (req, res) => {
  res.send("¡El servidor está funcionando correctamente!");
});

let socketID;
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socketID = socket.id;

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Ejemplo de enviar notificación
export const sendNotification = (message) => {
  io.emit("nuevaNotificacion", message);
};

export const updateListProyectos = (message) => {
  io.emit("updateListProyectos", socketID);
};

//middlewares
app.use(express.json());
app.use(cors());

app.use("/v1/api", userRoutes);
app.use("/v1/api/auth", authenticationRoutes);
app.use("/v1/api", clienteRoutes);
app.use("/v1/api", servicioRoutes);
app.use("/v1/api", citaRoutes);
app.use("/v1/api", citaServicioRoutes);
app.use("/v1/api", proveedoresRoutes);
app.use("/v1/api", productosRoutes);
app.use("/v1/api", comprasRoutes);
app.use("/v1/api", detallesComprasRoutes);
app.use("/v1/api", ventasRoutes);
app.use("/v1/api", detallesVentasRoutes);
app.use("/v1/api", cobrosRoutes);
app.use("/v1/api", cuotasRoutes);
app.use("/v1/api", sqlExecuteRoutes);
app.use("/v1/api", funcionariosRoutes);
app.use("/v1/api", vendedoresRoutes);
app.use("/v1/api", notificacionesRoutes);
app.use("/v1/api", pagosRoutes);
app.use("/v1/api", valesRoutes);
app.use("/v1/api", horaExtraRoutes);

export default app;
export { io };
