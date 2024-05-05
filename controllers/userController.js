const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const User = require('../models/userModel');


const uri = process.env.URI;
const saltRounds = 10;

const registerNewUser = async function(req, res) {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json( { message: "Please fill in all the fields!!"} );
    }

    try {
        await mongoose.connect(uri);
        console.log('connected');

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await User.create({ username, email, password: hashedPassword} );

        res.status(200).json({ message: "A user has been created with the following fields:", user: { username, email }});
    } catch(err) {
        console.log(err);
        return res.status(400).json({ error: err });
    } finally {
        await mongoose.disconnect();
        console.log('disconnected');
    }
}

const loginUser = async function(req, res) {
    const username = req.body.username;
    const inputPassword = req.body.password;

    if (!username || !inputPassword) {
        return res.status(400).json({ message: "Login and username both are required!!"});
    }


    try {
        await mongoose.connect(uri);
        console.log('connected');

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
        console.log(err);
        return res.status(400).json({ error: err });
    } finally {
        await mongoose.disconnect();
        console.log('disconnected');
    }
}

module.exports = { registerNewUser, loginUser };