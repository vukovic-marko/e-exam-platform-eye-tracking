const jwt = require('jsonwebtoken')

// TO GENERATE SECRET
//  node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"

const createAccessToken = (id, role) => {
    return jwt.sign({_id: id, role: role}, process.env.ACCESS_TOKEN_SECRET || "SECRET", {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'});
}

const createRefreshToken = (id, sessionId) => {
    return jwt.sign({_id: id, sessionId: sessionId}, process.env.REFRESH_TOKEN_SECRET || "SECRET", { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30m"});
}

module.exports.createAccessToken = createAccessToken;
module.exports.createRefreshToken = createRefreshToken;