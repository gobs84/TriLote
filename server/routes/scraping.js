var fetch = require("node-fetch");
var fs = require('fs');
var Parser = require('simple-text-parser');
var parser = new Parser();
var turf = require('@turf/turf')
const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
var config = require('../../config/DB');

//	busca y conecta con la base de datos
var db = mongoose.connect(config.DB, function (err, response) {
    if (err) { console.log(err); }
    else { console.log("connected: " + db, ' + ', response); }
});

//archivo donde se escribira toda la data obtenida de la pagina
var archivo = "datospagina.txt";
var information = [];
//=======   PARSER: requiere de ciertas reglas con expresiones regulares para obtener la informacion especifica 
//=======           dentro todos los datos que nos devuelve la pagina
//Reglas para extraer los datos de latitud y longitud
parser.addRule(/\{"latitude":([\S]+),"l/ig, function (tag, data_txt) {
    return { latitud: data_txt };
});
parser.addRule(/\ongitude":([\S]+),"m/ig, function (tag, data_txt) {
    return { longitud: data_txt };
});
//Reglas para obtener los links de los pins, profundizar
/*parser.addRule(/\href="([\S]+)">/ig, function(tag, data_txt) {
	var link = "https://clasificados.lostiempos.com" + data_txt;
	return {link: link};
});*/
parser.addRule(/\$us ([\d]+)/ig, function (tag, data_txt) {
    return { precio: data_txt };
});
//Reglas para obtener si es casa,departamento, lote
parser.addRule(/\Ca([\S]+)a /ig, function (tag, data_txt) {
    var seccion = "casa";
    return { seccion: seccion };
});
parser.addRule(/\Depa([\S]+)ento /ig, function (tag, data_txt) {
    var seccion = "departamento";
    return { seccion: seccion };
});
parser.addRule(/\Lo([\S]+)e /ig, function (tag, data_txt) {
    var seccion = "lote";
    return { seccion: seccion };
});
parser.addRule(/\Local Come([\S]+)ial/ig, function (tag, data_txt) {
    var seccion = "local_comercial";
    return { seccion: seccion };
});
//reglas para obtener si es venta, alquiler o anticretico
parser.addRule(/\- Alqui([\S]+)er/ig, function (tag, data_txt) {
    var tipo = "alquiler";
    return { tipo: tipo };
});
parser.addRule(/\- Ve([\S]+)ta/ig, function (tag, data_txt) {
    var tipo = "venta";
    return { tipo: tipo };
});
parser.addRule(/\- Anti([\S]+)co/ig, function (tag, data_txt) {
    var tipo = "anticretico";
    return { tipo: tipo };
});

var municipios = [];
var distritos = [];
var otbs = [];

function verificar(lat, long, tipo) {
    var dato = [];
    if (tipo == 1) { dato = municipios; }
    else if (tipo == 2) { dato = distritos }
    else if (tipo == 3) { dato = otbs }
    else { return '' }
    for (let municipio of dato) {
        var pt = turf.point([lat, long]);
        var poly = turf.polygon([municipio.puntos]);
        if (turf.booleanPointInPolygon(pt, poly)) {
            return municipio.nombre;
        }
    }
    return '';
}

