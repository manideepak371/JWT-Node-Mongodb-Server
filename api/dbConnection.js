module.exports=function(databasename){
    var mongodb=require('mongodb').MongoClient
    return new Promise((resolve,reject)=>{
        mongodb.connect("mongodb://localhost:27017"+"/"+databasename,(err,result)=>{
        if(err){
            console.log(err)
            reject(err)
        }
        var db=result.db(databasename)
        resolve(db)
        })
    })
}
