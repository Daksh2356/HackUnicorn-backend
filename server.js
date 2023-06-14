const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("./models/user.model");
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());


mongoose
  .connect("mongodb://127.0.0.1/hackunicorn-project")
  .catch((err) => {
    console.log(err);
  })
  .then(() => {
    console.log("Connected DB");
  });

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    const newPassword = await bcryptjs.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    return res.json({ status: "Ok!" });
  } 
  catch (error) {
    console.log(error);
    res.json({
      status: "error",
      error: "Duplicate mail/ User already exists !!",
    });
  }
}
);

app.post("/api/login", async (req, res) => {
  console.log(req.body);
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) return { status: "error", error: "Invalid login " };

  const isValidPassword = await bcryptjs.compare(
    req.body.password,
    user.password
  );
  if (isValidPassword) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret123"
    );
    return res.json({ status: "Ok!", user: token });
  } else {
    res.json({
      status: "error",
      error: "Incorrect password entered !!",
      user: false,
    });
  }
});

app.get("/api/user", async (req, res) => {
    const { email, password } = req.query;
  
    try {
      const user = await User.findOne({ email, password });
  
      if (!user) {
        return res.json({ status: "error", error: "Invalid email or password" });
      }
  
      // Return the user's data without the password
      const userData = {
        name: user.name,
        email: user.email,
        address: user.address,
        accountNumber: user.accountNumber,
        accountBalance: user.accountBalance,
        recentTransactions: user.recentTransactions,
      };
  
      return res.json({ status: "ok", user: userData });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: "An error occurred" });
    }
  });
  

app.listen(port, () => {
  console.log("Server ran successfully !!");
});
