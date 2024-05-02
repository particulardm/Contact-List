const express = require('express');
const dotenv = require('dotenv').config();
const contactRouter = require('./routes/contactRoute');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use('/api/contacts', contactRouter);

app.get('/', (req, res) => {
    res.send('you have been heard');
})

app.listen(port, () => {
    console.log("listening on port:", port);
})
