const router = require('express').Router()
const User = require('../models/user.model')
const passport = require("../helper/ppConfig");
const isLoggedIn = require('../helper/isLoggedin')
const bcrypt = require('bcrypt')
// const { check, validationResult } = require('express-validator')


router.get('/auth/signup', (req, res) => {
    res.render('auth/signup', )
})

router.post("/auth/signup", (req, res) => {
      //   console.log(req.body)
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
            // successFlash: 'Account created and you have logged in!'
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
    passport.authenticate("local", {
      successRedirect: "/home",
      failureRedirect: "/auth/signin",
    //   failureFlash: 'Invalid Username or Password',
    //   successFlash: 'You have logged in'
    })
)

router.get("/home", (req, res) => {
    // User.find().then(users => {
    //   res.render("home", {users})
    res.send('Home Page')
    // })
})

router.get('/auth/changepass', (req, res) => {
    res.render('auth/changePass')
})

router.post('/auth/changepass', isLoggedIn, (req, res) => {
    let hash = bcrypt.hashSync(req.body.password, 10);
    User.findByIdAndUpdate(req.user._id, {$set: {password: hash}}).then(() => {
        res.redirect('/auth/logout')
    })
})

router.get('/auth/logout', isLoggedIn, (req, res) => {
    req.logout()
    res.redirect('/auth/signin')
})

router.get('/views/home', (req, res) => {
    res.render('home', )
})

module.exports = router