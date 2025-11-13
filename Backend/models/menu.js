const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MenuSchema = new Schema({
    date : {
        type : Date,
        required : true
    },

    dishes : [{
        Name : {
            type : String,
            required : true
        },

        Image : {
            type : String
        },

        Price : {
            type : Number,
            required : true
        }
    }],

    snacks : [{
        Name : {
            type : String,
            required : true
        },

        Image : {
            type : String
        },

        Price : {
            type : Number,
            required : true
        }
    }],

    dessert : [{
        Name : {
            type : String,
            required : true
        },

        Image : {
            type : String
        },

        Price : {
            type : Number,
            required : true
        }
    }]
})