const express = require('express');
const multer = require('multer');
const RegisterModel = require('../models/registration');
const ArtModel = require('../models/Art');
const path = require('path');

let user = "";

class RegDB{
    static _inst_;
    static getInst = () => {
        if( !RegDB._inst_ ) RegDB._inst_ = new RegDB();
        return RegDB._inst_;
    }

    constructor() { console.log("[Registration - DB] DB Init Completed"); }

    CheckRegister = async ( {id, pw} ) => {
        try {
            const res = await RegisterModel.findOne({ID: id, PW: pw}).limit(1)
            
            if(res === null ) {return false;} else return true;
       } catch (e) { 
           console.log(`[Registration - DB] Login Error: ${e}`);
           return false; 
        }
    }

    AddInitial = async ({id, pw}) => {
        const newItem = new RegisterModel({ID: id, PW: pw});
        const res = await newItem.save();
    }


}

class ArtDB{

    static _inst_;
    static getInst = () => {
        if ( !ArtDB._inst_ ) ArtDB._inst_ = new ArtDB();
        return ArtDB._inst_;
    }

    ArtInsert = async ({path, fieldName, title, content}) => {
        try{
            const newItem = new ArtModel({Author: user, Path: path, FieldName: fieldName, Title: title, Content: content});
            const res = await newItem.save();
            //console.log("[Art-DB] Insert Complete" + newItem);
            return true;
        } catch (e) {
            console.log(`[Art-DB] Insert Error: ${e}`);
            return false;
        }
    }

    ArtDelete = async ({id}) => {
        try{   
            const res = await ArtModel.deleteMany({ID: id});
            console.log("[Art-DB] Delete Complete");
            return true;
        } catch (e) {
            console.log(`[Art-DB] Delete Error: ${e}`);
            return false;
        }
    }

    SelectItems = async ({Author}) => {
        try{
            const res = await ArtModel.find({Author: Author});
            return {data: res};
        } catch (e) {

        }
    }
}

const ArtDBInst = ArtDB.getInst();
const RegDBInst = RegDB.getInst();

const router = express.Router();

router.get('/login', async (req, res) => {
    try {
        const userID = req.query.userID;
        const userPW = req.query.userPW;
        const dbRes = await RegDBInst.CheckRegister({id: userID, pw: userPW});
        user = userID;
        if (dbRes) return res.status(200).json(true);
        else {return res.status(500).json(false);}
    } catch (e) {
        return res.status(500).json(false);
    }
});

////////Files////////

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploadedFiles/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({storage: storage}).single("file");

//ArtDBInst.ArtDelete({id: "Miro"}); //ONLY FOR DB CLEANUP PURPOSE!!! AFTER UNANNOTATING, DELETE THE FILES IN /uploadedFiles/ !!!!

router.post('/uploadFile', upload, async (req, res) => {
    //console.log(req.body.id);
    if(req.body.IsUpdate === "false" ){
    if(user !== "" && typeof(req.file) !== "undefined") {
    console.log(`[Upload] Uploded File name, by user: ${req.file.filename} by ${user}`);
    console.log(`[Upload] File Field Name: ${req.file.filename}`);
    console.log(`[Upload] File path: ${req.file.path}`);
    const DBRes = await ArtDBInst.ArtInsert({path: req.file.path, fieldName: req.file.filename, title: req.body.Title, content: req.body.Content});
        }
    }
    else {console.log("Boo! I came here to update!" + req.body.IsUpdate + "!!");
    console.log("Given Update: " + req.body.Title + "  and   " + req.body.Content);
    console.log(req.file.filename);
    }//Find _id === req.body.IsUpdate and update the path and fieldName with the given one. 
})
 
router.get('/ArciveLoad', async (req, res) => {
    try{ 
        const author = req.query.author;
        const {data} = await ArtDBInst.SelectItems({Author: author});
        return res.status(200).json(data);
    } catch (e) { 
 
    } 
})

router.get('/Download', async (req, res) => {
    const link = req.query.link;
    console.log("[Arcive-DB] Server sent " + link + " To the Client, " + user);
    try {res.sendFile(path.resolve(__dirname, `../../uploadedFiles/${link}`));} catch (e) {
        return res.stauts(500).json({error: e});
    }
})

module.exports = router;