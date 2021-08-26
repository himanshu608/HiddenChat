const env = require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bp  = require('body-parser');
const app = express();

const httpserver = require('http').createServer(app);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bp.urlencoded({extended:true}));

////////////////////////////////////////////////////////////////////   database configuration            //////////////////////////////////////////////////////////////////////
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const dbUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@nodedb.tnd4e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('connected to db');
}).catch(err =>{
    console.log('not connected to db');
});

const Schema = mongoose.Schema({
    user:{
        type: 'string',
        required: true
    },
    message:{
        type: 'string',
        required: true
    }
})

mongoose.plugin(encrypt,{secret:process.env.SECRET ,encryptedFields:['message']});

const Msg = mongoose.model('messages',Schema);
////////////////////////////////////////////////////////////////////   database configuration            //////////////////////////////////////////////////////////////////////
app.get('/',(req, res) => {
    
        res.render('index');
    
});
app.get('/:page',(req, res) => {
    const pg = req.params.page;
    if(pg === 'home'){
        res.render('index');
    }else if(pg === 'about'){
        res.render('about');
    }else if(pg === 'contact'){
        res.render('contact');
    }else if(pg === 'login'){
        res.render('login')
    }else if(pg === 'chat'){
        res.render('chat')
    }

});

httpserver.listen(3000,() => {
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
    socket.on('joined',(usr)=>{
        socket.broadcast.emit('joinedusr',usr);
    })
})