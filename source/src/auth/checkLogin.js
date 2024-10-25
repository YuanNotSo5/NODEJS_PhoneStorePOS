const jwt = require('jsonwebtoken');
const url  = require('url');
require('dotenv').config();

const verifyAccount = (req,res,next) => {
    if(req.session.user == null){
        res.redirect("/login")
    }
    else{
        var url_parse = url.parse(req.url);
        var path = url_parse.pathname
        var user = req.session.user

        if(path.includes("admin") && user.role != 1)
            res.redirect("/login")
        else
            next()
    }
    
    // const authHeader = req.header('Authorization');
    // // const token = req.session.token;
    // const token = authHeader && authHeader.split(' ')[1];

    // if(!token) return res.json(401);

    // try {
    //     const decoded = jwt.verify(token, process.env.KEY);
    //     console.log(decoded);
    //     next();
    // } catch (error) {
    //     console.log(error);
    //     return res.sendStatus(403);
    // }
}

module.exports = verifyAccount;