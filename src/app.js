import express from "express";
import userRoutes from "./routes/users.routes.js";
import authenticationRoutes from "./routes/authentication.routes.js";
import clienteRoutes from "./routes/clientes.routes.js";
import servicioRoutes from "./routes/servicios.routes.js";
import citaRoutes from "./routes/citas.routes.js";
import citaServicioRoutes from "./routes/citas_servicios.routes.js";
import cors from "cors";

const app = express();
app.use(cors());

//middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:42767", // Cambia esto al origen específico en producción
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Añadir manualmente encabezados CORS (opcional)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:42767"); // Cambia esto al origen específico en producción
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(userRoutes);
app.use("/v1/api/auth", authenticationRoutes);
app.use("/v1/", clienteRoutes);
app.use("/v1/", servicioRoutes);
app.use("/v1/", citaRoutes);
app.use("/v1/", citaServicioRoutes);

export default app;
