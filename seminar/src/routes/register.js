const express = require('express');
const RegisterModel = require('../models/registration');
const router = require('./arcive');

class RegDB{
    static _inst_;
    static getInst = () => {
        if( !RegDB._inst_ ) RegDB._inst_ = new RegDB();
        return RegDB._inst_;
    }

    constructor() { console.log("[Registration - DB] DB Init Completed"); }

    CheckRegister = async ( {id} ) => {
        try {
            const res = await RegisterModel.findOne({ID: id}).limit(1)
            if(res === null ) {return false;} else return true;
       } catch (e) { 
           console.log(`[Registration - DB] Searching Error: ${e}`);
           return false; 
        }
    }

    CheckLogin = async ( {id, pw} ) => {
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

    DeleteRegister = async ( {id, pw} ) => {
        try{
            const res = await RegisterModel.deleteOne({ID: id, PW: pw});
            return true;
        } catch {
            console.log(`[Registration - DB] Deleting Error: ${e}`);
           return false; 
        }
    }

}

const RegDBInst = RegDB.getInst();

router.get('/searchID', async (req, res) => {
    try {
        const userID = req.query.userID;
        const dbRes = await RegDBInst.CheckRegister({id: userID});
        if (dbRes) return res.status(200).json(true);
        else {return res.status(500).json(false);}
    } catch (e) {
        return res.status(500).json(false);
    }
});

router.get('/login', async (req, res) => {
    try {
        const userID = req.query.userID;
        const userPW = req.query.userPW;

        const dbRes = await RegDBInst.CheckLogin({id: userID, pw: userPW});
        if (dbRes) return res.status(200).json(true);
        else {return res.status(500).json(false);}
    } catch (e) {
        return res.status(500).json(false);
    }
});

router.post('/addAccount', async (req, res) => {
    try{
        const {id: userid, pw: userpw} = req.body;
        const addResult = await RegDBInst.AddInitial({id: userid, pw: userpw});
        return true;
    } catch (e) {
        console.log(`[Registration DB] Error : ${e}`);
        return false;
    }
})

router.post('/deleteAccount', async (req, res) => {
    try {
        const {id: userid, pw: userpw} = req.body;
        const deleteResult = await RegDBInst.DeleteRegister({id: userid, pw:userpw});
        return true;
    } catch (e) {
        console.log(`[Registration DB] Error : ${e}`);
        return false;
    }
})

module.exports = router;