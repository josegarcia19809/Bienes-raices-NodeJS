import {check, validationResult} from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import {generarId, generarJWT} from "../helpers/tokens.js";
import {emailRegistro, emailOlvidePassword} from "../helpers/emails.js";

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar sesión",
        csrfToken: req.csrfToken(),
    })
}

const autenticar = async (req, res) => {
    // Validación
    await check("email").isEmail().withMessage("El email es obligatorio").run(req);
    await check("password").notEmpty().withMessage("El password es obligatorio").run(req);

    let resultado = validationResult(req);

    // Verificar que resultado esté vacío
    if (!resultado.isEmpty()) {
        // Hubo errores
        return res.render('auth/login', {
            pagina: "Iniciar sesión",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        });
    }

    // Comprobar que el usuario existe
    const {email, password} = req.body;
    const usuario = await Usuario.findOne({where: {email}});
    if (!usuario) {
        return res.render('auth/login', {
            pagina: "Iniciar sesión",
            csrfToken: req.csrfToken(),
            errores: [{msg: "El usuario no existe"}],
        });
    }

    // Comprobar si el usuario ha sido confirmado
    if (!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: "Iniciar sesión",
            csrfToken: req.csrfToken(),
            errores: [{msg: "Tu cuenta no ha sido confirmada"}],
        });
    }

    // Revisar el password
    if (!usuario.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina: "Iniciar sesión",
            csrfToken: req.csrfToken(),
            errores: [{msg: "El password es incorrecto"}],
        });
    }

    // Autenticar al usuario
    const token = generarJWT(usuario.id);

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

    // Mostrar formulario para modificar el password
    res.render("auth/reset-password", {
        pagina: "Reestablece tu password",
        csrfToken: req.csrfToken(),
    })
}

const nuevoPassword = async (req, res) => {
    // Validar el password
    await check("password").isLength({min: 6}).withMessage("El password debe tener 6" +
        " caracteres").run(req);
    let resultado = validationResult(req);

    // Verificar que resultado esté vacío
    if (!resultado.isEmpty()) {
        // Hubo errores
        return res.render('auth/reset-password', {
            pagina: "Reestablece tu password",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }
    // Identificar quién hace el cambio
    const {token} = req.params;
    const {password} = req.body;

    const usuario = await Usuario.findOne({where: {token}});

    // Hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    usuario.token = null;

    await usuario.save();
    return res.render("auth/confirmar-cuenta", {
        pagina: "Password reestablecido",
        mensaje: "El password se guardó correctamente"
    });
}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword
}