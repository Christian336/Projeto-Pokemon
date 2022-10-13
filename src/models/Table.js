const db = require('./db')

const Table = db.sequelize.define('pokemon', {
    tipo: {
        type: db.Sequelize.STRING
    },
    treinador: {
        type: db.Sequelize.STRING
    },
    nivel: {
        type: db.Sequelize.INTEGER
    }
})

//Table.sync({force: true})

module.exports = Table