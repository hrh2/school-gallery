const jwt = require('jsonwebtoken');
require('dotenv').config();

function extractUserIdFromToken(req) {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;

    const decodedToken = jwt.decode(token);
    const userId = decodedToken ? decodedToken._id : null;

    return userId;
}


function extractRoledFromToken(req) {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;

    const decodedToken = jwt.decode(token);
    const role = decodedToken ? decodedToken.role : null;

    return role;
}
function extractIsVerifiedFromToken(req) {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;

    const decodedToken = jwt.decode(token);
    const value = decodedToken ? decodedToken.isVerified : null;

    return value;
}

function extractEmailAndNameFromToken(req) {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;

    const decodedToken = jwt.decode(token);
    const name = decodedToken ? decodedToken.name : null;
    const email = decodedToken ? decodedToken.email : null;

    return {email,name};
}



module.exports = {extractUserIdFromToken,extractRoledFromToken,extractEmailAndNameFromToken,extractIsVerifiedFromToken};