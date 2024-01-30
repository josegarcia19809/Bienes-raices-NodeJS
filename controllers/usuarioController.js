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

const registrar = (req, res) => {
    console.log("Registrando...")
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar
}