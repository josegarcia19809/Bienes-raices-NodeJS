import jwt from "jsonwebtoken";

const generarId = () => Date.now().toString(32) + Math.random().toString(32).substring(2);

const generarJWT = (id) => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})

export {
    generarId,
    generarJWT
}