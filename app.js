const express = require("express");
const path = require("path");
require('dotenv').config();
const mongoDbConnection = require("./db/connection");
const app = express();
mongoDbConnection.then(()=>{
    console.log("MongoDB connected successfully from app");
}).catch((err)=>{
    console.log(err)
});

app.use(express.json());
// Serve the vanilla frontend from the same origin so its /api calls use the existing backend without CORS changes.
app.use(express.static(path.join(__dirname, "frontend")));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/appointment', require('./routes/appointment.routes'));
app.use('/api', require('./routes/payment.routes'));
app.use('/api', require('./routes/feedback.routes'));


app.listen(3000, ()=>{
    console.log("Server started on port 3000.")
})





