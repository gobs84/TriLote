const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
var cors = require('cors');
/*var mongoose = require('mongoose');
var config = require('./config/DB');

//	busca y conecta con la base de datos
  	var db = mongoose.connect(config.DB,function(err,response){
          if(err){console.log(err);}
          //else{console.log("connected: "+db,' + ',response);}
      });
        
    
*/
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

/*var usuario = require('./src/app/Models/punto.js')
app.get('/p', function(req,res,next){
    usuario.find(function(err,post){
        if(err) return next(err);
        else{
            res.json(post);
        }
    });
 });*/

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));

/*var router = express.Router();
var punto = require('./src/app/Models/punto.js')
 router.get('/:ID', function(req,res,next){
    punto.findById(req.params.ID, function(err,post){
        if(err) return next(err);
        res.json(post);
    });
 });

 module.exports = router;*/