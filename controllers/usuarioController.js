import {check, validationResult} from "express-validator";
import Usuario from "../models/Usuario.js";
import {generarId} from "../helpers/tokens.js";
import {emailRegistro} from "../helpers/emails.js";

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
    console.log(req.body);
    // Validación
    await check("nombre").notEmpty().withMessage("El nombre es obligatorio").run(req);
    await check("email").isEmail().withMessage("El email no es válido").run(req);
    await check("password").isLength({min: 6}).withMessage("El password debe tener 6" +
        " caracteres").run(req);
    await check("repetir_password").equals(req.body.password).withMessage("Los passwords no son" +
        " iguales").run(req);

    let resultado = validationResult(req);

    // Verificar que resultado esté vacío
    if (!resultado.isEmpty()) {
        // Hubo errores
        return res.render('auth/registro', {
            pagina: "Crear cuenta",
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    // Extraer los datos
    const {nombre, email, password} = req.body;
    // Verificar que el usuario no esté duplicado
    const existeUsuario = await Usuario.findOne({where: {email}});
    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: "Crear cuenta",
            errores: [{msg: "El usuario ya está registrado"}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    // Almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    });

    // Enviar email de confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // Mostrar mensaje de confirmación
    res.render("templates/mensaje", {
        pagina: "Cuenta creada correctamente",
        mensaje: "Hemos enviado un email de confirmación, presiona en el enlace"
    })
}

const confirmar = (req, res) => {
    const {token} = req.params;

    // Verificar si el token es válido

    // Confirmar la cuenta
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar
}