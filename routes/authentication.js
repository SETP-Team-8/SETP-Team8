const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.sendStatus(401); // No token provided
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification error:', err.message);
            return res.sendStatus(403); // Invalid token
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };