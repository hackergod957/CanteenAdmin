const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studentSchema = new Schema({
    studentId : {
        type : String,
        required : true
    },
    
    name : {
        type : String,
        required : true 
    },

    classLevel : {
        type : String,
        required : true 
    },

    balance : {
        type : Number,
        min : 0 ,
        required : true 
    },

    role : {
        type : String,
        enum : ["Dayboarder" , "Monthly" , "Normal"],
        required : true 
    },

    hasEatenToday : {
        type : Boolean,
        required : true,
        default : false
    },

    lastEatenDate : {
        type : Date,
    }

}, {timestamps : true})

module.exports = mongoose.model("Student" , studentSchema)