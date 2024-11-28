const express = require('express')
const Stock = require('../models/stock')
const Product = require('../models/product')
const { Sequelize } = require('sequelize')
const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { product_id, shop_id, quantity_on_shelf, quantity_in_order } = req.body

    if (!product_id || !shop_id) {
      return res.status(400).json({ error: 'product_id и shop_id обязательны' })
    }

    const stock = await Stock.create({
      product_id,
      shop_id,
      quantity_on_shelf,
      quantity_in_order,
    });

    res.status(201).json(stock)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.patch('/increase', async (req, res) => {
  try {
    const { product_id, shop_id, quantity_on_shelf, quantity_in_order } = req.body

    if (!product_id || !shop_id || (quantity_on_shelf === undefined && quantity_in_order === undefined)) {
      return res.status(400).json({ error: 'Необходимые параметры: product_id, shop_id и количество для увеличения' })
    }

    const stock = await Stock.findOne({
      where: { product_id, shop_id }
    });

    if (!stock) {
      return res.status(404).json({ error: 'Остаток не найден' })
    }

    if (quantity_on_shelf !== undefined) stock.quantity_on_shelf += quantity_on_shelf
    if (quantity_in_order !== undefined) stock.quantity_in_order += quantity_in_order

    await stock.save()

    res.status(200).json(stock)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

router.patch('/decrease', async (req, res) => {
  try {
    const { product_id, shop_id, quantity_on_shelf, quantity_in_order } = req.body;

    if (!product_id || !shop_id || (quantity_on_shelf === undefined && quantity_in_order === undefined)) {
      return res.status(400).json({ error: 'Необходимые параметры: product_id, shop_id и количество для уменьшения' });
    }

    const stock = await Stock.findOne({
      where: { product_id, shop_id }
    });

    if (!stock) {
      return res.status(404).json({ error: 'Остаток не найден' })
    }

    if (quantity_on_shelf !== undefined) stock.quantity_on_shelf -= quantity_on_shelf
    if (quantity_in_order !== undefined) stock.quantity_in_order -= quantity_in_order

    await stock.save()

    res.status(200).json(stock)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const { plu, shop_id, min_quantity, max_quantity } = req.query

    let whereClause = {}

    if (plu) {
      const product = await Product.findOne({ where: { plu } })
      if (product) whereClause.product_id = product.id
    }

    if (shop_id) whereClause.shop_id = shop_id

    if (min_quantity || max_quantity) {
      whereClause.quantity_on_shelf = {}
      if (min_quantity) whereClause.quantity_on_shelf[Sequelize.Op.gte] = min_quantity
      if (max_quantity) whereClause.quantity_on_shelf[Sequelize.Op.lte] = max_quantity
    }

    const stocks = await Stock.findAll({
      where: whereClause
    })

    res.status(200).json(stocks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
