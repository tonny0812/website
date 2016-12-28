var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://10.4.45.19/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
  console.log(111);
});

var AccountSchema = mongoose.Schema({
    name: String,
    passwd: String,
    minute1: String,
    second1: String,
    minute2: String,
    second2: String,
    date: { type: Date, default: Date.now }
});

AccountSchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name"
  console.log(greeting);
}
var Account = mongoose.model('Account', AccountSchema)

var fluffy = new Account({ 
							name: 'test',
							passwd: 'test',
							minute1: '10-20',
							second1: '30',
							minute2: '30-40',
							second2: '40'	
						 });
fluffy.speak();

fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
  fluffy.speak();
});

Account.find(function(err, accounts) {
	if (err) return console.error(err);
 	console.log(accounts)
});

var usersArr = [];

for(var i=0; i<20;i++) {
	var user = {};
	user.id = i;
	user.name = 'name' + i;
	user.passwd = 'passwd' + i;
	user.minute1 = '10-20';
	user.second1 = '30';
	user.minute2 = '30-40';
	user.second2 = '50';
	usersArr.push(user);
}

/* GET users listing. */
router.get('/', function(req, res, next) {
   res.render('users');
});

router.get('/data', function(req, res, next) {
	console.log('33')
	var data = {
		"total": usersArr.length,
    "rows": usersArr
	}
  res.send(data);
});

module.exports = router;
