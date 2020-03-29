const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const salt = 10

const userSchema = mongoose.Schema(
    {
        name: {
            type:String,
            required: true,
        },
        phoneNumber:{
            type: String,
            required: true,
        },
        address:{
            city: String,
            street: String,
        },
        password: {
            type: String,
            required: true,
        },
        // isBuyer:{
        //     type:Boolean
        // },
        // isSeller:{
        //     type:Boolean
        // }
        userType: { 
            type: String,
            enum: ['isBuyer', 'isSeller']
        }
    }, {timestamp: true}
)

userSchema.pre("save", function(next) {
    let user = this;
    if (!user.isModified("password")) {
      return next();
    }
  
    let hash = bcrypt.hashSync(user.password, salt);
    //   console.log(hash);
    user.password = hash;
    next();
  })

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User