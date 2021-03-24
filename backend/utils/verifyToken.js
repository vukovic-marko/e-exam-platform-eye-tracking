const jwt = require('jsonwebtoken')

// TODO ADD BEARER 
const verifyAccessToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(400).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "SECRET");
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).send('Invalid Token');
    }
}

// TODO ADD BEARER
const verifyRefreshToken = (req, res, next) => {
    const token = req.cookies['re-to'];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "SECRET");
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).send('Invalid Token');
    }
}

module.exports.verifyAccessToken = verifyAccessToken;
module.exports.verifyRefreshToken = verifyRefreshToken;