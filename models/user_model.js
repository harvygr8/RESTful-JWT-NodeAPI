const mongoose = require('mongoose')
const url='mongodb://localhost/UserDB'
mongoose.connect(url,{ useNewUrlParser: true})
const db = mongoose.connection

db.on('error', err => {
    console.log(err)
})

db.on('open', () => {
    console.log('Connected to database')
})

const userSchema= new mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
  username:{type:String,required:true,unique:true},
  password:{type:String,required:true}
});

const user=mongoose.model('user',userSchema);
module.exports=user
