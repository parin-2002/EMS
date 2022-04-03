const {
  employees,
  attendance,
  events,
  leaves,
} = require("../manageEmp/employeeSchema");
const { companyregistations } = require("../../company/companySchema");
const { sign } = require("jsonwebtoken");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { generatePassword } = require("../../common/passwordGen");
const { sendMail } = require("../../mailSender/mailSender");

module.exports = {
  async empLogin(req, res) {
    try {
      if (req.body && req.body.email && req.body.password) {
        const result = await employees.findOne({
          email: req.body.email,
        });
        if (!result) {
          throw new Error("Email not registered");
        }
        if (compareSync(req.body.password, result.password)) {
          const token = sign(
            {
              result: {
                _id: result._id,
                fullname: result.fullname,
                email: result.email,
                companyId: result.companyId,
                accounttype: "employee",
              },
            },
            process.env.EMPKEY,
            {
              expiresIn: "24h",
            }
          );
          res.cookie("jwttoken", token, {
            maxAge: 86_400_000,
            httpOnly: true,
            //secure:true
          });
          return res.status(200).json({ success: 1, result: result });
        } else {
          throw new Error("Password is wrong");
        }
      } else {
        throw new Error("Email and password required");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async forgotPassword(req, res) {
    try {
      if (req.body && req.body.email) {
        const result = await employees.findOne({
          email: req.body.email,
        });
        if (!result) {
          throw new Error("Record not found");
        }
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
        throw new Error("Email is required");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async updatePassword(req, res) {
    try {
      if (req.body && req.body.oldpassword && req.body.newpassword) {
        const result = await employees.findOne({
          _id: req.decoded.result._id,
          email: req.decoded.result.email,
          companyId: req.decoded.result.companyId,
          fullname: req.decoded.result.fullname,
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
  async selectEmp(req, res) {
    try {
      const result = await employees.findOne({
        _id: req.decoded.result._id,
        email: req.decoded.result.email,
        fullname: req.decoded.result.fullname,
        companyId: req.decoded.result.companyId,
      });
      if (!result) {
        throw new Error("Record not found");
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
  async selectCompany(req, res) {
    try {
      const result = await companyregistations.findOne({
        _id: req.decoded.result.companyId,
      });
      if (!result) {
        throw new Error("Record not found");
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
  async selectEmpById(req, res) {
    try {
      if (req.query.id) {
        const result = await employees.findOne({
          _id: req.query.id,
        });
        if (!result) {
          throw new Error("Record not found");
        }
        return res.status(200).json({
          success: 1,
          result: result,
        });
      } else {
        throw new Error("id is required");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async updatePicture(req, res) {
    try {
      if (req.file) {
        const result = await employees.findOne({
          _id: req.decoded.result._id,
          email: req.decoded.result.email,
          fullname: req.decoded.result.fullname,
          companyId: req.decoded.result.companyId,
        });
        if (!result) {
          throw new Error("record not found");
        }
        //console.log(req.file.filename);
        result.profilepic = `http://localhost:3500/employee/${req.file.filename}`;
        await result.save();
        return res.status(200).json({
          success: 1,
          result: result.profilepic,
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
  }, //attendance
  async takeAttendance(req, res) {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      let result = await attendance
        .findOne({
          companyId: req.decoded.result.companyId,
          employeeId: req.decoded.result._id,
          statusEmp: true,
          // date: yesterday.setUTCHours(0, 0, 0, 0),
        })
        .sort({ created_at: -1 }); //
      if (!result?.statusEmp) {
        result = await attendance.findOne({
          companyId: req.decoded.result.companyId,
          employeeId: req.decoded.result._id,
          date: new Date().setUTCHours(0, 0, 0, 0),
        });
      }
      if (result) {
        if (result.statusEmp) {
          const endTime = new Date();
          const len = result.shiftyTakenByEmployee.length - 1;
          const startTime = result.shiftyTakenByEmployee[len].startTime;
          const totalMilliseconds =
            new Date(endTime).getTime() - new Date(startTime).getTime();
          const totalSeconds = Math.floor(totalMilliseconds / 1000);
          const totalMinutes = Math.floor(totalMilliseconds / 60000);
          result.statusEmp = false;
          result.shiftyTakenByEmployee[len] = {
            startTime: startTime,
            endTime: endTime,
            totalMilliseconds: totalMilliseconds,
            totalSeconds: totalSeconds,
            totalMinutes: totalMinutes,
          };
          await employees.findByIdAndUpdate(req.decoded.result._id, {
            statusEmpAttendance: false,
          });
          const upres = await result.save();
          if (upres) {
            return res.status(200).json({
              success: 1,
              result: `shift ended successfully. You worked from ${startTime} to ${endTime}`,
            });
          }
        } else {
          const startTime = new Date();
          result.statusEmp = true;
          result.shiftyTakenByEmployee.push({ startTime: startTime });
          await employees.findByIdAndUpdate(req.decoded.result._id, {
            statusEmpAttendance: true,
          });
          const upress = await result.save();
          if (upress) {
            return res.status(200).json({
              success: 1,
              result: `shift started successfully at ${startTime}`,
            });
          }
        }
      } else {
        const startTime = new Date();
        const takeattendance = new attendance({
          employeeId: req.decoded.result._id,
          companyId: req.decoded.result.companyId,
          date: new Date().setUTCHours(0, 0, 0, 0),
          statusEmp: true,
          shiftyTakenByEmployee: [{ startTime: startTime }],
        });
        await employees.findByIdAndUpdate(req.decoded.result._id, {
          statusEmpAttendance: true,
        });
        const add = await takeattendance.save();
        if (add) {
          return res.status(200).json({
            success: 1,
            result: `Shift strated successfully at ${startTime}`,
          });
        }
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async selectAttendance(req, res) {
    try {
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const result = await attendance.find({
        companyId: req.decoded.result.companyId,
        employeeId: req.decoded.result._id,
        date: {
          $gte: firstDay,
          $lte: lastDay,
        },
      });
      if (!result.length) {
        throw new Error("record not found");
      }
      if (result) {
        return res.status(200).json({
          success: 1,
          result: result,
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //events
  async addEvent(req, res) {
    try {
      if (
        req.body &&
        req.body.title &&
        req.body.start &&
        req.body.backgroundColor &&
        req.body.type
      ) {
        const event = new events({
          companyId: req.decoded.result.companyId,
          employeeId: req.decoded.result._id,
          title: req.body.title,
          start: req.body.start,
          end: req.body.end,
          allDay: req.body.allDay,
          url: req.body.url,
          type: req.body.type,
          backgroundColor: req.body.backgroundColor,
          borderColor: req.body.backgroundColor,
          isCompany: false,
        });
        const result = await event.save();
        if (result) {
          return res.status(200).json({
            success: 1,
            result: result,
          });
        }
      } else {
        throw new Error("Provide all details");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async selectEvent(req, res) {
    try {
      const result = await events.find({
        companyId: req.decoded.result.companyId,
        type: "public",
        employeeId: { $ne: req.decoded.result._id },
      });
      const result1 = await events.find({
        companyId: req.decoded.result.companyId,
        employeeId: req.decoded.result._id,
      });
      return res.status(200).json({
        success: 1,
        result: [...result, ...result1],
      });
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async deleteEvent(req, res) {
    try {
      if (req.query && req.query.id) {
        await events.findByIdAndDelete(req.query.id);
        return res.status(200).json({
          success: 1,
          result: "Event deleted successfully",
        });
      } else {
        throw new Error("Provide event id");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //leaves
  async addLeaveRequest(req, res) {
    try {
      if (
        req.body &&
        req.body.startDate &&
        req.body.endDate &&
        req.body.reason
      ) {
        const addRequest = new leaves({
          companyId: req.decoded.result.companyId,
          employeeId: req.decoded.result._id,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          halfDay: req.body.halfDay,
          fullDay: req.body.fullDay,
          reason: req.body.reason,
          status: "pending",
        });
        const result = await addRequest.save();
        if (result) {
          return res.status(200).json({
            success: 1,
            result: "Your request has been sent to company",
          });
        }
      } else {
        throw new Error("Provide all details");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async getLeaveRecords(req, res) {
    try {
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const result = await leaves.find({
        companyId: req.decoded.result.companyId,
        employeeId: req.decoded.result._id,
        startDate: {
          $gte: firstDay,
          $lte: lastDay,
        },
        endDate: {
          $gte: firstDay,
          $lte: lastDay,
        },
      });
      if (!result.length) {
        throw new Error("requests are not available");
      }
      if (result) {
        return res.status(200).json({
          success: 1,
          result: result,
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //salary details
  async getSalaryDetails(req, res) {
    try {
      if (req.body && req.body.calculate) {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const result = await attendance.find({
          companyId: req.decoded.result.companyId,
          employeeId: req.decoded.result._id,
          date: {
            $gte: firstDay,
            $lte: lastDay,
          },
        });
        if (!result.length) {
          throw new Error("records not found");
        }
        const empdata = result
          .filter((one) => {
            if (one[req.body.calculate].length != 0) {
              return one;
            }
          })
          .map((one) => {
            return one[req.body.calculate];
          })
          .flat();

        const totalMinutes = empdata.reduce((total, one) => {
          return one?.totalMinutes ? total + one.totalMinutes : total;
        }, 0);

        return res.status(200).json({
          success: 1,
          result: empdata,
          totalMinutes: totalMinutes,
        });
      } else {
        throw new Error("Provide all details");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
};
