// config/db.js
const mongoose = require('mongoose');

const connect = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travlr';
    mongoose.set('strictQuery', true);
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    await mongoose.connect(uri);
    return mongoose.connection;
};

module.exports = { connect };