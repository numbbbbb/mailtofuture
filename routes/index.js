
/*
 * GET home page.
 */
DB = require('../modules/dbctrl');
module.exports = function(app){
app.get('/', function(req, res){
    res.render('index', { title: 'Express' });
    req.session.test = '123123';
});

app.get('/checkemail',function(req, res){
    res.render('checkemail');
});

app.post('/checkemail',function(req, res){
    if (req.body.email == req.session.data.email){
        res.redirect('/success');
    }
    else{
        res.redirect('/fail');
    };
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
    var myDate=new Date();
    switch(parseInt(req.body.timedelay)){
        case 1:
            myDate.setMonth(myDate.getMonth()+6);
            break;
        case 2:
            myDate.setMonth(myDate.getMonth()+12);
            break;
        case 3:
            myDate.setMonth(myDate.getMonth()+60);
            break;
        case 4:
            myDate.setMonth(myDate.getMonth()+120);
            break;
    };
	var newone = new DB({
		time:myDate,
		email:req.body.email,
		content:req.body.content,
	});
    req.session.data = newone;
    console.log(newone);
    res.redirect('/checkemail');
    return;
	newone.save(function(err){
	if (err){
		req.flash('error',err);
		return res.redirect('/newemail');
	}
	res.redirect('/success');
});
});

}