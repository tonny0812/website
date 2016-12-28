var express = require('express');
var router = express.Router();
var Account = require('../lib/mongo').Account;

/* GET users listing. */
router.get('/', function(req, res, next) {
   res.render('users');
});

router.get('/create', function(req, res, next){
	res.render('addUser');
});

// 创建一个用户
router.post('/create', function(req, res, next) {
	console.log(req.fields)
	 var name = req.fields.name;
	 var passwd = req.fields.passwd;
	 var minute1 = req.fields.minute1;
	 var second1 = req.fields.second2;
	 var minute2 = req.fields.minute2;
	 var second2 = req.fields.second2;
	 
	 var account = new Account({
			name: name,
			passwd: passwd,
			minute1: minute1,
			second1: second1,
			minute2: minute2,
			second2: second2
		 });
	 account.save(function (err, account) {
		  if (err) return console.error(err);
		  res.redirect('/users');
	});
});

// 获取用户信息
router.get('/data', function(req, res, next) {
	Account.find(function(err, accounts) {
		if (err) return console.error(err);
	 	console.log(accounts)
	 	var data = {
			"total": accounts.length,
			"rows": accounts
	 	}
	 	res.send(data);
	});
});

module.exports = router;
