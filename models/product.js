const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db.js')

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    plu: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Product
