const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

const mongoose = require('mongoose');
const UserModel = mongoose.model("UserModel");

module.exports = async (req, res, next) =>{
    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(401).json({error: "User not logged in"});
    }
    const token = authorization.replace("Bearer ", ""); // authorization always be like "Bearer jsjdskjdshkassjhf"
    jwt.verify(token, JWT_SECRET, async (error, payload) => {
        if (error) {
            return res.status(401).json({ error: "User not logged in" });
        }
        const { _id } = payload;
        let dbUser = await UserModel.findById(_id);
        if (dbUser) {
            req.user = dbUser;
            next(); // goes to the next middleware or goes to the REST API
        }
    });
}