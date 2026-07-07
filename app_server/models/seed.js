// app_server/models/seed.js
const mongoose = require('./db');       // opens the connection and load models
const Trip = require('./travlr');       // the trips model
const fs = require('fs');
const path = require('path');

(async () => {
    try {
        // read seed data 
        const dataFile = path.join(__dirname, '..', '..', 'data', 'trips.json');
        const trips = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

        // reset collection then insert
        await Trip.deleteMany({});
        const result = await Trip.insertMany(trips);
        console.log('Seed complete. Inserted ${result.length} trips.');
    } catch (err) {
        console.error('Seed error:', err);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
})();