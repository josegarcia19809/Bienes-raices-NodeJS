import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";

// Crear la app
const app = express();

// Routing
app.use("/", usuarioRoutes);

// Definir un puesrto y arrancar el servidor
const port = 3000;
app.listen(port, () => {
   console.log(`Servidor ejecutándose en el puerto ${port}`); 
});

