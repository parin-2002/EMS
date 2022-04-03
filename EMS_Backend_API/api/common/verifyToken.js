const jwt = require("jsonwebtoken");

function verifyCompanyToken(req, res, next) {
  // console.log(req.cookies);
  let token = req?.cookies?.jwttoken; //get cookie from request
  //let token = req.get("authorization"); //get token by auth
  if (token) {
    //token = token.slice(7); //get token by auth
    jwt.verify(token, process.env.COMPANYKEY, (err, decoded) => {
      if (err) {
        return res.status(400).json({ success: 0, message: "invalid token" });
      } else {
        // console.log(decoded);
        if (decoded.result.accounttype == "company") {
          req.decoded = decoded;
          next();
        } else {
          return res.status(400).json({
            success: 0,
            message: "Access Denied! Unauthorized User",
          });
        }
      }
    });
  } else {
    return res.status(400).json({
      success: 0,
      message: "Access Denied! Unauthorized User",
    });
  }
}

function verifyEmployeeToken(req, res, next) {
  // console.log(req.cookies);
  let token = req?.cookies?.jwttoken; //get cookie from request
  //let token = req.get("authorization"); //get token by auth
  if (token) {
    //token = token.slice(7); //get token by auth
    jwt.verify(token, process.env.EMPKEY, (err, decoded) => {
      if (err) {
        return res.status(400).json({ success: 0, message: "invalid token" });
      } else {
        // console.log(decoded);
        if (decoded.result.accounttype == "employee") {
          req.decoded = decoded;
          next();
        } else {
          return res.status(400).json({
            success: 0,
            message: "Access Denied! Unauthorized User",
          });
        }
      }
    });
  } else {
    return res.status(400).json({
      success: 0,
      message: "Access Denied! Unauthorized User",
    });
  }
}

module.exports = { verifyCompanyToken, verifyEmployeeToken };
