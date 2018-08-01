var mongoose = require('mongoose');
var otbSchema = mongoose.Schema({
   ID: Number,
   MUNICIPIO : String,
   DISTRITO : String,
   OTB : String,
   ORIG_FID : Number,
   Lat : Number,
   Lng : Number
});

module.exports=mongoose.model('otb',otbSchema,'otb');