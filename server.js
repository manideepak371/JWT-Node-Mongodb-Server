var express=require('express')
var app=express()
var cors=require('cors')
var Router=require('./api/router')
require('dotenv').config()
const cookieParser=require('cookie-parser')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))

app.use('/welcome',(req,res)=>{
    res.status(200).end("welcome, server created successfully")
})

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','http://localhost:3000')
    res.header('Access-Control-Allow-Methods','GET,POST'),
    res.header('Access-Control-Allow-Credentials',true)
    res.header('Access-Control-Allow-Headers','Content-Type,Origin,Accept')
    next()
})

app.use('/api',Router)
 

module.exports=app