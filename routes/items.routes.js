const router = require('express').Router()
const User = require('../models/user.model')
const Item = require('../models/items.model')
const isLoggedIn = require('../helper/isLoggedin')
// const { check, validationResult } = require('express-validator')


router.get('/index', isLoggedIn, (req, res) => {
    User.find(req.user._id, (item) => {
        res.render('/item/index', {item})
    })
})

router.get("/create", isLoggedIn, (req, res) => {
      if (currentUser.userType === "isSeller") {
        User.find().populate('user')
        .then(user => {
            res.render('items/create', {user})
        })
        .catch(err => {
            console.log(err)
        })
      } else {
        res.redirect('/home')
      }
})

router.post('/create', isLoggedIn, (req, res) => {
    // console.log(req.body)
    if (currentUser.userType === "isSeller") {
        let item = new Item(req.body)
        item
            .save()
            .then(() => {
                User.findById(user, (err, user) => {
                    user.items.push(item)
                    user.save()
                })
                res.redirect('/home')
            })
            .catch( err => {
                console.log(err)
                res.send('Error!!!!!!')
            })
    } else {
        res.redirect('/home')
      }
})


module.exports = router