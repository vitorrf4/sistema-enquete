const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/dbConfig');

class Opcao extends Model {}

Opcao.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        votos: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }
    },
    {
        sequelize,
        tableName: 'Opcao',
        timestamps: false
    });

module.exports = Opcao;
