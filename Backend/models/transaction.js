const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Student = require("./student");
const DailyInfo = require("./dailyInfo");

const transactionSchema = new mongoose.Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },

    dailyInfo: {
      type: Schema.Types.ObjectId,
      ref: "DailyInfo",
    },

    items: [
      {
        itemName: {
          type: String,
          required: true,
        },

        itemType: {
          type: String,
          enum: ["Dish", "Snack", "Dessert"],
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },

    status : {
      type: String,
      enum : ["completed","failed","refunded"]
    },

    date: {
      type : Date,
      default: Date.now
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
