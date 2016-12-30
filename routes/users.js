var express = require('express');
var router = express.Router();
var Account = require('../lib/mongo').Account;
var kaoQinTest = require('../controller/login').kaoQin.test;

/* GET users listing. */
router.get('/', function(req, res, next) {
   res.render('users');
});

router.get('/create', function(req, res, next){
	res.render('addUser');
});

// 创建一个用户
router.post('/create', function(req, res, next) {
	 var name = req.fields.name;
	 var passwd = req.fields.passwd;
	 var minute1 = req.fields.minute1;
	 var minute2 = req.fields.minute2;
	 
	 var account = new Account({
			name: name,
			passwd: passwd,
			minute1: minute1,
			minute2: minute2,
		 });
	 account.save(function (err, account) {
		  if (err) return console.error(err);
		  res.redirect('/users');
	});
});

//更新一个用户信息
router.post('/update/:row', function(req, res, next) {
	 var row = JSON.parse(req.params.row);
	 Account.findById(row._id,function(err,account){
	 	 var udpateAccount = {}; 
		 udpateAccount.name = row.name;
		 udpateAccount.passwd = row.passwd;
		 udpateAccount.minute1 = row.minute1;
		 udpateAccount.minute2 = row.minute2;
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
router.post('/delete/:id', function(req, res, next) {
	 var id = req.params.id;
     Account.remove({_id:id}, function(err){
    	  if(err) {
    		  res.send(false);
    	  } else {
    		  res.send(true);
    	  }
     });
});

// 获取用户信息
router.get('/data', function(req, res, next) {
	Account.find(function(err, accounts) {
		if (err) return console.error(err);
	 	var data = {
			"total": accounts.length,
			"rows": accounts
	 	}
	 	res.send(data);
	});
});

// 考勤打卡测试
router.post('/test/:userinfo', function(req, res, next){
	var userinfo = req.params.userinfo;
	console.log(userinfo)
	userinfo = JSON.parse(userinfo);
	kaoQinTest(userinfo);
	res.send(true);
});

module.exports = router;
