import categorias from "./categorias.js";
import precios from "./precios.js";
import Categoria from "../models/Categoria.js";
import Precio from "../models/Precio.js";
import db from "../config/db.js";

const importarDatos = async () => {
    try {
        // Autenticar
        await db.authenticate();

        // Generar las columnas
        await db.sync();

        // Insertamos los datos
        // await Categoria.bulkCreate(categorias);
        // console.log("Datos insertados correctamente");

        // await Precio.bulkCreate(precios);
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ]);
        // Ejecutar con  npm run db:importar
        console.log("Datos insertados correctamente");
        process.exit(0);

    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

if (process.argv[2] === "-i") {
    importarDatos();
}



