const express = require('express')
const userRouter =require('./routers/userRouters')
require('./db/mongoose')
const path = require('path')
const fs = require('fs')
const app = express()
const Port = process.env.PORT
const auth = require('./middleware/auth')
const schema = require('./models/user')
const User =schema["radiographer"]
const jwt = require('jsonwebtoken')

const publicPath = path.join(__dirname,'../public')
const viewPath = path.join(__dirname,'../templates/views')


app.set('view engine','hbs')
app.set('views',viewPath)
app.use(express.static(publicPath))


app.use(express.json())
app.use(userRouter)

//display home page
app.get('/',(req,res)=>{
    res.render('HOMEPAGE')
})

//display radiographer login
app.get('/radiographer/login',(req,res)=>{
    res.render('LOGIN_RADIOGRAPHER')
})

// display radiologist login
app.get('/radiologist/login',(req,res)=>{
    res.render('LOGIN_RADIOTHERAPY')
})

//display radiographer create account
app.get('/radiographer/createAccount',(req,res)=>{
    res.render('REGISTER RADIOGRAPHY')
})

//display radiographer profile
app.get('/radiographer/Account',(req,res)=>{
        res.render('RADIOGRAPHER_PROFILE')
})

//PATIEN RECORDS RADIOGRAPHY -PROVIDE-auth
app.get('/radiographer/Account/patient',(req,res)=>{
    res.render('PATIENT RECORDS_Radiography')
})

app.get('/radiographer/Account/patient/newPatient',(req,res)=>{
    res.render('PATIENT UPLOAD_Radiography')
})

//display radiologist create account
app.get('/radiologist/createAccount',(req,res)=>{
    res.render('REGISTER RADIOTHERAPHY')
})

//display radiologist profile
app.get('/radiologist/Account',(req,res)=>{
    res.render('RADIOTHERAPIST_PROFILE')
})


app.get('/radiologist/Account/patient/uploadPatient',(req,res)=>{
  
    res.render('PATIENT UPLOAD_Radiotheraphy')
})

app.get('/radiologist/Account/patient',(req,res)=>{
    res.render('PATIENT RECORDS_Radiotheraphy')
})

app.get('/signin',(req,res)=>{
    res.render('signin')
})



app.listen(Port,()=>{
    console.log(`Server is up and running on ${Port}`)
})
