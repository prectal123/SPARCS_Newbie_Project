const AccountModel = require("../models/account");

const Authorization = async ({key, pw}) => {
    console.log("pw: " + pw);
    const res = await AccountModel.findOne({Key: key});
    if(res === null) {console.log("Unauthorized"); return false;} else {
        const respw = await AccountModel.findOne({Key: key, PW: pw});
        if(respw === null) {console.log("Unauthorized"); return false;} else {return true;}
    }
}  

const authMiddleware = async (req, res, next) => {
    const login = await Authorization({key: req.body.credential, pw: req.body.password});
    console.log("HHHHHHHHH");
    if (login) {
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        next();
    }
    else { 
        console.log("[AUTH-MIDDLEWARE] Not Authorized User");
        res.status(401).json({ error: "Not Authorized" });
    }
}

module.exports = authMiddleware;