var http=require('http')
var app=require('./server')
var PORT=process.env.PORT || 9000

http.createServer(app).listen(PORT)