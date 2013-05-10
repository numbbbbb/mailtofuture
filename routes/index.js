
/*
 * GET home page.
 */
var cronJob = require('cron').CronJob;
new cronJob('00 00 00 * * *', function(){
    var checkdb = new DB();
    checkdb.findandsend();
}, null, true,"");

DB = require('../modules/dbctrl');


module.exports = function(app){
app.get('/', function(req, res){
    res.render('index', { title: 'Express' });
});

app.get('/fail',function(req, res){
    res.render('fail');
});

app.post('/checkemail',function(req, res){
    if (req.body.emailcheck == req.session.email){
         res.writeHead(200, {'Content-Type': 'text/plain'}); 
              res.end('ok2'); 
        var newone = new DB({
        time:req.session.time,
        email:req.session.email,
        content:req.session.content,
        });
        newone.save();
    }
    else{
         res.writeHead(200, {'Content-Type': 'text/plain'}); 
              res.end('error2'); 
    };
    req.session.destroy();
});

app.get('/index',function(req, res){
    var getnumber = new DB();
    getnumber.getnumber(res);
});

app.get('/flatui',function(req, res){
    res.render('flatui');
});

app.get('/success',function(req, res){
    res.render('success', { title: '新邮件' });
});

app.post('/index',function(req, res){
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
     res.writeHead(200, {'Content-Type': 'text/plain'}); 
              res.end('ok1'); 
});

}