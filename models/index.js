import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";


// Precio.hasOne(Propiedad) // Propiedad tiene una Precio
Propiedad.belongsTo(Precio, {foreignKey: "precioId"}); // una "Propiedad" está asociada a un
// "Precio"
Propiedad.belongsTo(Categoria, {foreignKey: "categoriaId"});

Propiedad.belongsTo(Usuario, {foreignKey: "usuarioId"});
export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}