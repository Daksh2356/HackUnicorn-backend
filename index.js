const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("./models/user.model");
const app = express();
const port = 4000;

// app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://hack-unicorn.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type');
  next();
});

app.use(cors({origin: ['http://localhost:3000', 'https://hack-unicorn.vercel.app/']}));
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1/hackunicorn-project")
  .catch((err) => {
    console.log(err);
  })
  .then(() => {
    console.log("Connected to DB");
  });

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    const newPassword = await bcryptjs.hash(req.body.password, 10);
    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: newPassword,
      accno: req.body.accno,
      address: req.body.address,
      accountBalance: req.body.accountBalance,
      recentTransactions: req.body.recentTransactions,
    });
    return res.json({ status: "Ok!" });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      error: "Duplicate mail/ User already exists!!",
    });
  }
});

app.post("/api/login", async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', 'https://hack-unicorn.vercel.app');
  
  console.log(req.body);
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) return { status: "error", error: "Invalid login" };

  const isValidPassword = await bcryptjs.compare(
    req.body.password,
    user.password
  );
  if (isValidPassword) {
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      "secret123"
    );
    return res.json({ status: "Ok!", user: token });
  } else {
    console.log("error");
    return res.json({
      status: "error",
      error: "Incorrect password entered!!",
      user: false,
    });
  }
});

app.get("/api/user", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({ status: "error", error: "Invalid email or password" });
    }

    // Return the user's data without the password
    const userData = {
      username: user.username,
      email: user.email,
      address: user.address,
      accno: user.accno,
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
  console.log("Server running successfully!");
});
