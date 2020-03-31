const router = require('express').Router()
const moment = require("moment");
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

// Item home page (index) route
router.get('/index', isLoggedIn, (req, res) => {
  if(req.user.userType === "isSeller"){
    User.findById(req.user._id).populate('items')
    .then(user => {
      let items = user.items
        res.render('items/index', {user, items, moment})
        
    })
    .catch(err => {
        console.log(err)
    })
  } else {
    res.redirect('/home')
  }
})

//Create items route
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

//Create an edit route
router.get("/items/:id/edit", isLoggedIn,(req, res) => {
  if(req.user.userType == "isSeller"){
    Item.findById(req.params.id, (err, item) => {
      //find the items
      res.render("items/edit", {
        item: item //pass in found items
      });
    });
  }else {
    res.redirect('/home')
  }
});

//Create an PUT route
router.put("/items/:id/edit", [isLoggedIn, upload.single("image")], (req, res) => {
  // //   console.log(request.items.id);
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  if(req.user.userType == "isSeller"){
    Item.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, item) => {
      console.log(item.image)
      res.redirect('/index')
    }) 
  } else {
    res.redirect('/home')
  }
});

// Delete route
router.delete("/index/:id/delete", isLoggedIn,(req, res) => {
  if(req.user.userType == "isSeller"){
    Item.findByIdAndDelete(req.params.id).then(() => {
      res.redirect("/index");
    });
  } else {
    res.redirect('/home')
  }
})

module.exports = router