
/*
 * GET home page.
 */
DB = require('../modules/dbctrl');
smtpTransport = require('../modules/sendemail');
module.exports = function(app){
app.get('/', function(req, res){
    res.render('index', { title: 'Express' });
    var mailOptions = {
    from: "Fred Foo ✔ <foo@blurdybloop.com>", // sender address
    to: "925184928@qq.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>" // html body
}

smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }
    smtpTransport.close(); // shut down the connection pool, no more messages
});
});

app.get('/fail',function(req, res){
    res.render('fail');
});

app.get('/checkemail',function(req, res){
    res.render('checkemail');
});

app.post('/checkemail',function(req, res){
    if (req.body.email == req.session.email){
        res.redirect('/success');
        var newone = new DB({
        time:req.session.time,
        email:req.session.email,
        content:req.session.content,
        });
        newone.save();
    }
    else{
        res.redirect('/fail');
    };
    req.session.destroy();
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
    req.session.time = myDate;
    req.session.email = req.body.email;
    req.session.content = req.body.content;
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