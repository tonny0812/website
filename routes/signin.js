var express = require('express');
var router = express.Router();
var Account = require('../lib/mongo').Account;
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin 登录页
router.get('/', checkNotLogin, function(req, res, next) {
  res.render('signin');
});

// POST /signin 用户登录
router.post('/', checkNotLogin, function(req, res, next) {
  var name = req.fields.name;
  var password = req.fields.password;
  Account.findOne({ name: name}, function (err, account){
	  console.log(account)
	  if (err || !account) {
		  req.flash('error', '用户不存在');
        return res.redirect('/signin');
      }
      // 检查密码是否匹配
      if (password !== account.password) {
    	  req.flash('error', '用户名或密码错误');
    	  return res.redirect('/signin');
      }
      req.flash('success', '登录成功');
      // 用户信息写入 session
      delete account.password;
      req.session.user = account;
      // 跳转到用户页面
      res.redirect('/users');
  });
});

module.exports = router;
