var path = require('path');
var express = require('express');
var router = express.Router();
var Account = require('../lib/mongo').Account;

// GET /signup 注册页
router.get('/', function(req, res, next) {
  res.render('signup');
});

//创建一个用户
router.post('/', function(req, res, next) {
	 var name = req.fields.name;
	 var passwd = req.fields.passwd;
	 var password = req.fields.password;
	 var repassword = req.fields.repassword;
	 
	// 校验参数
	  try {
	    if (name.length <= 0 ) {
	      throw new Error('请输入用户名');
	    }
	    if (password.length <= 0) {
	      throw new Error('请输入密码');
	    }
	    if (password !== repassword) {
	      throw new Error('两次输入密码不一致');
	    }
	  } catch (e) {
	    req.flash('error', e.message);
	    return res.redirect('/signup');
	  }
	 
	 var account = new Account({
			name: name,
			password: password,
			minute1: '45-59',
			minute2: '30-45',
		 });
	 account.save(function (err, account) {
		  if (err) {
			  if(err.code === 11000) {
				  req.flash('error', '用户已存在！');
			  }
			  return res.redirect('/signup');
		  }
		  delete account.password;
	      req.session.user = account;
	      // 写入 flash
	      req.flash('success', '注册成功');
		  res.redirect('/users');
	});
});


module.exports = router;
