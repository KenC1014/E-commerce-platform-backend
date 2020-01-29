const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 56,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error('Email is invalid')
        }
    }
},
  password: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 32,
    trim:true,
    validate(value){
        if(value.toLowerCase().includes('password')){
            throw new Error('invalid password')
        }
    }
},
  about: {
    type: String,
    trim: true,
  },
  role: {
      type: String,
      default: 'customer'
  },
  history: {
      type: Array,
      default: []
  }
}, {timestamps: true})


userSchema.statics.findByCredentials = async (email, password) => {
    
    const user = await User.findOne({email:email})
   
    if(!user){
        throw new Error('unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('unable to login')
    }

    return user
}

//convert to hashed password before saving
userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password  = await bcrypt.hash(this.password, 8)  //hashed the user's password
    }
    next()
})

//delete all its tasks when a user is removed
userSchema.pre('remove', async function(next){
    await Task.deleteMany({owner: this._id})
    next()
})

const User = mongoose.model ('User', userSchema)
module.exports = User