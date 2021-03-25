const jwt = require('jsonwebtoken');
const createError = require('http-errors');

// TODO ADD BEARER 
const verifyAccessToken = (req, res, next) => {
    const header = req.header('Authorization');
    if (!header) throw createError(400, 'Access Denied');
    if (!header.startsWith('Bearer ')) throw createError(400, 'Access Denied');

    const token = header.slice(7);
    
    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "SECRET");
        req.user = verified;
        next();
    } catch(err) {
        throw createError(401, 'Invalid Token');
    }
}

// TODO ADD BEARER
const verifyRefreshToken = (req, res, next) => {
    const token = req.cookies['re-to'];
    if (!token) throw createError(400, 'Access Denied');

    try {
        const verified = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "SECRET");
        req.user = verified;
        next();
    } catch(err) {
        throw createError(401, 'Invalid Token');
    }
}

module.exports.verifyAccessToken = verifyAccessToken;
module.exports.verifyRefreshToken = verifyRefreshToken;