const express = require('express')
const studentModel = require('../models').Student;
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const jwtConfig = require("../config/jwt-config");
const jwtMiddleware = require("../config/jwt-middleware");

const Sequelize = require("sequelize");
const student = require('../models/student');

const Op = Sequelize.Op

const router = express.Router();

//profile api for student
router.post("/profile", jwtMiddleware.checkToken, (req, res) => {
  let student_id = req.data.id

  studentModel.findByPk(student_id).then((student) =>{
    if(student) {
      res.status(200).json({
        status: 1,
        message: "Profile data",
        data: student
      })
    }
  })
})

// login api for student
router.post("/login", (req, res) =>{
  studentModel.findOne({
    where: {
      email: {
        [Op.eq]: req.body.email
      }
    }
  }).then((student) => {
    if(student){
      let password = req.body.password;
      if(bcrypt.compareSync(password, student.password)){

        // generate token method
        let token = JWT.sign({
          id: student.id
        }, jwtConfig.secret, {
          expiresIn: jwtConfig.expiresIn,
          notBefore: jwtConfig.notBefore
        })
        res.status(200).json({
          status: 1,
          message: "Logged in successfully",
          token: token
        })
      } else {
        res.status(500).json({
          status: 0,
          message: "Password didn't match"
        })
      }
    } else{
      res.status(500).json({
        status: 0,
        message: "Student doesn't exist with this email"
      })
    }
  })
})

// create student api
router.post("/student", (req, res) => {
  
  studentModel.findOne({
    where: {
      email:{
        [Op.eq]: req.body.email
      }
    }
  }).then((user) => {
    if(user) {
      res.status(500).json({
        status: 0,
        message: "Student already exists with this email address"
      });
    } else {
      studentModel.create({
        name: req.body.name,
        email: req.body.email,
        roll_no: req.body.roll_no,
        password: bcrypt.hashSync(req.body.password, 10)
      }).then((user) => {
        res.status(200).json({
          status: 1,
          message: "Student created successfully"
        })
      })
    }
  })
})

module.exports = router;