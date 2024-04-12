const express = require("express");
const { Sequelize } = require("sequelize");
const bodyParser = require("body-parser");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JwtConfig = require("./config/jwt-config");
const JwtMiddleware = require("./config/jwt-middleware")

const app = express();

const PORT = 8091;

app.use(bodyParser.json());

// database connection string
const sequelize = new Sequelize("orm_jwt", "root", "Root_v@28", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(function (success) {
    console.log("Success");
  })
  .catch(function (error) {
    console.log(error);
  });

// ddefine model
const User = sequelize.define(
  "tbl_users",
  {
    // parameters
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
  },
  {
    timestamps: false,
    modelName: "User", 
  }
);
User.sync();

// User profile data 
app.post("/profile", JwtMiddleware.checkToken, (req, res) => {
  res.status(200).json({
    status: 1,
    userdata: req.user,
    message: "Token value parsed",
  });
})

// validate token api
app.post("/validate", (req, res) => {
  // console.log(req.headers);
  let userToken = req.headers["authorization"]

  if(userToken){
    JWT.verify(userToken, jwtConfig.secret, (error, decoded) => {
      if(error) {
        res.status(500).json({
          status: 0,
          message: "Invalid Token",
          data: error
        });
      } else {
        res.status(200).json({
          status: 1,
          message: "Token is valid",
          data: decoded
        });
      }
    })
  } else {
    res.status(500).json({
      status: 0,
      message: "Please provide authentication token value",
    });
  }
})

// login user api
app.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let userToken = JWT.sign(
            {
              email: user.email,
              id: user.id,
            },
            JwtConfig.secret,
            {
              expiresIn: JwtConfig.expiresIn,
              notBefore: JwtConfig.notBefore,
              audience: JwtConfig.audience,
              issuer: JwtConfig.issuer,
              algorithm: JwtConfig.algorithm
            }
          );

          res.status(200).json({
            status: 1,
            message: "User logged in successfully",
            token: userToken,
          });
        } else {
          res.status(500).json({
            status: 0,
            message: "Password didn't match",
          });
        }
      } else {
        res.status(500).json({
          status: 0,
          message: "User not exists with this email address",
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
// register user api
app.post("/user", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = bcrypt.hashSync(req.body.password, 10);
  let status = req.body.status;

  User.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (user) {
        res.status(200).json({
          status: 0,
          message: "User already exists",
        });
      } else {
        User.create({
          name,
          email,
          password,
          status,
        })
          .then((response) => {
            res.status(200).json({
              status: 1,
              message: "User has been registered successfully",
            });
          })
          .catch((error) => {
            res.status(500).json({
              status: 0,
              data: error,
            });
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

// default welcome page route
app.get("/", (req, res) => {
  res.status(200).json({
    status: 1,
    message: "Welcome to the home page",
  });
});

app.listen(PORT, () => {
  console.log("Application is running");
});
