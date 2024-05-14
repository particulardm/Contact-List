const express = require('express');
const dotenv = require('dotenv').config();
const { connectDB, disconnectDB } = require('./db/dbConnectionManagement');
const contactRouter = require('./routes/contactRoute');
const userRouter = require('./routes/userRoute');
const verify = require('./middlewares/authVerification');
const path = require('path')

const uri = process.env.URI;
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

app.use('/api/contacts', verify, contactRouter);
app.use('/api/contacts', contactRouter);
app.use('/user', userRouter);

connectDB(uri);

app.listen(port, () => {
    console.log("listening on port:", port);
})

app.get('/', (req, res) => {
    res.send('you have been heard');
})

process.on('SIGINT', disconnectDB);
process.on('SIGTERM', disconnectDB);