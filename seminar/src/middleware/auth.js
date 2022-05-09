const authMiddleware = (req, res, next) => {
    if (req.body.credential === process.env.API_KEY && req.body.password === process.env.API_PW) {
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        next();
    }
    else {
        console.log("[AUTH-MIDDLEWARE] Not Authorized User");
        res.status(401).json({ error: "Not Authorized" });
    }
}

module.exports = authMiddleware;