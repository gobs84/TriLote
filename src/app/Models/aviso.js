var mongoose = require('mongoose');
var avisoSchema = mongoose.Schema({
   latitud : Number,
   longitud : Number,
   precio: Number,
   seccion : String,
   tipo : String,
   municipio : String,
   distrito : String,
   otb: String,
   dia: Number,
   mes: Number,
   year: Number
});

module.exports=mongoose.model('avisos',avisoSchema,'avisos');