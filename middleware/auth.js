const jwt = require('jsonwebtoken')

module.exports=(req,res,next)=>{
  const bearer_header=req.headers['authorization'];
  if(typeof bearer_header!='undefined')
  {
    const bearer_arr=bearer_header.split(' ');
    const token = bearer_arr[1];
    req.token = token;
    next();
  }
  else
  {
    res.sendStatus(403);
  }
}
