var express=require('express')
var Router=express.Router()
var {body,validationResult, check}=require('express-validator')
const Authenticate = require('./authenticate')
const Controller=require('./controller')

// var headers={
//     setHeaders:(req,res,next)=>{
//         res.header('Access-Control-Allow-Origin','http://localhost:3000')
//         res.header('Access-Control-Allow-Methods','GET,POST'),
//         res.header('Access-Control-Allow-Credentials',true)
//         res.header('Access-Control-Allow-Headers','Content-Type,Origin,Accept')
//         next()
//     }
// }

Router.post('/login',
    check('username').isLength({min:3}).isString(),
    check('role').isString().isIn(['Student','Placements','Accounts','Head']),
    (req,res,next)=>{
        // headers.setHeaders(req,res,next)
        var err=validationResult(req)
        if(!err.isEmpty()){
            res.json({errors:err.array()})
            return
        }
        next()
    },
    Controller.Login) 

Router.post('/getProfile',Authenticate,Controller.Profile)
Router.get('/accounts',Authenticate,Controller.Accounts)
Router.get('/placements',Authenticate,Controller.Placements)
Router.get('/head',Authenticate,Controller.Head)
Router.post('/getRole',Authenticate,Controller.Role)
//

module.exports=Router