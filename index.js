import express from "express";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import db from "./config/db.js";

// Crear la app
const app = express();

// Conexión a la base datos
try {
    await db.authenticate();
    db.sync();
    console.log("Conexión correcta a la base de datos");

} catch (e) {
    console.log(e);
}

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}));

// Habilitar cookie parser
app.use(cookieParser());

// Habilitar CSRF
app.use(csurf({cookie: true}));

// Habilitar PUG
app.set("view engine", "pug");
app.set("views", "./views");

// Carpeta pública
app.use(express.static("public"));

// Routing
app.use("/auth", usuarioRoutes);

// Definir un puesrto y arrancar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`);
});

