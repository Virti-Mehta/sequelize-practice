const express = require("express");
const bodyParser = require("body-parser") 
const { Sequelize } = require("sequelize");
const appRoutes = require('./routes')

const app = express();

app.use(bodyParser.json())
const PORT = 8087;



app.use('/', appRoutes)
// listen request here
app.listen(PORT, () => {
  console.log("Application is running");
});
