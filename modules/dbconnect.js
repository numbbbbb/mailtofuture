var mongo = require('mongodb');
exports.mongo = mongo.Db;
//var Server = require('mongodb').Server;
//var setting = require('./settings');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||'mongodb://localhost:27017/mailtofuture';
exports.mongoUri = mongoUri;
//module.exports = new Db('mailtofuture',new Server(setting.host, setting.port, {auto_reconnect:true}),{safe:true});
