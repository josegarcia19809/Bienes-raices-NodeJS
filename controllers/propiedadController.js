import Precio from "../models/Precio.js";
import Categoria from "../models/Categoria.js";
import {validationResult} from "express-validator";

const admin = (req, res) => {
    res.render("propiedades/admin", {
        pagina: "Mis propiedades",
        barra: true
    })
}

// Formulario para crear una nueva propiedad
const crear = async (req, res) => {
    // Consultar Modelos de Precio y Categoria
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render("propiedades/crear", {
        pagina: "Crear propiedad",
        barra: true,
        csrfToken: req.csrfToken(),
        categorias,
        precios
    })
}

const guardar = async (req, res) => {
    // Validación
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        // Consultar Modelos de Precio y Categoria
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        res.render("propiedades/crear", {
            pagina: "Crear propiedad",
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
        })
    }
}

export {
    admin,
    crear,
    guardar
}