const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_CONNECTION,{})
.then(()=>{
    console.log("Connected")
})
.catch(err=>{
    console.log("error");
    console.log(err);
});