const express=require("express");

const mongoose = require("mongoose")

const filerouter=require("./route/fileRoute")
const app=express();

//dtabase connection
mongoose
.connect("mongodb://localhost:27017/filesharing_app")   // databaseCompose localhost:27017
.then(()=>console.log("DATABASE connected successfully"))
.catch((err)=>console.log("error in connecting database",err))

app.use(express.json())
app.use("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})
app.use(filerouter)
app.listen(7000,()=>console.log(`servrer is connected with port 7000`))