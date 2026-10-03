const mongoose = require("mongoose");

const mongoDbConnection = mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookingSystem").then(()=>{
    console.log("Connection to db success-from connection !")
}).catch((err)=>{
    console.log("Could not connect to DB", err);
});


module.exports = mongoDbConnection;
