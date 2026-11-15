const express = require("express");
const path = require("path");
require('dotenv').config();
const { initializeDatabase, pool } = require("./db/connection");
const app = express();

app.use(express.json());
// Serve the vanilla frontend from the same origin so its /api calls use the existing backend without CORS changes.
app.use(express.static(path.join(__dirname, "frontend")));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/appointment', require('./routes/appointment.routes'));
app.use('/api', require('./routes/payment.routes'));
app.use('/api', require('./routes/feedback.routes'));


const port = process.env.PORT || 3000;

const startServer = async () => {
    await initializeDatabase();
    app.listen(port, () => {
        console.log(`Server started on port ${port}.`);
    });
};

startServer().catch(async (err) => {
    console.error('Could not initialize MySQL database:', err);
    await pool.end();
    process.exitCode = 1;
});



