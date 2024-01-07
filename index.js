import express from "express";

// Crear la app
const app = express();

// Routing
app.get("/", function (req, res) {
    res.json({ msg: "Hola Mundo en Express" })
});

app.get("/nosotros", function (req, res) {
    res.json({ msg: "Nosotros en Express" })
});

// Definir un puesrto y arrancar el servidor
const port = 3000;
app.listen(port, () => {
   console.log(`Servidor ejecutándose en el puerto ${port}`); 
});

