const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const pinRoute = require("./routes/pins.js")
const userRoute = require("./routes/users.js")


mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB connected");
}).catch((e)=>{
    console.log(e);
});



app.use(express.json());

app.use(`/api/pins`,pinRoute)


app.use(`/api/users`,userRoute)



app.listen(8800,()=>{
    console.log("Backend server is running");
})


