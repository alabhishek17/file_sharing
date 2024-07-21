const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    originalName:{
        type:String,
        required:true,
    },
    newName:{
        type:String,
        required:true,
    },
    size:{
        type:Number,
        required:true,
    },
})

const fileModule = mongoose.model("file",fileSchema)  // collection name is file

module.exports=fileModule