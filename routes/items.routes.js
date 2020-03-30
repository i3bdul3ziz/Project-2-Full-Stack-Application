const router = require('express').Router()
const User = require('../models/user.model')
const Item = require('../models/items.model')
const isLoggedIn = require('../helper/isLoggedin')
const methodOverride = require('method-override')
// const { check, validationResult } = require('express-validator')
const multer = require("multer");
const fs = require("fs");
const path = require("path");
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/images");
  },
  filename: function(req, file, cb) {
    let fileExtension = path.extname(file.originalname).split(".")[1];
    cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension);
  }
});
var upload = multer({ storage: storage });

router.use(methodOverride("_method"))

router.get('/index', isLoggedIn, (req, res) => {
    User.find(req.user._id, (err, user) => {
        Item.find({}, (err, item) => {
            res.render('items/index', {item , user: req.user})
        })
    })
})

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

router.post('/create', [isLoggedIn, upload.single("image")], (req, res) => {
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    // all other code here
        if (req.user.userType === "isSeller") {
            let item = new Item(req.body)
            item.image = "/images/" + file.filename;
            item
                .save()
                .then(() => {
                    User.findById(req.user, (err, user) => {
                        user.items.push(item)
                        user.save()
                    })
                    item.user.push(req.user)
                    item.save()
                    res.redirect('/index')
                })
                .catch( err => {
                    console.log(err)
                    res.send('Error!!!!!!')
                })
        } else {
            res.redirect('/home')
    }
})
router.delete("/index/:id/delete", (req, res) => {
  //   console.log(request.items.id);
  //   items.find({_id: request.params.id })
  Item.findByIdAndDelete(req.params.id).then(() => {
  //.then(items => {
    //{items: items} || {items}
    res.redirect("/");
  });
})



module.exports = router