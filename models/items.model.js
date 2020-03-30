const mongoose = require('mongoose')


const itemsSchema = mongoose.Schema(
    {
        name: {
            type:String,
        },
        descrption:{
            type: String,
        },
        image:{
            type: String,
        },
        price: {
            type: Number,
        },
        user: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    }, {timestamp: true}
)

const Item = mongoose.model('Item', itemsSchema)
module.exports = Item