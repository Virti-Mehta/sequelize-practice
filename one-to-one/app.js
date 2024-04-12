const express = require("express");
const EmailModel = require("./models").Email;
const UserModel = require("./models").User;


const app = express()
const PORT = 8087

app.get("/emails", (req, res) => {
  EmailModel.findAll({
    include: {
      model: UserModel
    }
  }).then((data) => {
    res.status(200).json({
      status: 1,
      data: data
    })
  })
})

app.get("/users", (req, res) => {
  UserModel.findAll({
    include: {
      model: EmailModel
    }
  }).then((data) => {
    res.status(200).json({
      status: 1,
      data: data
    })
  })
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: 1,
    message: "Welcome to home page"
  })
})

app.listen(PORT, () =>{
  console.log("Application is running at" + PORT);
})