const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

const verify = function(req, res, next) {
    const header = req.headers.Authorization || req.headers.authorization;
    const token = header.split(' ')[1];

    if (!token) {
        return res.status(400).json({ error: 'No token provided..' });
    }

    try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    } catch(err) {
        console.log(err);
        return res.status(400).json({ error: 'Please provide a correct token!!' });
    }

    next();
}

module.exports = verify;