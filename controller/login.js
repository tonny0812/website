var http = require('http');
var schedule = require("node-schedule");
var cheerio = require('cheerio');
var superagent = require('superagent');
var events = require("events");
var querystring = require('querystring');
var moment = require('moment');

var Account = require('../lib/mongo').Account;

var emitter = new events.EventEmitter();

var kqUrl = 'http://192.168.2.53';
var loginBeforeInfo = {
		inputUsername: '',
		inputPasswdname: '',
		timestamp: '',
		timeKey: '',
		neusoft_key: '',
		cookie: ''
	};

function getLoginPageInfo(user) {
	var req = http.get("http://192.168.2.53/index.jsp", function(res) { 
		var cookie = res.headers['set-cookie'][0];
		var html = '';
		res.on('data', function(data) {
			html += data;
		});
		res.on('end', function() {
			var info = filterLoginInfo(html, cookie);
			//console.log(info);
			logIn(user);
		});
	});
	req.on('error', function(e) {
		console.log('error');
	});
}

function filterLoginInfo(html, cookie) {
	var $ = cheerio.load(html);
	var chapters = $('.eleWrapper');
	chapters.each(function(item) {
		var $div = $(this);
		var $input = $div.find('input');
		if($input.attr('type') === 'text') {
			loginBeforeInfo.inputUsername = $input.attr('name') + '';
			if('' === loginBeforeInfo.timestamp) {
				var strs = loginBeforeInfo.inputUsername.split('!');
				loginBeforeInfo.timestamp = strs[strs.length-1];
				loginBeforeInfo.timeKey = 'KEY' + loginBeforeInfo.timestamp;
			}
		} else {
			loginBeforeInfo.inputPasswdname = $input.attr('name')  + '';
		}
	});
	var neusoft_key = $('input[name="neusoft_key"]').val();
	loginBeforeInfo.neusoft_key = neusoft_key;
	loginBeforeInfo.cookie = cookie.split(';')[0];
	return loginBeforeInfo;
}

function filterCurrentempoid(html) {
	var $ = cheerio.load(html);
	var result = $('input[name="currentempoid"]').val();
	//console.log("####" + result);
	return result;
}

function logIn (user) {
	var postData = {};
	postData['login'] = "true",
	postData['neusoft_attendance_online'] = "";
	postData['neusoft_key'] = loginBeforeInfo.neusoft_key;
	postData[loginBeforeInfo.timeKey] = "";
	postData[loginBeforeInfo.inputUsername] = user.username;
	postData[loginBeforeInfo.inputPasswdname] = user.passwd;
	var headers = {
		'Accept':	'application/json, text/javascript, */*; q=0.01',
		'Accept-Encoding':	'gzip, deflate',
		'Accept-Language':	'zh-CN,zh;q=0.8',
		'Cache-Control' :	'no-cache',
		'Connection':	'keep-alive',
		'Content-Length':	querystring.stringify(postData).length,
		'Content-Type':	'application/x-www-form-urlencoded; charset=UTF-8',
		'Host':	'192.168.2.53',
		'Cookie': loginBeforeInfo.cookie,
		'Origin':	'http://192.168.2.53',
		'Pragma':	'no-cache',
		'Referer':	'http://192.168.2.53/index.jsp',
		'Upgrade-Insecure-Requests':	1,
		'User-Agent':	'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
	}
 	superagent.post(kqUrl+'/login.jsp')  //登录提交地址
	    .type("form")
	      .send(querystring.stringify(postData))
	      .set(headers)
	      .end(function(err, res){
	          if (err) {
	        	  throw err;
	          } 
	          //signIn(res.text);
	          signInSuperAgent(res.text);
       	 });
}



function signIn(html) {
	var currentempoid = filterCurrentempoid(html);
	var postData = querystring.stringify({
		'currentempoid':currentempoid
	});
	var options = {
			hostname: '192.168.2.53',
			port:	80,
			path:	'/record.jsp',
			method:	'POST',
			headers:	{
				'Accept':	'application/json, text/javascript, */*; q=0.01',
				'Accept-Encoding':	'gzip, deflate',
				'Accept-Language':	'zh-CN,zh;q=0.8',
				'Connection':	'keep-alive',
				'Content-Length':	postData.length,
				'Content-Type':	'application/x-www-form-urlencoded; charset=UTF-8',
				'Cookie':	loginBeforeInfo.cookie,
				'Host':	'192.168.2.53',
				'Origin':	'http://192.168.2.53',
				'Referer':	'http://192.168.2.53/attendance.jsp',
				'User-Agent':	'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
				'X-Requested-With':	'XMLHttpRequest'
			}
	};
	var req = http.request(options, function(res) {
		res.on('end', function() {
			console.log('打卡 is over!');
		});
		res.on('error', function(e) {
			console.log('Error: ' + e.massage);
		});
	});
	req.write(postData);
	req.end();	
	
}

