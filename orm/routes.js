const express = require("express");
const { Sequelize } = require("sequelize");

const router = express.Router();

// Connection with mySQL database
const sequelize = new Sequelize("node_orm", "root", "Root_v@28", {
  host: "localhost",
  dialect: "mysql",
});

// Check database connection
sequelize
  .authenticate()
  .then(function (success) {
    console.log("Success");
  })
  .catch(function (error) {
    console.log(error);
  });

const Model = Sequelize.Model;

class User extends Model {}

User.init(
  {
    // parameters
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
    },
    rollno: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.ENUM("1", "0"),
      defaultValue: "1",
    },
  },
  { 
    timestamps: false,
    modelName: "tbl_users",
    sequelize,
  }
);

// sync model
sequelize.sync();

router.post("/user", function (req, res) {
  /*User.create({
    name: 'Virti Mehta',
    email: 'vmehta@gmail.com',
    rollNo: 18,
    status: 1
  }).then((response) => {
    res.status(200).json({
      status: 1,
      message: 'User has been created successfully'
    })
  }).catch(function(error){
    console.log(error);
  })*/
  User.create(req.body)
    .then((response) => {
      res.status(200).json({
        status: 1,
        message: "User has been created",
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

// bulk create method
router.post("/bulk-user", function (req, res) {
  User.bulkCreate([
    {
      name: "User1",
      email: "user1@gmail.com",
      rollno: 51,
      status: 1,
    },
    {
      name: "User2",
      email: "user2@gmail.com",
      rollno: 52,
      status: 1,
    },
    {
      name: "User3",
      email: "user3@gmail.com",
      rollno: 53,
      status: 1,
    },
    {
      name: "User4",
      email: "user4@gmail.com",
      rollno: 54,
      status: 1,
    },
  ])
    .then((response) => {
      res.status(200).json({
        status: 1,
        message: "User has been created",
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

// get all users
router.get("/users", function (req, res) {
  User.findAll({
    where: {
      status: "0"
    }
  })
    .then((users) => {
      res.status(200).json({
        status: 1,
        message: "Users found",
        data: users,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

// Raw query to display data
router.get("/user-raw", (req, res) => {

  sequelize.query("SELECT * from tbl_users", {
    type: sequelize.QueryTypes.SELECT
  }) .then((users) => {
    res.status(200).json({
      status: 1,
      message: "Users found",
      data: users,
    });
  })
  .catch((error) => {
    console.log(error);
  });
})

// Raw query to update data
router.get("/user-update-raw", (req, res) => {

  sequelize.query(`UPDATE tbl_users SET name = '${req.body.name}', email = '${req.body.email}' WHERE id = ${req.body.id} `, {
    type: sequelize.QueryTypes.UPDATE
  }) .then((users) => {
    res.status(200).json({
      status: 1,
      message: "User updated succesfully",
    });
  })
  .catch((error) => {
    console.log(error);
  });
})

// Raw query to delete data
router.get("/user-delete-raw/:id", (req, res) => {

  sequelize.query(`DELETE from tbl_users WHERE id = ${req.params.id} `, {
    type: sequelize.QueryTypes.DELETE
  }) .then((users) => {
    res.status(200).json({
      status: 1,
      message: "User deleted succesfully",
    });
  })
  .catch((error) => {
    console.log(error);
  });
})

// delete api method
router.delete("/user/:id", (req, res) => {

  User.destroy({
    where: {
      id: req.params.id
    }
  }).then(data => {
    res.status(200).json({
      status: 1,
        message: "User has been deleted successfully"
    })
  }).catch(error => {
    res.status(500).json({
      status: 0,
      message:"Failed to delete user",
      data: error
    })
  })
})
// update api method
router.put("/user", (req, res) => {

  User.update({
    name: req.body.name,
    email: req.body.email,
    rollno: req.body.rollno
  }, {
    where:{
      id: req.body.id
    }
  }).then(response => {
    res.status(200).json({
      status: 1,
        message: "User has been updated successfully"
    })
  }).catch(error => {
    res.status(500).json({
      status: 0,
      message:"Failed to update user"
    })
  })
})
// default welcome page route
router.get("/", (req, res) => {
  res.status(200).json({
    status: 1,
    message: "Welcome to the home page",
  });
});

module.exports = router;
