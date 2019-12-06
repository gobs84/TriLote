const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const request = require('request');
var CronJob = require('cron').CronJob;
var cors = require('cors');
var mongoose = require('mongoose');
var config = require('./config/DB');

//	busca y conecta con la base de datos
  	var db = mongoose.connect(config.DB,function(err,response){
          if(err){console.log(err);}
          //else{console.log("connected: "+db,' + ',response);}
      });
        

const app = express();
app.use(cors())
//	llama a esta ruta
const api = require('./server/routes/scraping.js');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'src')));

// API location
app.use('/api', api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));

// Add cronjobs to update and save data
console.log('Adding cron jobs..');
new CronJob('0 38 15 * * 5', function() {
    console.log('Cron Job at : ' + new Date());
    request
        .get('http://localhost:'+port+'/api/scrap')
        .on('response', function(response) {
	    console.log("SCRAP at " + new Date());
	    console.log('code status SCRAP' + response.statusCode)
	    /*
	    request
		.get('http://localhost:'+port+'/api/saveapi')
		.on('response', function(saveresponse) {
		    console.log('code save status ' + saveresponse.statusCode)
		})	   
	    */
	})
}, null, true, 'America/La_Paz');

new CronJob('0 39 15 * * 5', function() {
    console.log('Cron Save Job at : ' + new Date());
    request
        .get('http://localhost:'+port+'/api/saveapi')
        .on('response', function(response) {
	    console.log("SAVE at " + new Date());
	    console.log('code status SAVE ' + response.statusCode)
	})
}, null, true, 'America/La_Paz');


