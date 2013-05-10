var mongo = require('./dbconnect').mongo;
var mongoUri = require('./dbconnect').mongoUri;
var smtpTransport = require('./sendemail');

function DB(){
	if(arguments.length==1){ 
	this.time = arguments[0].time;
	this.email = arguments[0].email;
	this.content = arguments[0].content;
	};
	if(arguments.length==0){};
};
module.exports = DB;
DB.prototype.save = function save(callback){
	var item = {
		time:this.time,
		email:this.email,
		content:this.content,
	};
mongo.connect(mongoUri,function(err,db){
	if (err){
		return callback(err);
	}
	db.collection('mailtofuture',function(err,collection){
		if (err){
			return callback(err);
		}
		collection.insert(item,{safe:true},function(err,item){
			checkwaitnumber();
		})
	})
})
};

DB.prototype.findandsend = function find(callback){
	mongo.connect(mongoUri,function(err,db){
	if (err){
		return callback(err);
	}
	db.collection('mailtofuture',function(err,collection){
		if (err){
			return callback(err);
		}
		collection.find().toArray(function(err, items) {
                check_and_sendemail(items);
             });
	})
})
};

DB.prototype.remove = function remove(callback){
	var item = {
		time:this.time,
		email:this.email,
		content:this.content,
	};
	mongo.connect(mongoUri,function(err,db){
	if (err){
		return callback(err);
	}
	db.collection('mailtofuture',function(err,collection){
		if (err){
			return callback(err);
		}
		collection.remove(item,{safe:true},function(err,item){
		})
	})
})
}

DB.prototype.getnumber = function getnumber(res){
	getwaitnumber(res,getalreadysend);
}

function getwaitnumber(res,callback){
	mongo.connect(mongoUri,function(err,db){
	if (err){
		return callback(err);
	}
	db.collection('recordnumber',function(err,collection){
		if (err){
			return callback(err);
		}
		collection.find({waitnumber:{$exists:true}}).toArray(function(err, items) {
                if (items.length == 0){
                	initfield("waitnumber");
                	callback(res,0);
                }
                else{
                	callback(res,items[0].waitnumber);
                }
             });
	})
})
}

function getalreadysend(res,thewaitnumber){
	mongo.connect(mongoUri,function(err,db){
	if (err){
		return callback(err);
	}
	db.collection('recordnumber',function(err,collection){
		if (err){
			return callback(err);
		}
		collection.find({alreadysend:{$exists:true}}).toArray(function(err, items) {
                if (items.length == 0){
                	initfield("alreadysend");
                	res.render('newemail',{"waitnumber":thewaitnumber,"alreadysend":0});
                }
                else{
                	res.render('newemail',{"waitnumber":thewaitnumber,"alreadysend":items[0].alreadysend});
                }
             });
	})
})
}

function checkwaitnumber(){
	mongo.connect(mongoUri,function(err,db){
	if (err){
		return callback(err);
	}
	db.collection('recordnumber',function(err,collection){
		if (err){
			return callback(err);
		}
		collection.find({waitnumber:{$exists:true}}).toArray(function(err, items) {
                if (items.length == 0){
                	initfield("waitnumber");
                }
                else{
                	updatefield("waitnumber",items[0].waitnumber);
                }
             });
	})
})
}

function initfield(somefield){
	mongo.connect(mongoUri,function(err,db){
	if (err){
		return callback(err);
	}
	db.collection('recordnumber',function(err,collection){
		if (err){
			return callback(err);
		}
		var inititem = {};
		inititem[somefield]=0;
		console.log(inititem);
		collection.insert(inititem,{safe:true},function(err,item){
		})
	})
})
}

function updatefield(somefield,nownumber){
	mongo.connect(mongoUri,function(err,db){
	if (err){
		return callback(err);
	}
	db.collection('recordnumber',function(err,collection){
		if (err){
			return callback(err);
		}
		var oldfield = {};
		oldfield[somefield] = nownumber;
		var newfield = {};
		newfield[somefield] = nownumber+1;
		collection.update(oldfield,newfield,function(err,item){
		})
	})
})
}

function check_and_sendemail(items){
	var today = new Date();
	var todayyear = today.getFullYear();
	var todaymonth = today.getMonth()+1;
	var todayday = today.getDate();
	for (var i=0;i<items.length;i++){
		var targetyear = items[i].time.substr(0,4);
		var targetmonth = items[i].time.substr(5,2);
		var targetday = items[i].time.substr(8,2);
		if (todayyear==targetyear && todaymonth==targetmonth && todayday==targetday){
			 var mailOptions = {
    to:items[i].email, // list of receivers
    subject: "来自过去的自己", // Subject line
    text:items[i].content, // plaintext body
}

smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
        return;
    }else{
        console.log("Message sent: " + response.message);
    }
    smtpTransport.close(); // shut down the connection pool, no more messages
});
	var needremove = new DB({
        time:items[i].time,
        email:items[i].email,
        content:items[i].content,
        });
	needremove.remove();
	mongo.connect(mongoUri,function(err,db){
	if (err){
		return callback(err);
	}
	db.collection('recordnumber',function(err,collection){
		if (err){
			return callback(err);
		}
		collection.find({alreadysend:{$exists:true}}).toArray(function(err, items) {
                if (items.length == 0){
                	initfield("alreadysend");
                }
                else{
                	updatefield("alreadysend",items[0].alreadysend);
                }
             });
	})
})
		};
	}
};