const mongoose = require('mongoose')


const notificationSchema = mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
           },
           buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
           },
           status:{
            type: Boolean,
            default: false
           },
    }, {timestamps: true}
)

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification