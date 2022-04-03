const companyRouter = require("express").Router();
const {
  registerComapny,
  companyLogin,
  verifyRegistation,
  resendOtp,
  loginVerify,
  forgotPassword,
  selectCompanydetail,
  editAccount,
  updatePassword,
  updateIcon,
} = require("./companyContoller");
const { verifyCompanyToken } = require("../common/verifyToken");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/company/icon");
  },
  filename: function (req, file, cb) {
    cb(null, `${req.decoded.result._id}`);
  },
});

const upload = multer({
  storage: storage,
});

companyRouter.post("/register", registerComapny); //done
companyRouter.post("/verifyRegistation", verifyRegistation); //done
companyRouter.post("/resendotp", resendOtp); //done
companyRouter.post("/login", companyLogin); ///done
companyRouter.post("/verifyLogin", loginVerify); //done
companyRouter.post("/forgotpassword", forgotPassword); //done
companyRouter.get(
  "/selectcompanydetail",
  verifyCompanyToken,
  selectCompanydetail
); //done
companyRouter.put("/editaccount", verifyCompanyToken, editAccount); //done
companyRouter.put("/updatepassword", verifyCompanyToken, updatePassword); //done
companyRouter.put(
  "/updateicon",
  verifyCompanyToken,
  upload.single("file"),
  updateIcon
); //done

module.exports = companyRouter;
