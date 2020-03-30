const router = require('express').Router()
const User = require('../models/user.model')
const Item = require('../models/items.model')
const isLoggedIn = require('../helper/isLoggedin')
const formidable = require('formidable')
let fs = require('fs')
const methodOverride = require('method-override')
// const { check, validationResult } = require('express-validator')

router.use(methodOverride("_method"))

// router.get('/index', isLoggedIn, (req, res) => {
//     User.find(req.user._id, (item) => {
//         res.render('/item/index', {item})
//     })
// })

router.get("/create", isLoggedIn, (req, res) => {
      if (req.user.userType === "isSeller") {
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
    console.log(req.body)
    var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var oldpath = files.image.path
    var imagPath = '/images/' + files.image.name; //display image in our index.ejs file
    var uploadpath = './public/images/' + files.image.name;
    fs.rename(oldpath, uploadpath, function (err) {
      if (err) throw err;
      else {
        fields.image = imagPath;
        if (req.user.userType === "isSeller") {
            let item = new Item(req.body)
            item
                .save()
                .then(() => {
                    User.findById(req.user, (err, user) => {
                        user.items.push(item)
                        user.save()
                    })
                    item.user.push(req.user)
                    item.save()
                    res.redirect('/home')
                })
                .catch( err => {
                    console.log(err)
                    res.send('Error!!!!!!')
                })
        } else {
            res.redirect('/home')
        }
      }
    })
  })
})


module.exports = router