const mongoose = require("mongoose");

const DuyuruSchema = new mongoose.Schema({
   
    baslik: {type:String,require: true},
    department: {type:String,require: true},
    bilgi:{type:String,require: true},
    date: {type:Date,default:Date.now,require: true}
    
});

module.exports = mongoose.model("Duyuru",DuyuruSchema);











