const bcrypt = require('bcryptjs');

// Importar librería Sequelize
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

// Importar conexión a base de datos
const { sequelize } = require('./../config/db');

// Crear modelo
class User extends Model {
    //static - no requiere un User de la base de datos
    static generateHash(password) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        return hash;
    }
    
    //no es static - sí requiere un User de la base de datos
    checkPassword(password) {
        return bcrypt.compareSync(password, this.password);;
    }
}

User.init({
    //Definir campos del modelo
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'user'
});

// Exportar modelo
module.exports = { User };