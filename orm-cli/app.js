const express = require('express')
const bodyParser = require('body-parser')
// include routes
const productRoutes = require("./routes/product")
const studentRoutes = require("./routes/student")
const PORT = 8087
const app = express()

app.use(bodyParser.json())

app.use("/", productRoutes)
app.use("/", studentRoutes)

app.get("/", (req, res) => {

  res.status(200).json({
    status: 1,
    message: "Welcome to home page"
  })
})

app.listen(PORT, () => {
  console.log("Application is running");
})