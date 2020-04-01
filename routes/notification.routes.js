const router = require('express').Router()
const moment = require("moment");
const User = require('../models/user.model')
const Item = require('../models/items.model')
const Notification = require('../models/notification.model')
const isLoggedIn = require('../helper/isLoggedin')
const methodOverride = require('method-override')



router.post('/buy', isLoggedIn , (req, res) => {
    let not = new Notification (req.body)
    console.log("req", req.body)
    console.log("not", not)
   not.save().then (()=> {
    User.findByIdAndUpdate(req.body.seller,{$push:{notification:not._id}}).then(()=>{
        res.redirect('/home')
    })
   })
   


})






module.exports = router