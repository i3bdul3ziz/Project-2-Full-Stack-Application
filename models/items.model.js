const mongoose = require('mongoose')


const itemsSchema = mongoose.Schema(
    {
        name: {
            type:String,
            required: true,
        },
        descrption:{
            type: String,
            required: true,
        },
        image:{
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        user: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    }, {timestamp: true}
)

const Item = mongoose.model('Item', itemsSchema)
module.exports = Item