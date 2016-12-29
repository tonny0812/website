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

//更新一个用户信息
router.post('/update/:row', function(req, res, next) {
	 var row = JSON.parse(req.params.row);
	 Account.findById(row._id,function(err,account){
		 account.name = row.name;
		 account.passwd = row.passwd;
		 account.minute1 = row.minute1;
		 account.second1 = row.second1;
		 account.minute2 = row.minute2;
		 account.second2 = row.second2;
	     var _id = account._id; //需要取出主键_id
	     delete account._id;    //再将其删除
	     delete account.data;
	     Account.update({_id:_id}, account, function(err){
	    	  if(err) {
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
	 	console.log(accounts)
	 	var data = {
			"total": accounts.length,
			"rows": accounts
	 	}
	 	res.send(data);
	});
});

module.exports = router;
