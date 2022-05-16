const express = require('express');
const RegisterModel = require('../models/registration');

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

const initialize = async ({id, pw}) => {
    const lost = await RegDBInst.CheckRegister({id: id, pw: pw});
    if(!lost) RegDBInst.AddInitial({id: id, pw: pw});
}

initialize({id: "Foo", pw: "bar"});
initialize({id: "macintosh", pw:"bar"});

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

module.exports = router;