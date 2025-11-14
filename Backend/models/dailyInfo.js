const student = require('../models/student')
const Student = require('../models/student')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dailyInfoSchema = new mongoose.Schema({
    date : {
        type : Date,
        required: true,
        default : Date.now
    },

    studentsWhoAte : [{
        type : Schema.Types.ObjectId,
        ref : 'Student'  ,
    }],

    studentsWhoDidNotEat : [{
        type : Schema.Types.ObjectId,
        ref : 'Student' ,
    }],

    totalEarning : {
        type : Number,
        default : 0
    }
},{timestamps : true})

module.exports = mongoose.model("DailyInfo" , dailyInfoSchema)