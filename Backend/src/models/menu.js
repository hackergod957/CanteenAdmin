const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MenuSchema = new Schema({
    date : {
        type : Date,
        required : true,
        unique: true
    },

    itemId  : {
        type : String,
        required: true
    },

    dishes : [{
        name : {
            type : String,
            required : true
        },

        image : {
            type : String
        },

        price : {
            type : Number,
            required : true
        }
    }],

    snacks : [{
        name : {
            type : String,
            required : true
        },

        image : {
            type : String
        },

        price : {
            type : Number,
            required : true
        }
    }],

    dessert : [{
        name : {
            type : String,
            required : true
        },

        image : {
            type : String
        },

        price : {
            type : Number,
            required : true
        }
    }],

})

module.exports = mongoose.model("Menu", MenuSchema)