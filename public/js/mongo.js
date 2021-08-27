
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

const userCredSchema =  mongoose.Schema({
    username:{type: 'string', required:true},
    email:{type: 'string', required:true},
    password:{type: 'string', required:true}
})
mongoose.plugin(encrypt,{secret:process.env.SECRET ,encryptedFields:['message']});

const Msg = mongoose.model('messages',Schema);
const Cred = mongoose.model('userCred',userCredSchema);

module.exports = {
    msg: Msg,
    cred: Cred
}
////////////////////////////////////////////////////////////////////   database configuration            //////////////////////////////////////////////////////////////////////