const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('./db/mongoose')   //connect to mongoDB


//import routers
const authRouter = require('./routers/auth')
const userRouter = require('./routers/user')
const categoryRouter = require('./routers/category')
const productRouter = require('./routers/product')
const braintreeRouter = require('./routers/braintree')
const orderRouter = require('./routers/order')

//seeting up express server
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