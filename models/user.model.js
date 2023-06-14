const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountBalance: Number,
    recentTransactions: [
      {
        date: Date,
        amount: Number,
        recipient: String,
        sender: String,
        type: String,
      },
    ],
  },
  { collection: "user-data" }
);

const model = mongoose.model("UserData", User);

module.exports = model;