function signInSuperAgent(html) {
	var currentempoid = filterCurrentempoid(html);
	var postData = querystring.stringify({
		'currentempoid':currentempoid
	});
	var headers = {
			'Accept':	'application/json, text/javascript, */*; q=0.01',
			'Accept-Encoding':	'gzip, deflate',
			'Accept-Language':	'zh-CN,zh;q=0.8',
			'Connection':	'keep-alive',
			'Content-Length':	postData.length,
			'Content-Type':	'application/x-www-form-urlencoded; charset=UTF-8',
			'Cookie':	loginBeforeInfo.cookie,
			'Host':	'192.168.2.53',
			'Origin':	'http://192.168.2.53',
			'Referer':	'http://192.168.2.53/attendance.jsp',
			'User-Agent':	'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
			'X-Requested-With':	'XMLHttpRequest'
		}
	superagent.post(kqUrl+'/record.jsp')
      .send(postData)
      .set(headers)
      .end(function(err, res){
          if (err) {
        	  console.log('Error: ' + err.massage);
        	  throw err;
          }
          console.log('打卡 结束!');
   	 });
}

function start() {
	var currentMonent = new moment();
	console.log('启动考勤任务 ======>>>' + currentMonent.format('MMMM Do dddd YYYY-MM-DD, h:mm:ss a'));
	var dakaRule = new schedule.RecurrenceRule();
	dakaRule.dayOfWeek = [1, new schedule.Range(1, 5)];
	dakaRule.hour = 8;
	dakaRule.minute = 1;
	var daka = schedule.scheduleJob(dakaRule, function() {
		console.log('=====================================================')
		Account.find(function(err, accounts) {
			if (err) return console.error(err);
			if(accounts.length > 0) {
				accounts.forEach(function(val,index,arr){
					if(!!val.active) {
						firstDaKa(val);
						secondDaKa(val);
					}
				});
			} else {
				console.log('数据库无信息')
			}
			console.log('=====================================================')
		});
	});
}

function firstDaKa(userinfo) {
	if(userinfo) {
		console.log('启动第一次打卡任务');
		var user = {};
		user.username = userinfo.name;
		user.passwd = userinfo.passwd;
		
		var minute1 = userinfo.minute1;
		var m1Start = parseInt(minute1.split('-')[0]);
		var m1End = parseInt(minute1.split('-')[1]);
		m1Start = typeof(m1Start) == 'undefined' ? 45 : m1Start;
		m1End = typeof(m1End) == 'undefined' ? 55 : m1End;
		
		var firstDakaMoment = new moment();
		var firstHour = 8;
		var firstMinute = RandomNumBoth(m1Start, m1End);
		var firstSecond = createRandomInteger(59);
		console.log(user.username + '===> ' + firstHour + ':' + firstMinute + ':' + firstSecond);
		var firstDakaRule = new Date(firstDakaMoment.year(), firstDakaMoment.month(), firstDakaMoment.date(), firstHour, firstMinute, firstSecond);
		
		var first = schedule.scheduleJob(firstDakaRule, function() {
			var currentMoment =  new moment();
			getLoginPageInfo(user);
			console.log(user.username + ':' + currentMoment.format('MMMM Do dddd YYYY-MM-DD, h:mm:ss a') + '第一次打卡');
			first.cancel();
		});
	} else {
		console.log('userinfo is null');
	}
}

function secondDaKa(userinfo) {
	if(userinfo) {
		console.log('启动第二次打卡任务');
		var user = {};
		user.username = userinfo.name;
		user.passwd = userinfo.passwd;
		
		var minute2 = userinfo.minute2;
		var m2Start = parseInt(minute2.split('-')[0]);
		var m2End = parseInt(minute2.split('-')[1])
		m2Start = typeof(m2Start) == 'undefined' ? 30 : m2Start;
		m2End = typeof(m2End) == 'undefined' ? 45 : m2End;
		
		
		var secondDakaMoment = new moment();
		var secondHour = 18;
		var secondMinute = RandomNumBoth(m2Start, m2End);
		var secondSecond = createRandomInteger(59);
		console.log(user.username + '===> ' + secondHour + ':' + secondMinute + ':' + secondSecond);
		var secondDakaRule = new Date(secondDakaMoment.year(), secondDakaMoment.month(), secondDakaMoment.date(),secondHour, secondMinute, secondSecond);	
			
		var second = schedule.scheduleJob(secondDakaRule, function(){
			var currentMoment =  new moment();
			getLoginPageInfo(user);
			console.log(user.username + ':' + currentMoment.format('MMMM Do dddd YYYY-MM-DD, h:mm:ss a') + '第二次打卡');
			second.cancel();
		});
	} else {
		console.log('userinfo is null');
	}
}


function createRandomInteger(range) {
	if(isNaN(range) || range=="" || range > 60 || range < 0) {
		range = 60;
	}
	var num = Math.random() * range;
	return Math.floor(num);
}

function RandomNumBoth(Min,Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	var num = Min + Math.round(Rand * Range); //四舍五入
	return num;
}


module.exports.kaoQin = {
	test: getLoginPageInfo,
	start: start
}
