const jwt=require('jsonwebtoken')
var db=null
const MongoClient=require('mongodb').MongoClient
MongoClient.connect('mongodb://localhost:27017',(err,result)=>{
    if(err){
        console.log(err)
    }
    db=result.db('college')
})

function getCookie(req,cookie){
    var cookieValue=''
    if(req.headers['cookie'] !== undefined){
        var a=req.headers['cookie'].split('; ')
        for(var i=0;i<a.length;i++){
            var str=a[i].split('=')
            if(str[0] === cookie){
                cookieValue=str[1]
                break        
            }
        }
    }
    return cookieValue
}

const Authenticate=async (req,res,next)=>{
    const refreshToken=getCookie(req,'refresh-token')
    const accessToken=getCookie(req,'access-token')
    if(accessToken === ''){
        if(refreshToken === ''){        
            console.log("refresh token & access token are empty")
            res.status(200).json({success:false})
            return
        }
        if(refreshToken !== ''){
            const refreshTokenVerify=jwt.verify(refreshToken,process.env.TOKEN_REFRESH_KEY)
            const loggedInVerify=await db.collection('roles').findOne({name:refreshTokenVerify.name})
            if(refreshTokenVerify.name === loggedInVerify.name){
                console.log("refresh token not empty but access token is empty")
                const newAccessToken=jwt.sign({name:loggedInVerify.name},process.env.TOKEN_SECRET_KEY)
                res.cookie('access-token',newAccessToken,{httpOnly:true,secure:true,sameSite:'none',maxAge:10000})
                next()
            }
        }
    }
    if(accessToken !== '' && refreshToken !== ''){
        const refreshTokenVerify=jwt.verify(refreshToken,process.env.TOKEN_REFRESH_KEY)
        const accessTokenVerify=jwt.verify(accessToken,process.env.TOKEN_SECRET_KEY)
        const loggedInVerify=await db.collection('roles').findOne({name:refreshTokenVerify.name})
        if((accessTokenVerify.name === refreshTokenVerify.name) && (accessTokenVerify.name === loggedInVerify.name)){
            console.log('authorized...')
            next()
        }
    }
}

module.exports=Authenticate