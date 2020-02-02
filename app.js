const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('./src/db/mongoose')   //connect to mongoDB
require('dotenv').config()

//import routers
const authRouter = require('./src/routers/auth')
const userRouter = require('./src/routers/user')
const categoryRouter = require('./src/routers/category')
const productRouter = require('./src/routers/product')
const braintreeRouter = require('./src/routers/braintree')
const orderRouter = require('./src/routers/order')

//set up express server
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())

//set up individual router
app.use('/api',authRouter)
app.use('/api',userRouter)
app.use('/api',categoryRouter)
app.use('/api',productRouter)
app.use('/api',braintreeRouter)
app.use('/api',orderRouter)



const port = process.env.PORT 

app.listen(port, () => {
    console.log(`This app is running on port ${port}`)
})