"use strict";
exports.__esModule = true;
var http = require('http');
var fs = require('fs');
var readline = require('readline');
var url = require('url');
var querystring = require("querystring");
var express = require('express');
var cookieParser = require('cookie-parser')
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
var upload = multer({ storage: storage });

listen(8888);   //设置监听窗口

function listen(port) {
    var app = express();
    app.use(cookieParser());

    app.get('/save', function (req, res) {
        var objectUrl = url.parse(req.url);
        var q = querystring.parse(objectUrl.query);
        var content = decodeURIComponent(q['content']);
        var date = decodeURIComponent(q['date']);
       
       	fs.open('./data/content.txt', 'a', function(err, fd) {
   			if (err) {
       			return console.error(err);
   			}
   			fs.writeFile(fd,date + ' -> ' + content + ' \n ' + '**' + ' \n ',  function(err) {
   				if (err) {
       				return console.error(err);
   				}
    		});
   		});	
    	
    	res.send('Submit Successfully');
    });

    app.get('/reflesh', function (req, res) {       
    	readFileToArr('./data/content.txt',function(data){
    		res.send(data);
    	});
    });

    app.get('/', function (req, res) {
   	res.send('Hello World');
})

    app.get('/', function (req, res) {
      res.send('Hello World');
    });

    app.post('/uploadimg', upload.array('imgfile', 40), function(req, res, next) {
      var files = req.files
      console.log(files)
      if (!files[0]) {
        res.send('error');
      } 
      else {
        res.send('success');
      }
      console.log(files);
    });


    app.use(express.static('public'));
    
    var server = http.createServer(app);
    server.listen(port);
}

// 终端打印如下信息
console.log('Server running at http://39.106.238.162:8888/');

function readFileToArr(fReadName,callback){
    var fRead = fs.createReadStream(fReadName);
    var objReadline = readline.createInterface({
        input:fRead
    });
    var arr = new Array();
    objReadline.on('line',function (line) {
        arr.push(line);
        //console.log('line:'+ line);
    });
    objReadline.on('close',function () {
       // console.log(arr);
        callback(arr);
    });
}
