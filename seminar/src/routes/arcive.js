const express = require('express');
const multer = require('multer');
const RegisterModel = require('../models/registration');
const ArtModel = require('../models/registration');

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

const RegDBInst = RegDB.getInst();

const router = express.Router();

router.get('/login', async (req, res) => {
    try {
        const userID = req.query.userID;
        const userPW = req.query.userPW;
        const dbRes = await RegDBInst.CheckRegister({id: userID, pw: userPW});
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
        console.log("hhhhhh");
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const testMiddleware = (req, res, next) => {console.log("hooray!"); next();}

const upload = multer({storage: storage}).single("file");


router.post('/uploadFile', testMiddleware, upload, (req, res) => {
    console.log("Came in");
    console.log(req);
    /*
    upload(req, res, (err) => {
        if(err) {
            return res.json({success: false, err});
        }
        return res.json({
            success: true,
            image: res.req.file.path,
            fileName: res.req.file.filename,
        });
    });
    */
});
  

module.exports = router;