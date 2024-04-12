module.exports={
  secret: "secretkey",
  expiresIn: 120, // valid for 2 minute
  notBefore: 2, // for 2 second
  audience: "site-users",
  issuer: "virti",
  algorithm: "HS256"
}