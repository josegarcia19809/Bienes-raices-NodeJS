import {DataTypes} from "sequelize";
import db from "../config/db.js";

const Categoria = db.define('categorias', {
    titulo: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
});

export default Categoria;