const mongoose = require ('mongoose');
const USERschema = mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    news: String,
    query: String
})

const USER = mongoose.model('user', USERschema);
module.exports = USER;