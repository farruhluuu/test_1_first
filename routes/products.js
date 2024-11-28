const express = require('express')
const Product = require('../models/product')
const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { plu, name } = req.body

    if (!plu || !name) {
      return res.status(400).json({ error: 'PLU и Name обязательны' })
    }

    const product = await Product.create({
      plu,
      name
    })

    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

router.get('/', async (req, res) => {
  try {
    const { plu, name } = req.query

    let whereClause = {}

    if (plu) whereClause.plu = plu
    if (name) whereClause.name = { [Sequelize.Op.iLike]: `%${name}%` }

    const products = await Product.findAll({
      where: whereClause
    });

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

module.exports = router
