const mongoose = require("mongoose");

const PersonelSchema = new mongoose.Schema({
    name: {type:String,require: true},
    lastName: {type:String,require: true},
    gender: {type:String,require: true},
    birthDay: {type:String,require: true},
    department: {type:String,require: true},
    title: {type:String,require: true},
    phone:{type:String,require: true}
    
});

module.exports = mongoose.model("Personel",PersonelSchema);







