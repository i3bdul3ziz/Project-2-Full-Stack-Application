const mongoose = require('mongoose')


const commentSchema = mongoose.Schema(
    {
        comment: {
            type:String,
        },
        item: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        }],
        user: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    }, {timestamps: true}
)

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment