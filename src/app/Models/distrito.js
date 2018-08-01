var mongoose = require('mongoose');
var distSchema = mongoose.Schema({
   ID: Number,
   NOM_MUN : String,
   Nomb_dist : String,
   LAT : Number,
   LNG : Number
});

module.exports=mongoose.model('distritos',distSchema,'distritos');