const jwt = require("jsonwebtoken");
const jwt_pass = process.env.jwt_pass;

function authUser(req,res,next){
    const token = req.headers.token;
    const verified = jwt.verify(token, jwt_pass);
    if (verified){
        req.userId = verified.id;
        next()
    }
    else{
        res.json({
            message : "User not signed in!"
        })
    }
}

module.exports = {
    authUser : authUser
}