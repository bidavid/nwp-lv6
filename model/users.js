var mongoose = require('mongoose');
var blobSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    password: String,
});
mongoose.model('User', blobSchema);