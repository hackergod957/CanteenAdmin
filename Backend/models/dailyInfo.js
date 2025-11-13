const Student = require('../models/student')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dailyInfoSchema = new mongoose.Schema({
    date : {
        type : Date,
        required: true 
    },

    studentsWhoAte : [{
        type : Schema.Types.ObjectId,
        ref : 'Student' 
    }],

    studentsWhoDidNotEat : [{
        type : Schema.Types.ObjectId,
        ref : 'Student' 
    }],

    totalEarning : {
        type : Number,
        default : 0
    }
})

module.exports = mongoose.model("DailyInfo" , dailyInfoSchema)