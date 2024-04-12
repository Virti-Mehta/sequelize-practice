"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Student.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Name field should have a value",
          },
        },
      },
      roll_no: DataTypes.INTEGER,
      email: {
        type: DataTypes.STRING,
        validate: {
          min: {
            args: 1,
            msg: "Rollno should have a minimum value of 1",
          },
        },
      },
      password: DataTypes.STRING,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Student",
    }
  );
  return Student;
};
