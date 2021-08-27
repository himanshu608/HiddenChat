const express = require('express');
const router = express.Router();
var mongo = require(__dirname+'/mongo.js');
var Cred = mongo.cred;
router.get('/:page',(req, res) => {
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
    }else if(pg === 'signup'){
        res.render('signup')
    }else if(pg === 'error'){
        res.render('error')
    }
    
    });
    
    router.post('/login',(req, res) => {
    
    Cred.findOne({email:req.body.email}).then((found) => {
        if(found){
        if(found.password === req.body.passwordd){
            res.redirect('/chat');
    
        }else{
            res.send("Incorrect password");
        }}else{
            return res.render('error')
        }
    }).catch((err) => {
        console.log(err);
    })
    // console.log(req.body.email,req.body.passwordd);
    // res.redirect('/chat');
    });
    router.post('/signup',(req, res) => {
        
        Cred.find({username: req.body.username,email: req.body.email}).then((found) => {
            if(found.length!=0){
                return res.redirect("/error");
            }
            else{
    
                const newUsr = new Cred({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.passwordd
                })
                newUsr.save((err)=>{
                    if(err) console.log(err);
                    else return res.redirect('/login');
                })
            }
        }).catch((err) => {
            console.log(err);
        })
        
        
    })

    module.exports = router;