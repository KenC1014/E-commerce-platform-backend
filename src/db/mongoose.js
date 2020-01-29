const mongoose = require('mongoose')

//connect to db
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log('mongoDB Connected!'))

