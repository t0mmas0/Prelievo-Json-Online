/**
* richiestaJson.js è un applicazione nodejs 
* recupera un file json dal server specificato nell'url
* e lo rende disponiblie all'indirizzo dove è hostato il server Nodejs alla porta 3000
* 
* @version 1.0
* @since   11/10/2018
*/

var http = require('http');
var express = require('express');
var app = express();
var request = require('request');
var url = 'http://dati.venezia.it/sites/default/files/dataset/opendata/livello.json';
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('');
	
}).listen(8080); 

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function ricarica() {
	
	request.get(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			//console.log(json[11].nome_abbr);
			//console.log(json[11].valore); 
			
			app.use(function(req, res, next) {
				res.header("Access-Control-Allow-Origin", "*");
				res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
				next();
			});
			
			app.get('/valore', function(req, res){
			  res.json({ livello: json[11].valore }); 
			});		
		}
	});
}
app.listen(3000);

setInterval(function() {
  ricarica();
}, 600000);