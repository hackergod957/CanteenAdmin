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
          enum: ["Dish", "Snack", "Desert"],
        },

        price: {
          type: Number,
          required: true,
        },

        totalAmount: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema)