const express = require("express")
const filecountroler = require("../controller/fileContolr")


const fileroute=express.Router()

fileroute.post("/api/file",filecountroler.uploadeFile)

fileroute.get("/file/:fileId",filecountroler.generateSharableLink)

fileroute.get("/file/download/:fileId",filecountroler.downloadLink)

fileroute.post("/api/file/send",filecountroler.sendMail)

module.exports=fileroute;