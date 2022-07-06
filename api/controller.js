var jwt=require('jsonwebtoken')
const { MongoClient } = require('mongodb')

var db=null

MongoClient.connect("mongodb://localhost:27017",async (err,result)=>{
    if(err){
        console.log(err)
    }
    console.log('connected to db')
    db=result.db('college')
})

exports.Login=async (req,res,next)=>{
    const {username,role}=req.body
    const exists=await db.collection('roles').findOne({name:username,role:role},{_id:0})
    if(exists !== null && exists !== {} ){
        const accessToken=jwt.sign({name:username},process.env.TOKEN_SECRET_KEY)
        const refreshToken=jwt.sign({name:username},process.env.TOKEN_REFRESH_KEY)
        res.cookie('access-token',accessToken,{maxAge:10000,httpOnly:true,secure:true})
        res.cookie('refresh-token',refreshToken,{maxAge:20000,sameSite:'none',httpOnly:true,secure:true})
        /*
            need cron job to update db records where loggedIn is already true for every 30 mins. More effective way.
            await db.collection('roles').updateOne({name:username,role:role},{$set:{loggedIn:true}})
        */
        if(exists.role === 'Student'){
            const result=await db.collection('profiles').findOne({name:username},{_id:0})
            console.log(result)
            if(result !== null || result !== {}){
                res.status(200).json({success:true})
                return
            }
        }
        else{
            res.status(200).json({success:true})
            return
        }
    }
    else{
        res.json({success:false})
    }
}

exports.Profile=async (req,res,next)=>{
    const {username}=req.body
    const result=await db.collection('profiles').findOne({name:username},{_id:0,due:0})
    res.status(200).json({success:true,result})
}

exports.Accounts=async (req,res,next)=>{
    const result=await db.collection('profiles').find({},{_id:0,placements:0}).toArray()
    res.status(200).json({success:true,result})
}

exports.Placements=async (req,res,next)=>{
    const result=await db.collection('profiles').find({},{_id:0,due:0}).toArray()
    res.status(200).json({success:true,result})
}

exports.Head=async (req,res,next)=>{
    const result=await db.collection('profiles').find({},{_id:0}).toArray()
    res.status(200).json({success:true,result})
}

exports.Role=async (req,res,next)=>{
    const {username}=req.body
    const result=await db.collection('roles').findOne({name:username},{_id:0})
    console.log(result)
    res.status(200).json({success:true,result})
}