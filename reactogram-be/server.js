const express = require('express');
const PORT = 4000;
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const {MONGODB_URL} = require('./config')

mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected', ()=>{
    console.log("DB Connectes");;
})
mongoose.connection.on('error', ()=>{
    console.log("error in DB Connection");;
})

require('./models/user_model');
require('./models/post_model');

app.use(cors());
app.use(express.json());

app.use(require('./routes/user_route'));
app.use(require('./routes/post_routes'));
app.use(require('./routes/file_route'));

app.listen(PORT,()=>{
    console.log("Server Started");
});