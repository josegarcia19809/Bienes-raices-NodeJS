import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const {email, nombre, token} = datos;

    // Enviar el email
    await transporter.sendMail({
        from: "Bienesraices.com",
        to:email,
        subject: "Confirma tu cuenta en Bienesraices.com",
        text: "Confirma tu cuenta en Bienesraices.com",
        html:`
            <p>Hola ${nombre}, confirma tu cuenta en Bienesraices.com</p>
            <p>
                Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace
                <a href="">Confirmar cuenta</a>
            </p>
            <p>Si no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}

export {
    emailRegistro
}