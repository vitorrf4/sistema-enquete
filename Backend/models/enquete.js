const { DataTypes, Model} = require('sequelize');
const sequelize = require('../config/dbConfig');
const Opcao = require('./opcao');

class Enquete extends Model {
    static calcularStatus(dataInicio, dataFim) {
        const dateInicio = new Date(dataInicio);
        const dateFim = new Date(dataFim);

        if (new Date(Date.now()) < dateInicio) {
            return "NAO_INICIADA";
        } else if (new Date(Date.now()) < dateFim) {
            return "EM_ANDAMENTO";
        } else {
            return "FINALIZADA";
        }
    }
}

Enquete.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dataInicio: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        dataFim: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM,
            values: ["NAO_INICIADA", "EM_ANDAMENTO", "FINALIZADA"],
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'Enquete',
        timestamps: false
    });

Enquete.hasMany(Opcao, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: "opcoes"
});
Opcao.belongsTo(Enquete);

module.exports = Enquete;
