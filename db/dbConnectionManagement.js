const mongoose = require('mongoose');

const connectDB = async function(uri) {
    try {
        await mongoose.connect(uri);

        console.log('The DB connection has been established, connection status:', mongoose.connection.readyState);
    } catch(err) {
        console.error('Error while connecting to the DB,', err);
    }
}

const disconnectDB = async function() {
    try {
        await mongoose.disconnect();

        console.log('The DB connection has been closed, exiting the process now, connection status:', mongoose.connection.readyState);

        process.exit(0);
    } catch(err) {
        console.error('Error while disconnecting from DB,', err);
    }
}

module.exports = { connectDB, disconnectDB };