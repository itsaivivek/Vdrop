const jwt = require('jsonwebtoken');

// Checks user login or not
function auth(req, res, next) {
    const token = req.cookies.token;

    // token not available (i.e if user not logged in)
    if(!token){
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
    // if token is available check it is right or not
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        console.log(decoded)
        
        return next();
    } catch (err) { // if token is tempered it caches error
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
}


module.exports = auth;
