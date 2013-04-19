var dbctrl = require('./dbconnect');

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
			callback(err,item);
		})
	})
})
};