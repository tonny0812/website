var config = require('config-lite');
var mongoose = require('mongoose');
mongoose.connect(config.mongodb);

var AccountSchema = mongoose.Schema({
    name: { type:String, unique: true },
    password: String,
    minute1: String,
    minute2: String,
    active: {type: Boolean, default: false},
    date: { type: Date, default: Date.now }
});

module.exports.Account = mongoose.model('Account', AccountSchema);