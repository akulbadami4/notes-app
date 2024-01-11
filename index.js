const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const notesRoutes = require('./routes/notesRoutes');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRotues');
const db = require('./config/db');
require('dotenv').config();
const rateLimiter = require('./middlewares/ratelimiter');
const port = process.env.PORT || 3000;

app.use(rateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/notes",notesRoutes);
app.use("/api/search",searchRoutes);


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
