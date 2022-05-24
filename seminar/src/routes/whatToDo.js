const express = require('express');
const WhatToDoModel = require('../models/whattodo');
const ArtModel = require('../models/Art');
const RegisterModel = require('../models/registration');

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
}

class WTDDB{
    static _inst_;
    static getInst = () => {
        if( !WTDDB._inst_ ) WTDDB._inst_ = new WTDDB();
        return WTDDB._inst_;
    }

    constructor() { console.log("[WhatToDo - DB] DB Inst Completed"); }

    SelectItems = async ({id}) => {
        try{
            const res =  await WhatToDoModel.find({Author: id})
            return {data: res}
        } catch (e) {
            console.log("[WhatToDo - DB] Error selecting items")
        }
    }

    AddItems = async ({title, Content}) => {
        try{
            //const 
        } catch (e) {

        }
    }
}

const router = express.Router();