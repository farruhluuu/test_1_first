const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db.js')
const Product = require('./product')

const Stock = sequelize.define('Stock', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: Product, 
            key: 'id'
        },
    },
    shop_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity_on_shelf: { type: DataTypes.INTEGER, defaultValue: 0 },
    quantity_in_order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
    timestamps: true
});

module.exports = Stock