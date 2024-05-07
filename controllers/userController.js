const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const User = require('../models/userModel');

const saltRounds = 10;

const registerNewUser = async function(req, res) {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json( { message: "Please fill in all the fields!!"} );
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await User.create({ username, email, password: hashedPassword} );
        res.status(200).json({ message: "A user has been created with the following fields:", user: { username, email }});
    } catch(err) {
        console.error("Couldn't register a new user", err);
        return res.status(400).json({ message: "Couldn't register a new user" }, err);
    } 
}

const loginUser = async function(req, res) {
    const username = req.body.username;
    const inputPassword = req.body.password;

    if (!username || !inputPassword) {
        return res.status(400).json({ message: "Login and username both are required!!"});
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "Cannot find a user with this username!!" });
        }

        const realPassword = user.password;
        const passwordMatches = await bcrypt.compare(inputPassword, realPassword);

        if (!passwordMatches) {
            return res.status(400).json({ message: "Please specify a correct password for this user!!"});
        }

        const token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '36h' });

        res.setHeader('Authorization', `Bearer ${token}`);
        res.json({ message: "You are now logged-in!! Feel free to proceed to the private routes"})
    } catch(err) {
        console.error("Couldn't login a user", err);
        return res.status(400).json({ message: "Couldn't login a user", err });
    } 
}

module.exports = { registerNewUser, loginUser };