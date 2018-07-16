var mongoose = require('mongoose');
var puntoSchema = mongoose.Schema({
   ID: Number,
   MUNICIPIO : String,
   POINT_X : Number,
   POINT_Y : Number
});

var userSchema = mongoose.Schema({
    name: String,
    password : String
 });
 
//module.exports=mongoose.model('Municipios',puntoSchema);

module.exports=mongoose.model('Municipios',puntoSchema,'Municipios');