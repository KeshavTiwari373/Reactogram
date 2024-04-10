const mongoose = require('mongoose');

const userScrema = new mongoose.Schema({
    fullName : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true
    },
    password : {
        type: String,
        required : true
    },
    profileImg : {
        type: String,
        default : "https://images.unsplash.com/photo-1682686580186-b55d2a91053c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8"
    }

});

mongoose.model("UserModel", userScrema);