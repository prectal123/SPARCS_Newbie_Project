const express = require('express');
const authMiddleware = require('../middleware/auth');
const AccountModel = require('../models/account');

const router = express.Router();



class BankDB {
    static _inst_;
    static getInst = () => {
        if ( !BankDB._inst_ ) BankDB._inst_ = new BankDB();
        return BankDB._inst_;
    }

    #total = 10000;
    


    constructor() { console.log("[Bank-DB] DB Init Completed"); }
    
    addInitial = async ({ key, pw }) => {
        const newItem = new AccountModel({ Key: key, PW: pw, Money: 100000 });
        //console.log(newItem);
        const res = await newItem.save();
    } 

    findKey = async ({key}) => {
    try {
        const res = await AccountModel.findOne({Key: key});
        //console.log("Found: "+ res);
        if(res === null) return false; else return true;
    } catch { return false; }

    }

    deleteRegister = async ({key}) => {
        try {
            const res = await AccountModel.deleteMany({Key: key});
            //console.log("Deleted:" + res);
            return true;
        } catch { 
            return false; }
    }

    getBalance = () => {
        return { success: true, data: this.#total };
    }

    transaction = ( amount ) => {
        this.#total += amount; 
        return { success: true, data: this.#total };
    }
}

const bankDBInst = BankDB.getInst();

bankDBInst.deleteRegister({key: "miru"});
 
const initialize = async ({key, pw}) => {
    const lost = await bankDBInst.findKey({key: key});
    //console.log("lost: " + lost);
    if(!lost) bankDBInst.addInitial({key: key, pw: pw});
}
initialize({key: "miru", pw: "our55555"}); // Registeration authorization 
initialize({key: "night", pw: "happy"});

router.post('/getInfo', authMiddleware, (req, res) => {
    try {
        const { success, data } = bankDBInst.getBalance();
        if (success) return res.status(200).json({ balance: data });
        else return res.status(500).json({ error: data });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/transaction', authMiddleware, (req, res) => {
    try {
        const { amount } = req.body;
        const { success, data } = bankDBInst.transaction( parseInt(amount) );
        if (success) res.status(200).json({ success: true, balance: data, msg: "Transaction success" });
        else res.status(500).json({ error: data })
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

module.exports = router;