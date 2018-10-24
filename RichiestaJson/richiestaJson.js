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
var schedule = require('node-schedule');
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
			var i;
			for(i = 0; i< json.length && json[i].nome_abbr != "PS_Giud" ; i++);
			//console.log(json[i].nome_abbr);
			//console.log(json[i].valore); 
						  console.log("attibuisco i permessi");

			app.use(function(req, res, next) {
				res.header("Access-Control-Allow-Origin", "*");
				res.header("Access-Control-Allow-Headers", "Accept, Content-Type, If-None-Match, X-If-None-Match");
				res.header("Access-Control-Expose-Headers", "Location, Warning, Etag");
				res.header("Access-Control-Allow-Headers", "Content-Type, If-None-Match, X-If-None-Match, Authorization");
				res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
				
				next();
			});
			
			app.get('/valore', function(req, res, next){
			  res.json({ livello: json[i].valore }); 
			  console.log("ricarico dal server");
			});		
		}
	});
}
app.listen(3000);

 let startTime = new Date(Date.now());
let endTime = new Date(startTime.getTime() + 600000);
var j = schedule.scheduleJob({ start: startTime, end: endTime, rule: '* * * * *' }, function(){
			  console.log("Ricarica");

  ricarica();
});
