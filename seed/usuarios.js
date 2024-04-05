import bcrypt from "bcrypt";

const usuarios = [
    {
        nombre: "José L García",
        email: "josegarcia@gmail.com",
        confirmado: 1,
        password: bcrypt.hashSync("Password", 10)
    }
]

export default usuarios;
