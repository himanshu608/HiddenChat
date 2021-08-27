const env = require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bp  = require('body-parser');
const app = express();
const httpserver = require('http').createServer(app);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bp.urlencoded({extended:true}));
var mongo = require(__dirname+'/public/js/mongo.js');
var Msg = mongo.msg;
app.get('/',(req, res) => {
    
    res.render('index');

});
const routes = require(__dirname+'/public/js/routes.js')
app.use(routes);
httpserver.listen(process.env.PORT || 3000,() => {
    console.log('listening on port 3000 . ..... . . .');
})
var io  = require('socket.io')(httpserver);

io.on('connection',(socket)=>{
    // console.log('connecte....');


    Msg.find().then((messages)=>{
        socket.emit('messages-db',messages);
    }).catch((error)=>{
        console.log(error);
    })
    socket.on('messagee',(msg,usr)=>{
        const msgg = new Msg({user:usr,message:msg});
        msgg.save().then(()=>{
           console.log('messages saved to db ');
        }).catch((err)=>{
           console.log(err);
        });
        socket.broadcast.emit('sentt',msg,usr);
    })
    
})