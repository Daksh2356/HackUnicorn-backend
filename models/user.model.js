const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    accno: { type: String, required: true },
    accountBalance: { type: Number },
    recentTransactions: [
      {
        type: { type: String, required: true },
        sender: { type: String, required: true },
        recipient: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: Date, required: true },
      },
    ],
  },
  { collection: "user-data" }
);


const model = mongoose.model("UserData", User);

module.exports = model;