function llenar(post, x) {
    if (x == 1) {
        municipios = [];
    }
    else if (x == 2) {
        distritos = [];
    }
    else if (x == 3) {
        otbs = [];
    }
    else { return; }
    var datosmun = post;
    datosmun.sort((n1, n2) => n1.ID - n2.ID);
    var count = -1;
    var nombre = "";
    if (x == 1) {
        for (let dato of datosmun) {
            if (dato.NOM_MUN === nombre) {
                municipios[count].puntos.push([dato.lng, dato.lat])
            } else {
                count++;
                nombre = dato.NOM_MUN;
                municipios.push({
                    nombre: dato.NOM_MUN,
                    puntos: [[dato.lng, dato.lat]]
                });
            }
        }
        for (let municipio of municipios) {
            municipio.puntos.push(municipio.puntos[0]);
        }
    } else if (x == 2) {
        for (let dato of datosmun) {
            if (dato.Nomb_dist === nombre) {
                distritos[count].puntos.push([dato.LNG, dato.LAT])
            } else {
                count++;
                nombre = dato.Nomb_dist;
                distritos.push({
                    nombre: dato.Nomb_dist,
                    puntos: [[dato.LNG, dato.LAT]]
                });
            }
        }
        for (let distrito of distritos) {
            distrito.puntos.push(distrito.puntos[0]);
        }
    } else if (x == 3) {
        for (let dato of datosmun) {
            if (dato.OTB === nombre) {
                otbs[count].puntos.push([dato.Lng, dato.Lat])
            } else {
                count++;
                nombre = dato.OTB;
                otbs.push({
                    nombre: dato.OTB,
                    puntos: [[dato.Lng, dato.Lat]]
                });
            }
        }
        for (let otb of otbs) {
            otb.puntos.push(otb.puntos[0]);
        }
    }
}

