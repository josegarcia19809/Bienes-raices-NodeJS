import {check, validationResult} from "express-validator";
import Usuario from "../models/Usuario.js";

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar sesión"
    })
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: "Crear cuenta"
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: "Recupera tu acceso a Bienes raíces"
    })
}

const registrar = async (req, res) => {
    // Validación
    await check("nombre").notEmpty().withMessage("El nombre es obligatorio").run(req);
    let resultado=validationResult(req);
    res.json(resultado.array());

    const usuario= await Usuario.create(req.body);
    res.json(usuario);
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar
}