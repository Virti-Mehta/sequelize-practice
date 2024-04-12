const express = require('express');
const { Sequelize } = require('../models');
const productModel = require("../models").Product;
const Op = Sequelize.Op;

const router = express.Router()

router.get("/products", (req, res) =>{

  productModel.findAll({
    /*attributes: ["id", "name"],
    limit: 10,
    offset: 4,
    order: [["name", "ASC"]]
    */
    where: {
      // id: {
      //   [Op.eq]: 516
      // }
      id: {
        [Op.between]: [516, 520]
      }
    }
  }).then((data) => {
    if(data) {
      res.status(200).json({
        status: 1,
        message: "Products found",
        data: data
      })
    } else{
      res.status(200).json({
        status: 1,
        message: "no products found"
      })
    }
  })

})

module.exports =router