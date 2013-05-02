var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var setting = require('./settings');
module.exports = new Db('mailtofuture',new Server(setting.host, setting.port, {auto_reconnect:true}),{safe:true});
