
const path = require("path");
const multer = require("multer")
const { v4: uuidv4 } = require('uuid');
const nodemailer=require("nodemailer")
const dotenv=require("dotenv")


const fileModule = require("../module/fileModule");  //save data into database
// const { error, info } = require("console");

dotenv.config()

const transport = nodemailer.createTransport({
    host:"localhost",
    port:"1025",
    secure:false,
})
// console.log(uuidv4() + ".pdf .jpg .js");
//where to store /save file
//file new name to save
const uploadfilepath="uploads";

const storage=multer.diskStorage({
    destination:(req,file,cd) => cd(null,uploadfilepath),
    //save file with original name
     filename:(req,file,cd)=>{
        // console.log(file.originalname);
        const filename = uuidv4() + path.extname(file.originalname)
       cd(null,filename);
    },

})


//it includes filepatha file name and where to upload
const upload = multer({ 
     storage:storage,
    //  limits:{
    //     fileSize: 1024
    //  }
}).single("dummyes");

const uploadeFile=(req,res)=>{
    upload(req,res,async()=>{
        console.log(req.file);
       
        const fileData ={
            originalName:req.file.originalname,
            newName:req.file.filename,
            size:req.file.size
        };
     const newltInsertedfile =   await fileModule.create(fileData)
        console.log(req.body);
        console.log(newltInsertedfile);
        res.json({
        sucess:true,
        message:"file upload successfully",
        fileId:newltInsertedfile._id
    })
    })
    
}


const generateSharableLink = async(req,res)=>{
    const sharableLink= `/file/download/${req.params.fileId}`
    console.log(sharableLink);
    const fileData= await fileModule.findById(req.params.fileId);
    if(!fileData){
        return res.status(400).json({
            success:false,
            message:"inavild file id"
        })
    }
    res.json({
        success:true,
        message:"generate shareable link",
        result:sharableLink,
    })
}

const downloadLink = async(req,res)=>{
    const fileId=req.params.fileId;
    const fileData=await fileModule.findById(fileId)
    if(!fileData){
        return res.status(400).end("invalid url");
    }
    console.log(fileData);
    const path=`uploads/${fileData.newName}`;
    res.download(path,fileData.originalName); // original name 
    // res.json({
    //     success:true,
    //     message:"download the file"
    // });
}


const sendMail = async (req,res)=>{
    console.log(req.body);
    const fileId=req.body.fileId;
    const sharableLink= `${process.env.BASE_URL}/file/download/${fileId}`
    //send mail

    const emailData={
        to:req.body.email,  //from json body
        from:"do-not-reply@filesharing.com",
        subject:"new mail",
        html:`
        <p>
        your friend as shared a link
        <a href="${sharableLink}">click</a>
        </p>
        `,
    }
    transport.sendMail(emailData,(error,info)=>{
        if(error){
            console.log(error);
            return res.json({
                success:false,
                message:"unable to send mail",
                error:error,
            })
        }
        console.log(info);
        res.json({
            success:true,
            message:"senf mail successfully",
        })
    });
   
}
const filecountroler={
    uploadeFile,
    generateSharableLink,
    downloadLink,
    sendMail,
}

module.exports=filecountroler