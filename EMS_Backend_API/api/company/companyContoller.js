const { companyregistations } = require("./companySchema");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { sendMail } = require("../mailSender/mailSender");
const { generatePassword } = require("../common/passwordGen");
const fs = require("fs");

/*if company register first time it will get an otp for registation and call 
verifyRegistation to verify. if email did not recieve or expire otp call resendOtp
if company update email same verification process goes on.
*/

//update token on profile of company update or change
async function sendNewtoken(req, res) {
  const result = await companyregistations.findOne({
    _id: req.decoded.result._id,
  });
  const token = sign(
    {
      result: {
        _id: result._id,
        name: result.name,
        email: result.email,
        accounttype: "company",
      },
    },
    process.env.COMPANYKEY,
    {
      expiresIn: "24h",
    }
  );
  res.cookie("jwttoken", token, {
    maxAge: 86_400_000,
    httpOnly: true,
  });
}

module.exports = {
  //company register
  async registerComapny(req, res) {
    try {
      if (
        req.body &&
        req.body.password &&
        req.body.name &&
        req.body.email &&
        req.body.numberOfemployees &&
        req.body.mobileno &&
        req.body.address &&
        req.body.aboutcompany
      ) {
        const salt = genSaltSync(10);
        req.body.password = hashSync(req.body.password, salt);
        const newCompany = new companyregistations({
          name: req.body.name,
          email: req.body.email,
          mobileno: req.body.mobileno,
          address: req.body.address,
          password: req.body.password,
          aboutcompany: req.body.aboutcompany,
          links: req.body.links,
          numberOfemployees: req.body.numberOfemployees,
        });
        const result = await newCompany.save();
        res.status(200).json({
          success: 1,
          result: result,
        });
        const otp = Math.floor(Math.random() * 90000) + 10000;
        sendMail(
          result.email,
          "EMS OTP SYSTEM",
          `OTP: ${otp}`,
          async (error, info) => {
            if (!error) {
              result.otptime =
                new Date().getTime() + Number(process.env.OTPTIME);
              result.otp = otp;
              await result.save();
            } else {
              throw new Error(info);
            }
          }
        );
      } else {
        throw new Error(
          "check out you have provided all this details or not name,email,mobileno,password,address,aboutcompany,numberOfemployees"
        );
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //company verifyOtp
  async verifyRegistation(req, res) {
    try {
      if (req.body && req.body.email && req.body.otp) {
        const result = await companyregistations.findOne({
          email: req.body.email,
        });
        if (!result) {
          throw new Error("Record not found");
        }
        if (new Date().getTime() < result.otptime) {
          if (req.body.otp == result.otp) {
            result.registationVerification = true;
            await result.save();
            res.status(200).json({
              success: 1,
              message: "Account verified successfully",
            });
          } else {
            throw new Error("OTP is wrong");
          }
        } else {
          throw new Error("OTP has been expired");
        }
      } else {
        throw new Error("email and otp require for verification");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //company resendOtp
  async resendOtp(req, res) {
    try {
      if (req.body && req.body.email) {
        const result = await companyregistations.findOne({
          email: req.body.email,
        });
        if (!result) {
          throw new Error("Record not found");
        }
        const otp = Math.floor(Math.random() * 90000) + 10000;
        sendMail(
          result.email,
          "EMS OTP SYSTEM",
          `OTP: ${otp}`,
          async (error, info) => {
            if (!error) {
              result.otptime =
                new Date().getTime() + Number(process.env.OTPTIME);
              result.otp = otp;
              await result.save();
            } else {
              throw new Error(info);
            }
          }
        );
        return res.status(200).json({
          success: 1,
          message: "New otp has been sent",
        });
      } else {
        throw new Error("email require for new otp");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //company login
  async companyLogin(req, res) {
    try {
      if (req.body && req.body.email && req.body.password) {
        const result = await companyregistations.findOne({
          email: req.body.email,
        });
        if (!result) {
          throw new Error("Email not registered");
        }
        if (result.registationVerification) {
          if (compareSync(req.body.password, result.password)) {
            res.status(200).json({
              success: 1,
              result: result,
            });
            const otp = Math.floor(Math.random() * 90000) + 10000;
            sendMail(
              result.email,
              "EMS OTP SYSTEM",
              `OTP: ${otp}`,
              async (error, info) => {
                if (!error) {
                  result.otptime =
                    new Date().getTime() + Number(process.env.OTPTIME);
                  result.otp = otp;
                  await result.save();
                } else {
                  throw new Error(info);
                }
              }
            );
          } else {
            throw new Error("Password is wrong");
          }
        } else {
          throw new Error("Account not varified");
        }
      } else {
        throw new Error("Email and Password require for verification");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //company login verify
  async loginVerify(req, res) {
    try {
      if (req.body && req.body.password && req.body.email && req.body.otp) {
        const result = await companyregistations.findOne({
          email: req.body.email,
        });
        if (!result) {
          throw new Error("Record not found");
        }
        if (result.registationVerification) {
          if (req.body.password == result.password) {
            if (new Date().getTime() < result.otptime) {
              if (req.body.otp == result.otp) {
                const token = sign(
                  {
                    result: {
                      _id: result._id,
                      name: result.name,
                      email: result.email,
                      accounttype: "company",
                    },
                  },
                  process.env.COMPANYKEY,
                  {
                    expiresIn: "24h",
                  }
                );
                res.cookie("jwttoken", token, {
                  maxAge: 86_400_000,
                  httpOnly: true,
                  //secure:true
                });
                return res.status(200).json({
                  success: 1,
                  result: result,
                  token: token,
                });
              } else {
                throw new Error("OTP is wrong");
              }
            } else {
              throw new Error("OTP has been expired");
            }
          } else {
            throw new Error("Password is wrong");
          }
        } else {
          throw new Error("Account not varified");
        }
      } else {
        throw new Error("email ,password, otp required");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //company forgot password
  async forgotPassword(req, res) {
    try {
      if (req.body.email && req.body) {
        const result = await companyregistations.findOne({
          email: req.body.email,
        });
        if (!result) {
          throw new Error("Record not found");
        }
        if (result.registationVerification) {
          let pass = generatePassword();
          sendMail(
            result.email,
            "EMS Forgot password",
            `New Password: ${pass}`,
            async (error, info) => {
              if (!error) {
                const salt = genSaltSync(10);
                pass = hashSync(pass, salt);
                result.password = pass;
                await result.save();
                return res.status(200).json({
                  success: 1,
                  message:
                    "New password has been sent to your email you can change it by visiting your profile",
                });
              } else {
                throw new Error(info);
              }
            }
          );
        } else {
          throw new Error("Your account is not verified");
        }
      } else {
        throw new Error("Email is required");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //select comapny details
  async selectCompanydetail(req, res) {
    try {
      const result = await companyregistations.findOne({
        _id: req.decoded.result._id,
        email: req.decoded.result.email,
        name: req.decoded.result.name,
      });
      if (!result) {
        throw new Error("record not found");
      }
      return res.status(200).json({
        success: 1,
        result: result,
      });
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //company editaccount
  async editAccount(req, res) {
    try {
      if (
        req.body &&
        req.body.name &&
        req.body.email &&
        req.body.mobileno &&
        req.body.address &&
        req.body.aboutcompany &&
        req.body.numberOfemployees
      ) {
        if (req.body.email.toLowerCase() === req.decoded.result.email) {
          const update = {
            name: req.body.name,
            email: req.body.email,
            mobileno: req.body.mobileno,
            address: req.body.address,
            aboutcompany: req.body.aboutcompany,
            links: req.body.links,
            numberOfemployees: req.body.numberOfemployees,
            updatedAt: new Date(),
          };
          // console.log(update);
          const result = await companyregistations.findByIdAndUpdate(
            req.decoded.result._id,
            update,
            { runValidators: true }
          );
          if (!result) {
            throw new Error("record not found");
          }
          await sendNewtoken(req, res);
          return res.status(200).json({
            success: 1,
            result: "updated",
          });
        } else {
          const otp = Math.floor(Math.random() * 90000) + 10000;
          const update = {
            name: req.body.name,
            email: req.body.email,
            mobileno: req.body.mobileno,
            address: req.body.address,
            aboutcompany: req.body.aboutcompany,
            links: req.body.links,
            numberOfemployees: req.body.numberOfemployees,
            updatedAt: new Date(),
            registationVerification: false,
            otp: otp,
            otptime: new Date().getTime() + Number(process.env.OTPTIME),
          };
          const result = await companyregistations.findByIdAndUpdate(
            req.decoded.result._id,
            update,
            { runValidators: true }
          );
          if (!result) {
            throw new Error("record not found");
          }
          sendMail(
            req.body.email,
            "EMS Re-verification",
            `OTP: ${otp}`,
            async (error, info) => {
              if (!error) {
                await sendNewtoken(req, res);
                return res.status(200).json({
                  success: 1,
                  result: "updated",
                });
              } else {
                throw new Error(info);
              }
            }
          );
        }
      } else {
        throw new Error(
          "check out you have provided all this details or not name,email,mobileno,password,address,aboutcompany,numberOfemployees"
        );
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //company password update
  async updatePassword(req, res) {
    try {
      if (req.body && req.body.oldpassword && req.body.newpassword) {
        const result = await companyregistations.findOne({
          _id: req.decoded.result._id,
          email: req.decoded.result.email,
          name: req.decoded.result.name,
        });
        if (!result) {
          throw new Error("record not found");
        }
        if (compareSync(req.body.oldpassword, result.password)) {
          const salt = genSaltSync(10);
          result.password = hashSync(req.body.newpassword, salt);
          await result.save();
          return res.status(200).json({
            success: 1,
            result: "password updated",
          });
        } else {
          throw new Error("oldPassword is wrong");
        }
      } else {
        throw new Error("oldPassword & newPassword required");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //updateicon
  async updateIcon(req, res) {
    try {
      if (req.file) {
        const result = await companyregistations.findOne({
          _id: req.decoded.result._id,
          email: req.decoded.result.email,
          name: req.decoded.result.name,
        });
        if (!result) {
          throw new Error("record not found");
        }
        //console.log(req.file.filename);
        result.icon = `http://localhost:3500/company/icon/${req.file.filename}`;
        await result.save();
        return res.status(200).json({
          success: 1,
          result: result.icon,
        });
      } else {
        throw new Error("file required");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
};
