
/*
 * GET home page.
 */
DB = require('../modules/dbctrl');
module.exports = function(app){
app.get('/', function(req, res){
  res.render('index', { title: 'Express' });
});

app.get('/newemail',function(req, res){
  res.render('newemail', { title: '新邮件' });
});
app.get('/flatui',function(req, res){
  res.render('flatui');
});
app.get('/success',function(req, res){
  res.render('success', { title: '新邮件' });
});
app.post('/newemail',function(req, res){
	var newone = new DB({
		time:req.body.time,
		email:req.body.email,
		content:req.body.content,
	})
	newone.save(function(err){
	if (err){
		req.flash('error',err);
		return res.redirect('/newemail');
	}
	res.redirect('/success');
});
})
}