const Sequelize = require('sequelize').Sequelize;
//database,username,password
let sequelize = new Sequelize('login','root','root',{
    host: 'localhost',
    dialect: 'mysql'
});
//promise
sequelize
    .authenticate()
    //caso exito
    .then(() => {
        console.log('MySQL connection successful');
    })
    //caso error
    .catch((err) => {
        console.error('MySql connection error: ',err);
    });

module.exports = {
    //sequelize: sequelize
    sequelize
}