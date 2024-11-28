const express = require('express')
const bodyParser = require('body-parser')
const productRoutes = require('./routes/products')
const stockRoutes = require('./routes/stocks')
const sequelize = require('./db/db')

const app = express()
app.use(bodyParser.json())

app.use('/products', productRoutes)
app.use('/stocks', stockRoutes)

const PORT = 3000

sequelize.sync({ force: false }).then(() => {
    console.log('Database connected')
    app.listen(PORT, () => {
        console.log(`Stock service is running on port ${PORT}`)
    })
})
