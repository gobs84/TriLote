var mongoose = require('mongoose');
var otbSchema = mongoose.Schema({
   ID: Number,
   MUNICIPIO : String,
   DISTRITO : String,
   OTB : String,
   Lat : Number,
   Lng : Number
});

module.exports=mongoose.model('otb',otbSchema,'otb');