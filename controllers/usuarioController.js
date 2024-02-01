import {check, validationResult} from "express-validator";
import Usuario from "../models/Usuario.js";
import {generarId} from "../helpers/tokens.js";
import {emailRegistro, emailOlvidePassword} from "../helpers/emails.js";

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar sesión"
    })
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: "Crear cuenta",
        csrfToken: req.csrfToken()
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: "Recupera tu acceso a Bienes raíces",
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) => {
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
            csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
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

const confirmar = async (req, res) => {
    const {token} = req.params;

    // Verificar si el token es válido
    const usuario = await Usuario.findOne({where: {token}});
    if (!usuario) {
        return res.render("auth/confirmar-cuenta", {
            pagina: "Error al confirmar tu cuenta",
            mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
            error: true
        });
    }

    // Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();
    return res.render("auth/confirmar-cuenta", {
        pagina: "Cuenta confirmada",
        mensaje: "La cuenta se confirmó correctamente"
    });
}

const resetPassword = async (req, res) => {
    // Validación
    await check("email").isEmail().withMessage("El email no es válido").run(req);

    let resultado = validationResult(req);

    // Verificar que resultado esté vacío
    if (!resultado.isEmpty()) {
        // Hubo errores
        return res.render('auth/olvide-password', {
            pagina: "Recupera tu acceso a bienes raíces",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }

    // Buscar al usuario
    const {email} = req.body;
    const usuario = await Usuario.findOne({where: {email}});
    if (!usuario) {
        return res.render('auth/olvide-password', {
            pagina: "Recupera tu acceso a bienes raíces",
            csrfToken: req.csrfToken(),
            errores: [{msg: "El email no pertenece a ningún usuario"}]
        });
    }

    // Generar un token y enviar al email
    usuario.token = generarId();
    await usuario.save();

    // Enviar un email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })
    // Renderizar un mensaje
    res.render("templates/mensaje", {
        pagina: "Reestablece tu password",
        mensaje: "Hemos enviado un email con las instrucciones"
    })
}

const comprobarToken = async (req, res) => {
    const {token} = req.params;
    const usuario = await Usuario.findOne({where: {token}});

    if (!usuario) {
        return res.render("auth/confirmar-cuenta", {
            pagina: "Reestablece tu password",
            mensaje: "Hubo un error al validar tu información, intenta de nuevo",
            error: true
        });
    }
}

const nuevoPassword = (req, res) => {

}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword
}