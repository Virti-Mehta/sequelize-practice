const JWT = require("jsonwebtoken")
const jwtConfig = require("./jwt-config")

let validateToken = (req, res, next) => {

  let tokenValue = req.headers["authorization"]

  if(tokenValue) {
     
    JWT.verify(tokenValue,jwtConfig.secret, (error, data) => {
      if(error) {
        return res.status(500).json({
          status: 0,
          message: "Invalid token found"
        }) 
      } else {
        req.data = data
        next()
      }
    })
  } else {
    // no token passed in header
    return res.status(404).json({
      status: 0,
      message: "Token needed"
    })
  }
}

module.exports = {
  checkToken: validateToken
}