function scrap() {
    const requesturl = "https://clasificados.lostiempos.com/inmuebles-mapa";

    fetch(requesturl)   //obtenemos la informacion de la pagina requerida
        .then(response => response.text())  //especificamos el formato de la respuesta
        .then(body => fs.writeFile(archivo, body,   //cargamos la informacion y se almacena en la variable 'body'
            (err) => {  //en caso de haber algun error se almacena en la variable 'err'
                if (err) throw err; //  si el error existe, se lanza por encima de todo
                var re = /\,"markers"(\W+\w+)*/g;   //nos creamos una expresion regular para poder obtener la informacion a partir de los markers
                var firstPartition = body.match(re);    //aplicamos la expresion regular ala variable body y almacenamos la respuesta en la variable
                var miArray = parser.toTree(firstPartition[0]); //ahora aplicamos el parseo con la reglas previamente cargadas(las de arriba/addRule..)
                console.log("Se guardo el archivo correctamente");  //mensaje de aviso
                var punto = require('../../src/app/Models/punto.js');
                punto.find(function (err, post1) {
                    if (err) return err;
                    else {
                        var punto2 = require('../../src/app/Models/distrito.js');
                        punto2.find(function (err2, post2) {
                            if (err2) return err2;
                            else {
                                var punto3 = require('../../src/app/Models/otb.js');
                                punto3.find(function (err3, post3) {
                                    if (err3) return err3;
                                    else {
                                        llenar(post1, 1);
                                        llenar(post2, 2);
                                        llenar(post3, 3)
                                        var lat, long, pre, sec, tip, mun, dist, otb;   // variables para cargar datos de interes, latitud, longitud, precio, seccion, tipo
                                        for (let item of miArray) {  //iteramos cobre la respuesta, y todos los json que no posean el campo texto, son los que nos interesan
                                            if (!item.text) {
                                                if (item.latitud) {
                                                    lat = item.latitud;
                                                }
                                                if (item.longitud) {
                                                    long = item.longitud;
                                                }
                                                if (item.precio) {
                                                    pre = item.precio;
                                                }
                                                if (item.seccion) {
                                                    sec = item.seccion;
                                                }
                                                if (item.tipo) {
                                                    tip = item.tipo;
                                                    mun = verificar(Number(lat), Number(long), 1);
                                                    dist = verificar(Number(lat), Number(long), 2);
                                                    otb = verificar(Number(lat), Number(long), 3);
                                                    information.push({          //en este punto nuestras 5 variables de interes ya estaran cargadas, entonces 
                                                        latitud: Number(lat),   //cargamos nuetro arreglo 'information' con un nuevo objeto con las caracteristicas de las 5 variables
                                                        longitud: Number(long),
                                                        precio: Number(pre),
                                                        seccion: sec,
                                                        tipo: tip,
                                                        municipio: mun,
                                                        distrito: dist,
                                                        otb: otb
                                                    });
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            })
        );
}

function saveData(){
    information.forEach(element => {
        var dt = new Date;
        var Aviso = require('../../src/app/Models/aviso.js');
        var aviso = new Aviso({
            latitud : element.latitud,
            longitud : element.longitud,
            precio: element.precio,
            seccion : element.seccion,
            tipo : element.tipo,
            municipio : element.municipio,
            distrito : element.distrito,
            otb: element.otb,
            dia : dt.getDate(),
            mes : (dt.getMonth()+1),
            year : dt.getFullYear()
        });
        aviso.save();
    });
}
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

router.get('/saveapi', (req, res) => {
    saveData();
    res.json('guardando datos');
});

router.get('/scrap', (req, res) => {
    scrap();
    //verificarMun(1,2)
    response.data = ['correcto'];
    res.json(response);

});

router.get('/municipios', (req, res) => {
    var usuario = require('../../src/app/Models/punto.js');
    usuario.find(function (err, post) {
        if (err) return;
        else {
            res.json(post);
        }
    });

});

router.get('/municipios/:municipio', (req, res) => {
    var mun = require('../../src/app/Models/punto.js');
    mun.find({'MUNICIPIO': req.params.municipio},function(err,post){
        if(err)return;
        else{
            res.json(post);
        }
    });
});

router.get('/distritos', (req, res) => {
    var usuario = require('../../src/app/Models/distrito.js');
    usuario.find(function (err, post) {
        if (err) return;
        else {
            res.json(post);
        }
    });

});

router.get('/distritos/:distrito', (req, res) => {
    var dist = require('../../src/app/Models/distrito.js');
    dist.find({'Nomb_dist':req.params.distrito},function (err, post) {
      if (err) return;
        else {
            res.json(post);
        }
    });
  });

router.get('/otbs', (req, res) => {
    var usuario = require('../../src/app/Models/otb.js');
    usuario.find(function (err, post) {
        if (err) return;
        else {
            res.json(post);
        }
    });
});

router.get('/avisos', (req, res) => {
    var aviso = require('../../src/app/Models/aviso.js');
    aviso.find(function (err, post) {
        if (err) return;
        else {
            res.json(post);
        }
    });
});

router.get('/avisos/:mes', (req, res) => {
    var aviso = require('../../src/app/Models/aviso.js');
    aviso.find({'mes':req.params.mes},function (err, post) {
        if (err) return;
        else {
            res.json(post);
        }
    });
});

router.get('/avisos/year/:year/', (req, res) => {
    var aviso = require('../../src/app/Models/aviso.js');
    aviso.find({'year':req.params.year},function (err, post) {
        if (err) return;
        else {
            res.json(post);
        }
    });
});

router.get('/avisos/mes/:year/:mes', (req, res) => {
    var aviso = require('../../src/app/Models/aviso.js');
    aviso.find({'year':req.params.year,'mes':req.params.mes},function (err, post) {
        if (err) return;
        else {
            res.json(post);
        }
    });
});

router.get('/avisos/dia/:year/:mes/:dia', (req, res) => {
    var aviso = require('../../src/app/Models/aviso.js');
    aviso.find({'mes':req.params.mes,'dia':req.params.dia},function (err, post) {
        if (err) return;
        else {
            res.json(post);
        }
    });
});

router.get('/avisos/range/:year1/:mes1/:year2/:mes2', (req, res) => {
    var aviso = require('../../src/app/Models/aviso.js');
    aviso.find({'year':{'$gt':(req.params.year1-1),'$lt':(req.params.year2+1)},'mes':{'$gt':(req.params.mes1-1),'$lt':(req.params.mes2+1)}},function (err, post) {
        if (err) return;
        else {
            res.json(post);
        }
    });
});
//  esto permite q el serve pueda hacer uso del servicio generado
module.exports = router;
