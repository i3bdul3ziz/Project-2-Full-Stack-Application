require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')
const authRoutes = require('./routes/auth.routes')
const itemRoutes = require('./routes/items.routes')
const buyerRoutes = require('./routes/buyer.routes')
<<<<<<< HEAD
const session = require("express-session");
//const flash = require('connect-flash')
let passport = require("./helper/ppConfig");
=======
const session = require("express-session")
const flash = require('connect-flash')
let passport = require("./helper/ppConfig")
>>>>>>> 6301544111752579231e161c15b378d8652ffbf6

const app = express()

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, () => {
    console.log('mongo is connected')
}, err => {
    console.log(err)
})

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
 
//app.use(flash())
app.set('view engine', 'ejs')
app.use(expressLayouts)

// ----must be before passport
app.use(
    session({
      secret: process.env.SECRET,
      saveUninitialized: true,
      resave: false
      // cookie: { maxAge: 360000 } //duration of session
    })
)

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


app.use(function(req, res, next) {
    res.locals.alerts = req.flash()
    res.locals.currentUser = req.user
    next()
})

app.use(authRoutes)
app.use(itemRoutes)
app.use(buyerRoutes)

app.get("/home", (req, res) => {
    res.render('home')
})

app.get('*', (req, res) => {
    res.send('does not found')
})



  
  
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))