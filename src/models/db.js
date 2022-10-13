//const Sequelize = require('sequelize')

//Conexão com o banco de dados MySql
/*
const sequelize = new Sequelize('pokemonproject', 'root', '#C33630238c', {
    host: "localhost",
    dialect: 'mysql'
})
*/

var Sequelize = require('sequelize');
var sequelize = new Sequelize('Desafio-jz', 'DesafioAdmin', 'Picachu123', {
  host: 'desafio-jazida.database.windows.net',
  schema: 'schema1',
  dialect: 'mssql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  dialectOptions: {
    encrypt: true
  }
});



module.exports={
    Sequelize: Sequelize,
    sequelize: sequelize
}
