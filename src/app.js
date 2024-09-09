import express from "express";
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

import cors from "cors";

const app = express();
app.use(cors());

//middlewares
app.use(express.json());
app.use(
  cors({
    // origin: "http://localhost:42767",
    // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // preflightContinue: false,
    // optionsSuccessStatus: 204,
  })
);

// Añadir manualmente encabezados CORS (opcional)
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // Cambia esto al origen específico en producción
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,PUT,POST,DELETE,PATCH,OPTIONS"
//   );
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }
//   next();
// });

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

export default app;
