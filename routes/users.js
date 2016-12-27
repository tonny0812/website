var express = require('express');
var router = express.Router();

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
