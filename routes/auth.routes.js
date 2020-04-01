const router = require('express').Router()
const User = require('../models/user.model')
const passport = require("../helper/ppConfig");
const isLoggedIn = require('../helper/isLoggedin')
const { check, validationResult } = require('express-validator');


const bcrypt = require('bcrypt')
// const { check, validationResult } = require('express-validator')


router.get('/auth/signup', (req, res) => {
    res.render('auth/signup', )
})

router.post("/auth/signup", 
  [ 
  check('name').isLength({min:2}),
  check('phoneNumber').isLength({min:10,max:10}),
  check('address.city').isLength({min:4}),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 })
], 
(req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  //print error msg if the user enter invalid info
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    req.flash("autherror", errors.errors);
    return res.redirect("/auth/signup");
  }
      let user = new User(req.body)
      if (req.body.userType.value === "isBuyer") {
        //if checked, req.body.userType is set to 'on'
        req.body.userType = "isBuyer";
      } else {
        //if not checked, req.body.userType is undefined
        req.body.userType = 'isSeller';
      }
      user
        .save()
        .then(() => {
          passport.authenticate("local", {
            successRedirect: "/home",
            successFlash: 'Account created successfully!'
          })(req, res)
        })
        .catch(err => {
          console.log(err)
          res.send("error!!!")
        })
})
router.get('/auth/signin', (req, res) => {
    res.render('auth/signin')
})

router.post(
    "/auth/signin",
    passport.authenticate("local", 
    {
      successRedirect: "/home",
      failureRedirect: "/auth/signin",
      failureFlash: 'Invalid Username or Password',
      successFlash: 'You have logged in'
    }
    )
)

router.get('/auth/changepass', isLoggedIn, (req, res) => {
    res.render('auth/changePass')
})

router.post('/auth/changepass', isLoggedIn, (req, res) => {
    let hash = bcrypt.hashSync(req.body.password, 10);
    User.findByIdAndUpdate(req.user._id, {$set: {password: hash}}).then(() => {
      req.logout()
      req.flash('success', 'Password changed successfully')
      res.redirect('/auth/signin')
    })
})

router.get('/auth/logout', isLoggedIn, (req, res) => {
    req.logout()
    req.flash('success', 'Successfully logged out')
    res.redirect('/home')
})

module.exports = router