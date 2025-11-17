const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MenuSchema = new Schema({
    date : {
        type : Date,
        required : true
    },

    itemId  : {
        type : String,
        required: true
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
    }],

})

module.exports = mongoose.model("Menu", MenuSchema)