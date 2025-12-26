const mongoose = require('mongoose')
const Schema = mongoose.Schema

const staffSchema = new Schema({
    
    name : {
        type : String,
        required : true 
    },

    photo : {
        type : String,
        required : true
    },

   description : {
    type : String
   },

    role : {
        type : String,
        required : true 
    },

   

}, {timestamps : true})

module.exports = mongoose.model("Staff" , staffSchema)