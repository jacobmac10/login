// Importar librería Sequelize
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

// Importar conexión a base de datos
const { sequelize } = require('./../config/db');

// Crear modelo
class Image extends Model {
}

Image.init({
    //Definir campos del modelo
    data: {
        type: Sequelize.BLOB('long'),
        allowNull: false
    },
    mimetype: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'image'
});

// Exportar modelo
module.exports = { Image };