var express = require('express');
var router = express.Router();
var Account = require('../lib/mongo').Account;
var kaoQinTest = require('../controller/login').kaoQin.test;

var checkLogin = require('../middlewares/check').checkLogin;

/* GET users listing. */
router.get('/', checkLogin, function(req, res, next) {
   res.render('users');
});

//更新一个用户信息
router.post('/update/:row', checkLogin, function(req, res, next) {
	 var row = JSON.parse(req.params.row);
	 console.log(row)
	 Account.findById(row._id,function(err,account){
	 	 var udpateAccount = {}; 
		 udpateAccount.name = row.name;
		 udpateAccount.password = row.password;
		 udpateAccount.minute1 = row.minute1;
		 udpateAccount.minute2 = row.minute2;
		 udpateAccount.active = row.active;
	     var _id = account._id; //需要取出主键_id
	     Account.update({_id:_id}, udpateAccount, function(err){
	    	  if(err) {
	    	  	  console.log(err)
	    		  res.send(false);
	    	  } else {
	    		  res.send(true);
	    	  }
	     });
	     //此时才能用Model操作，否则报错
	});
});

// 删除一个用户
router.post('/delete/:id', checkLogin, function(req, res, next) {
	 var id = req.params.id;
	 if(req.session.user.name !== 'admin') {
		 req.session.user = null;
	 }
     Account.remove({_id:id}, function(err){
    	  if(err) {
    		  res.send(false);
    	  } else {
    		  res.send(true);
    	  }
     });
});

// 获取用户信息列表
router.get('/data', checkLogin, function(req, res, next) {
	var currentAccount = req.session.user;
	if(currentAccount.name == 'admin') {
		Account.find(function(err, accounts) {
			if (err) return console.error(err);
			var filterAccounts = [];
			for(var index=0;index<accounts.length;index++) {
				if(accounts[index].name !== 'admin') {
					filterAccounts.push(accounts[index]);
				}
			}
			var data = {
					"total": accounts.length,
					"rows": filterAccounts
			}
			res.send(data);
		});
	} else {
		Account.findById(currentAccount._id,function(err,account){
			if (err) return console.error(err);
			var accounts = [];
			accounts.push(account);
			var data = {
					"total": accounts.length,
					"rows": accounts
			}
			res.send(data);
		});
	}
});

// 考勤打卡测试
router.post('/test/:userinfo', checkLogin, function(req, res, next){
	var userinfo = req.params.userinfo;
	//console.log(userinfo)
	userinfo = JSON.parse(userinfo);
	kaoQinTest(userinfo);
	res.send(true);
});

module.exports = router;
