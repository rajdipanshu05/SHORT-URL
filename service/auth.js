const jwt = require("jsonwebtoken");
const sessionIdToUserMap = new Map();
const secret = "Dipansh@123$";


function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
    }, secret);
}


function getUser(token) {
    if(!token) return null;
    try{
        return jwt.verify(token,secret)
    }catch(err){
        return null;
    }
}


module.exports = {
    setUser,
    getUser,
}