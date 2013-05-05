var dbctrl = require('./dbconnect');
var smtpTransport = require('./sendemail');

function DB(item){
	this.time = item.time;
	this.email = item.email;
	this.content = item.content;
};
module.exports = DB;
DB.prototype.save = function save(callback){
	var item = {
		time:this.time,
		email:this.email,
		content:this.content,
	};
dbctrl.open(function(err,db){
	if (err){
		return callback(err);
	}
	db.collection('mailtofuture',function(err,collection){
		if (err){
			dbctrl.close();
			return callback(err);
		}
		collection.insert(item,{safe:true},function(err,item){
			dbctrl.close();
		})
	})
})
};

DB.prototype.findandsend = function find(callback){
	dbctrl.open(function(err,db){
	if (err){
		return callback(err);
	}
	db.collection('mailtofuture',function(err,collection){
		if (err){
			dbctrl.close();
			return callback(err);
		}
		collection.find().toArray(function(err, items) {
                 check_and_sendemail(items);
                 dbctrl.close();
             });
	})
})
};

function check_and_sendemail(items){
	var today = new Date();
	var todayyear = today.getFullYear();
	var todaymonth = today.getMonth();
	var todayday = today.getDate();
	for (var i=0;i<items.length;i++){
		var targetyear = items[i].time.substr(0,4);
		var targetmonth = items[i].time.substr(5,2);
		var targetday = items[i].time.substr(8,2);
		if (todayyear==targetyear && todaymonth==targetmonth && todayday==targetday){
			console.log("123213");
		};
	}
	    /*var mailOptions = {
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
});*/
	//console.log(items[0].time);
};