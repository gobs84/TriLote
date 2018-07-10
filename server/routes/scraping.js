var fetch = require("node-fetch");
var fs = require('fs');
var Parser = require('simple-text-parser');
var parser = new Parser();
const express = require('express');
const router = express.Router();

//archivo donde se escribira toda la data obtenida de la pagina
var archivo = "datospagina.txt";
var information = [];
//=======   PARSER: requiere de ciertas reglas con expresiones regulares para obtener la informacion especifica 
//=======           dentro todos los datos que nos devuelve la pagina
//Reglas para extraer los datos de latitud y longitud
parser.addRule(/\{"latitude":([\S]+),"l/ig,	function(tag, data_txt) {
	return {latitud: data_txt};
});
parser.addRule(/\ongitude":([\S]+),"m/ig, function(tag, data_txt) {
	return {longitud: data_txt};
});
//Reglas para obtener los links de los pins, profundizar
/*parser.addRule(/\href="([\S]+)">/ig, function(tag, data_txt) {
	var link = "https://clasificados.lostiempos.com" + data_txt;
	return {link: link};
});*/
parser.addRule(/\$us ([\d]+)/ig, function(tag, data_txt) {
	return {precio: data_txt};
});
//Reglas para obtener si es casa,departamento, lote
parser.addRule(/\Ca([\S]+)a /ig, function(tag, data_txt) {
	var seccion = "casa";
	return {seccion: seccion};
});
parser.addRule(/\Depa([\S]+)ento /ig, function(tag, data_txt) {
	var seccion = "departamento";
	return {seccion: seccion};
});
parser.addRule(/\Lo([\S]+)e /ig, function(tag, data_txt) {
	var seccion = "lote";
	return {seccion: seccion};
});
parser.addRule(/\Local Come([\S]+)ial/ig, function(tag, data_txt) {
	var seccion = "local_comercial";
	return {seccion: seccion};
});
//reglas para obtener si es venta, alquiler o anticretico
parser.addRule(/\- Alqui([\S]+)er/ig, function(tag, data_txt) {
	var tipo = "alquiler";
	return {tipo: tipo};
});
parser.addRule(/\- Ve([\S]+)ta/ig, function(tag, data_txt) {
	var tipo = "venta";
	return {tipo: tipo};
});
parser.addRule(/\- Anti([\S]+)co/ig, function(tag, data_txt) {
	var tipo = "anticretico";
	return {tipo: tipo};
});

const requesturl = "https://clasificados.lostiempos.com/inmuebles-mapa";

    fetch(requesturl)   //obtenemos la informacion de la pagina requerida
    .then(response => response.text())  //especificamos el formato de la respuesta
    .then(body  => fs.writeFile(archivo,body,   //cargamos la informacion y se almacena en la variable 'body'
        (err) => {  //en caso de haber algun error se almacena en la variable 'err'
        if (err) throw err; //  si el error existe, se lanza por encima de todo
        var re = /\,"markers"(\W+\w+)*/g;   //nos creamos una expresion regular para poder obtener la informacion a partir de los markers
        var firstPartition = body.match(re);    //aplicamos la expresion regular ala variable body y almacenamos la respuesta en la variable
        var miArray = parser.toTree(firstPartition[0]); //ahora aplicamos el parseo con la reglas previamente cargadas(las de arriba/addRule..)
            console.log("Se guardo el archivo correctamente");  //mensaje de aviso
            var lat, long, pre, sec, tip;   // variables para cargar datos de interes, latitud, longitud, precio, seccion, tipo
        for(let item of miArray) {  //iteramos cobre la respuesta, y todos los json que no posean el campo texto, son los que nos interesan
            if(!item.text) {
                if(item.latitud) {
                    lat = item.latitud;
                }
                if(item.longitud) {
                    long = item.longitud;
                }
                if(item.precio) {
                    pre = item.precio;
                }
                if(item.seccion) {
                    sec = item.seccion;
                }
                if(item.tipo) {
                    tip = item.tipo;
                    information.push({          //en este punto nuestras 5 variables de interes ya estaran cargadas, entonces 
                        latitud: Number(lat),   //cargamos nuetro arreglo 'information' con un nuevo objeto con las caracteristicas de las 5 variables
                        longitud: Number(long),
                        precio: Number(pre),
                        seccion: sec,
                        tipo: tip
                    });
                }
            }
        }
        console.log(information);   //imprimimos todo el arreglo de 'information', este contiene toda la informacion de los pines 
    })
    );

//});

// Error handling / Cuando hagamos la peticion de los datos al server, si ocurre algun error se lanza esta respuesta
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling / Cargamos el formato de respuesta estandar
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users / servicio generado por el server para poder acceder a los datos mediante el path
router.get('/users', (req, res) => {
   response.data = information;
                res.json(response);
				
			
});
//  esto permite q el serve pueda hacer uso del servicio generado
module.exports = router;
