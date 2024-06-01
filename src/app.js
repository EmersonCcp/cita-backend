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

app.use(userRoutes);
app.use("/v1/api/auth", authenticationRoutes);
app.use("/v1/", clienteRoutes);
app.use("/v1/", servicioRoutes);
app.use("/v1/", citaRoutes);
app.use("/v1/", citaServicioRoutes);

export default app;
