//library
import express from "express";
import http from "http";
import { Server as WebSocketServer } from "socket.io";
import cors from "cors";
import responseTime from "response-time";

//cronjob
// import "./cronjobs/citasNotification.js";
// import "./cronjobs/cumpleClientes.js";

//middleware
import logger from "./middleware/logger.js";
import router from "./routes/index.routes.js";

const app = express();

export const server = http.createServer(app);

const corsOptions = {
  origin: ["*"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const io = new WebSocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors(corsOptions));
app.use(responseTime());
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

export const stateEmpresa = (message) => {
  io.emit("stateEmpresa", message);
};

// Ejemplo de enviar notificación
export const sendNotification = (message) => {
  io.emit("nuevaNotificacion", message);
};

export const updateNotifi = (message) => {
  io.emit("notificacionActualizada", message);
};

export const updateListProyectos = (message) => {
  io.emit("updateListProyectos", socketID);
};

//middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use(router);

export default app;
export { io };
