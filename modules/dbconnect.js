var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var setting = require('./settings');
module.exports = new Db('hello2',new Server(setting.host, setting.port, {auto_reconnect:true}),{safe:true});
