const router = require('express').Router()
const moment = require("moment");
const User = require('../models/user.model')
const Item = require('../models/items.model')
const Comment = require('../models/comments.model')
const isLoggedIn = require('../helper/isLoggedin')
const methodOverride = require('method-override')
// const { check, validationResult } = require('express-validator')


router.use(methodOverride("_method"))

// Item home page (index) route
router.get('/home', (req, res) => {
    if(!req.user){
        Item.find({}, (err, item) => {
            res.render('home', {item ,moment})
        })
    } else if(req.user.userType == "isBuyer") {
        User.find(req.user._id, (err, user) => {
            Item.find({}, (err, item) => {
                res.render('buyer/index', {item , user: req.user, moment})
            })
        })
    } else {
        res.redirect('/index')
    }
})

//Create items route
router.get("/buyer/index/:id", isLoggedIn, (req, res) => {
    if(req.user.userType == "isBuyer"){
        Item.findById(req.params.id).populate('comments')
        .then(item => {
            console.log(item)
            res.render('buyer/show', {item, moment})
        })
        .catch(err => {
            console.log(err)
        })
    } else {
        req.flash('error', "You don't have th permission to access this page!")
        res.redirect('/home')
    }
})

router.post('/buyer/index/:id', isLoggedIn, (req, res) => {
    // all other code here
    if(req.user.userType == "isBuyer"){
        let comment = new Comment(req.body)
        comment
            .save()
            .then(() => {
                Item.findById(req.params.id, (err, item) => {
                    item.comments.push(comment)
                    item.save()
                })
                User.findById(req.user._id, (err, user) => {
                    user.comments.push(comment)
                    user.save()
                })
                comment.user.push(req.user._id)
                comment.item.push(req.params.id)
                comment.save()
                req.flash('success', "Comment added successfully")
                res.redirect('/buyer/index/' + req.params.id)
            })
            .catch( err => {
                console.log(err)
                return req.flash('error', "Something went wrong! can't add comment")
            })
    } else {
        req.flash('error', "You don't have th permission to access this page!")
        res.redirect('/home')
    }
})

// //Create an edit route
// router.get("/items/:id/edit", (req, res) => {
//   Item.findById(req.params.id, (err, item) => {
//     //find the items
//     res.render("items/edit", {
//       item: item //pass in found items
//     });
//   });
// });

// //Create an PUT route
// router.put("/items/:id/edit", [isLoggedIn, upload.single("image")], (req, res) => {
//   // //   console.log(request.items.id);
//   const file = req.file;
//   if (!file) {
//     const error = new Error("Please upload a file");
//     error.httpStatusCode = 400;
//     return next(error);
//   }
//   Item.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, item) => {
//     console.log(item.image)
//     res.redirect('/index')
// })
//  });

// // Delete route
// router.delete("/index/:id/delete", (req, res) => {
//     //   console.log(request.items.id);
//     //   items.find({_id: request.params.id })
//     Item.findByIdAndDelete(req.params.id).then(() => {
//     //.then(items => {
//       //{items: items} || {items}
//       res.redirect("/index");
//     });
// })



module.exports = router