var mongoose = require('mongoose');
mongoose.connect('mongodb://10.4.45.19/test');

var AccountSchema = mongoose.Schema({
    name: String,
    passwd: String,
    minute1: String,
    second1: String,
    minute2: String,
    second2: String,
    date: { type: Date, default: Date.now }
});

module.exports.Account = mongoose.model('Account', AccountSchema);