const express = require('express')
const mongoose = require('mongoose')
const app = express()
const main_router=require('./routers/main_router')


app.use(express.json())
app.use('/api',main_router)

app.listen(5000,()=>{
  console.log('Server started')
})
