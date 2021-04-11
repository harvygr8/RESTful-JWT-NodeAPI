const express = require('express')
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user_model')
const auth = require('../middleware/auth')


router.get('/confidential',auth,async(req,res)=>{
  jwt.verify(req.token,'Stilwater',(err,data)=>{
    if(err)
    {
      res.sendStatus(403);
    }
    else
    {
      res.json({
        message:'ACCESS GRANTED'
      })
    }
  });
});

router.post('/register',(req,res)=>{
  const plaintext_pass = req.body.password;
  const c_pass = req.body.confpassword;

  if(plaintext_pass!=c_pass)
  {
    res.json({
      message:"Passwords Not Matching!"
    });
  }
  else
  {
    bcrypt.hash(plaintext_pass,10,(err,hash)=>{
    if(err)
    {
      console.log(err);
      error:err;
      //res.send(500)
    }
    else
    {
      const put_user = new User({
        _id:mongoose.Types.ObjectId(),
        username: req.body.username,
        password: hash
      });
      //do sameusername error
      put_user.save()
      .then(nxt=>{
        res.status(201).json({
          message:"Registered Sucessfully",
          results:nxt
        });
      })
      .catch(err=>{
          res.json(err);
      });
    }
  });
  }
});

router.post('/login',(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;
  User.find({username:username})
  .exec()
  .then(user=>{
    if(user.length<1)
    {
      res.status(201).json({
        message:"User Does Not Exist",
        user:user
      });
    }
    else
    {
      bcrypt.compare(password,user[0].password,(err,result)=>{
        if(err)
        {
          res.status(404).json({
            message:"Error Authenticating User",
          });
        }
        if(result)
        {
          const token=jwt.sign(
            {
              username:user[0].username,
              userid:user[0]._id
            },
            'Stilwater',
            {
              expiresIn:"2h"
            }
          );
          res.status(200).json({
            message:"User Found",
            token:token
          });
        }
        else
        {
          res.status(404).json({
            message:"Authentication Failed",
          });
        }
      });
    }
  })
  .catch(err=>{
    res.json({
      error:err
    });
  });
});

module.exports = router
