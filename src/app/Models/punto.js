var mongoose = require('mongoose');
var puntoSchema = mongoose.Schema({
   ID: Number,
   NOM_MUN : String,
   lat : Number,
   lng : Number
});
//module.exports=mongoose.model('Municipios',puntoSchema);

module.exports=mongoose.model('municipios',puntoSchema,'municipios');