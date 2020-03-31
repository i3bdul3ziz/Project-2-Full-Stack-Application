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
        comments: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }],
        user: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    }, {timestamps: true}
)

const Item = mongoose.model('Item', itemsSchema)
module.exports = Item