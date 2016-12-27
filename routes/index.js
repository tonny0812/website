module.exports = function (app) {

	app.use('/', require('./home'));
	app.use('/users', require('./users'));
  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.render('404');
    }
  });
};

