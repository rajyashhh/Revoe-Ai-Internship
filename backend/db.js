require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectID = Schema.ObjectID;
const mongoUrl = process.env.mongo_url;
mongoose.connect(mongoUrl);

const userSchema = new Schema({
    id: ObjectID,
    name: String,
    password: String,
    email: {type : String, unique : true}
})

const userModel = mongoose.model("users", userSchema);


module.exports = {
    userModel
}