const mongoose = require('mongoose')
require('dotenv').config()

//connect to db
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log('mongoDB Connected!'))

