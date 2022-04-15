const {
  designations,
  departments,
  employees,
  attendance,
  eventtypes,
  events,
  leaves,
} = require("./employeeSchema");
const mongoose = require("mongoose");
const { generatePassword } = require("../../common/passwordGen");
const { genSaltSync, hashSync } = require("bcrypt");
const { sendMail } = require("../../mailSender/mailSender");

module.exports = {
  //designation select,add,update,delete
  async selectDesignation(req, res) {
    try {
      const result = await designations.find({
        companyId: req.decoded.result._id,
      });
      if (!result.length) {
        throw new Error("please add designation");
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
  async addDesignation(req, res) {
    try {
      if (req.body && req.body.designation && req.body.description) {
        // console.log(req.decoded); token decoded
        const newDesignation = new designations({
          companyId: req.decoded.result._id,
          designation: req.body.designation,
          description: req.body.description,
        });
        const result = await newDesignation.save();
        return res.status(200).json({
          success: 1,
          result: result,
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
  async updateDesignation(req, res) {
    try {
      if (
        req.body &&
        req.body.id &&
        req.body.designation &&
        req.body.description
      ) {
        const update = {
          companyId: req.decoded.result._id,
          designation: req.body.designation,
          description: req.body.description,
        };
        await designations.findByIdAndUpdate(req.body.id, update);
        return res.status(200).json({
          success: 1,
          result: "updated",
        });
      } else {
        throw new Error(
          "designation id and updated designation description require"
        );
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async deleteDesignation(req, res) {
    try {
      if (req.query && req.query.id) {
        const check = await employees.findOne({ designation: req.query.id });
        if (check) {
          throw new Error(
            "There are some employees still have this designation !"
          );
        }
        const result = await designations.findByIdAndDelete(req.query.id);
        if (!result) {
          throw new Error("Data not found");
        }
        return res.status(200).json({
          success: 1,
          result: "deleted",
        });
      } else {
        throw new Error("designation id required");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //department slect,add,update,delete
  async selectDepartment(req, res) {
    try {
      const result = await departments.find({
        companyId: req.decoded.result._id,
      });
      if (!result.length) {
        throw new Error("please add department");
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
  async addDepartment(req, res) {
    try {
      if (req.body && req.body.department && req.body.description) {
        // console.log(req.decoded); token decoded
        const newDepartment = new departments({
          companyId: req.decoded.result._id,
          department: req.body.department,
          description: req.body.description,
        });
        const result = await newDepartment.save();
        return res.status(200).json({
          success: 1,
          result: result,
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
  async updateDepartment(req, res) {
    try {
      if (
        req.body &&
        req.body.id &&
        req.body.department &&
        req.body.description
      ) {
        const update = {
          companyId: req.decoded.result._id,
          department: req.body.department,
          description: req.body.description,
        };
        await departments.findByIdAndUpdate(req.body.id, update);
        return res.status(200).json({
          success: 1,
          result: "updated",
        });
      } else {
        throw new Error(
          "departmentname id and updated departmentname description require"
        );
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async deleteDepartment(req, res) {
    try {
      if (req.query && req.query.id) {
        const check = await employees.findOne({ department: req.query.id });
        if (check) {
          throw new Error("There are some employees in this department!");
        }
        const result = await departments.findByIdAndDelete(req.query.id);
        if (!result) {
          throw new Error("Data not found");
        }
        return res.status(200).json({
          success: 1,
          result: "Deleted",
        });
      } else {
        throw new Error("department id required");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //manage employee
  async addEmployee(req, res) {
    try {
      if (
        req.body &&
        req.body.fullname &&
        req.body.email &&
        req.body.mobileno &&
        req.body.address &&
        req.body.designation &&
        req.body.department &&
        // req.body.managerId &&
        req.body.study_info &&
        req.body.joiningDate &&
        req.body.gender
      ) {
        const salt = genSaltSync(10);
        const password = generatePassword();
        req.body.password = hashSync(password, salt);
        if (!req.body.managerId) {
          delete req.body.managerId;
          delete req.body.managerDepartment;
          delete req.body.managerDesignation;
        }
        const newEmp = new employees({
          companyId: req.decoded.result._id,
          fullname: req.body.fullname,
          email: req.body.email,
          mobileno: req.body.mobileno,
          address: req.body.address,
          designation: req.body.designation,
          department: req.body.department,
          managerId: req.body.managerId,
          workexperience: req.body.workexperience,
          workexp_where: req.body.workexp_where,
          study_info: req.body.study_info,
          remark: req.body.remark,
          otherDetail: req.body.otherDetail,
          joiningDate: new Date(req.body.joiningDate).setUTCHours(0, 0, 0, 0),
          password: req.body.password,
          hoursperday: req.body.hoursperday,
          workdaysinweek: req.body.workdaysinweek,
          hourlysalary: req.body.hourlysalary,
          currency: req.body.currency,
          managerDepartment: req.body.managerDepartment,
          managerDesignation: req.body.managerDesignation,
          gender: req.body.gender,
        });
        const result = await newEmp.save();
        if (result) {
          sendMail(
            result.email,
            "EMS Employee credential",
            `usenameORemail:${req.body.email}
           PASSWORD: ${password}`,
            async (error, info) => {
              if (!error) {
                return res.status(200).json({
                  success: 1,
                  result: result,
                });
              } else {
                throw new Error(info);
              }
            }
          );
        }
      } else {
        throw new Error("provide all require details");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async updateEmp(req, res) {
    try {
      if (
        req.body &&
        req.body.id &&
        req.body.fullname &&
        req.body.email &&
        req.body.mobileno &&
        req.body.address &&
        req.body.designation &&
        req.body.department &&
        // req.body.managerId &&
        req.body.study_info &&
        req.body.joiningDate &&
        req.body.gender
      ) {
        if (req.body.leavingDate) {
          const findmanager = await employees.findOne({
            managerId: req.body.id,
          });
          if (findmanager) {
            throw new Error(
              "Employee is Manager you need to replace manager than you can set leaving date"
            );
          }
        }
        if (!req.body.managerId) {
          delete req.body.managerId;
          delete req.body.managerDepartment;
          delete req.body.managerDesignation;
        }
        const update = {
          companyId: req.decoded.result._id,
          fullname: req.body.fullname,
          email: req.body.email,
          mobileno: req.body.mobileno,
          address: req.body.address,
          designation: req.body.designation,
          department: req.body.department,
          managerId: req.body.managerId,
          workexperience: req.body.workexperience,
          workexp_where: req.body.workexp_where,
          study_info: req.body.study_info,
          remark: req.body.remark,
          otherDetail: req.body.otherDetail,
          joiningDate: new Date(req.body.joiningDate).setUTCHours(0, 0, 0, 0),
          password: req.body.password,
          hoursperday: req.body.hoursperday,
          workdaysinweek: req.body.workdaysinweek,
          hourlysalary: req.body.hourlysalary,
          currency: req.body.currency,
          managerDepartment: req.body.managerDepartment,
          managerDesignation: req.body.managerDesignation,
          gender: req.body.gender,
          leavingDate: req.body.leavingDate
            ? new Date(req.body.leavingDate).setUTCHours(0, 0, 0, 0)
            : "",
          updatedAt: new Date(),
          updatedBy: req.decoded.result._id,
        };
        const result = await employees.findByIdAndUpdate(req.body.id, update);
        return res.status(200).json({
          success: 1,
          result: "Updated Successfully",
        });
      } else {
        throw new Error("Provide required details !");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async selectEmployees(req, res) {
    try {
      const result = await employees.find({
        companyId: req.decoded.result._id,
      });
      if (!result.length) {
        throw new Error("please add Employees");
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
  async changeManager(req, res) {
    try {
      if (
        req.body &&
        req.body.oldManager &&
        req.body.newManager &&
        req.body.oldManagerDepartment &&
        req.body.oldManagerDesignation &&
        req.body.newManagerDepartment &&
        req.body.newManagerDesignation
      ) {
        const result = await employees.updateMany(
          {
            managerId: req.body.oldManager,
            managerDepartment: req.body.oldManagerDepartment,
            managerDesignation: req.body.oldManagerDesignation,
          },
          {
            managerId: req.body.newManager,
            managerDepartment: req.body.newManagerDepartment,
            managerDesignation: req.body.newManagerDesignation,
          }
        );
        if (result) {
          return res.status(200).json({
            success: 1,
            result: "Manager replaced",
          });
        }
      } else {
        throw new Error("Provide required details");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //select employee by designation & department id
  async findEmp(req, res) {
    try {
      if (req.body) {
        const result = await employees.find({
          companyId: req.decoded.result._id,
          ...req.body,
          leavingDate: null,
        });
        if (!result.length) {
          throw new Error("Record not found");
        }
        return res.status(200).json({
          success: 1,
          result: result,
        });
      } else {
        throw new Error("provide required details");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //attendance
  async takeAttendance(req, res) {
    try {
      if (req.body && req.body.employeeId) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        let result = await attendance
          .findOne({
            employeeId: req.body.employeeId,
            companyId: req.decoded.result._id,
            statusCmp: true,
            // date: yesterday.setUTCHours(0, 0, 0, 0),
          })
          .sort({ created_at: -1 }); //
        if (!result?.statusCmp) {
          result = await attendance.findOne({
            employeeId: req.body.employeeId,
            companyId: req.decoded.result._id,
            date: new Date().setUTCHours(0, 0, 0, 0),
          });
        }
        if (result) {
          if (result.statusCmp) {
            const endTime = new Date();
            const len = result.shiftyTakenByCompany.length - 1;
            const startTime = result.shiftyTakenByCompany[len].startTime;
            const totalMilliseconds =
              new Date(endTime).getTime() - new Date(startTime).getTime();
            const totalSeconds = Math.floor(totalMilliseconds / 1000);
            const totalMinutes = Math.floor(totalMilliseconds / 60000);
            result.statusCmp = false;
            result.shiftyTakenByCompany[len] = {
              startTime: startTime,
              endTime: endTime,
              totalMilliseconds: totalMilliseconds,
              totalSeconds: totalSeconds,
              totalMinutes: totalMinutes,
            };
            await employees.findByIdAndUpdate(req.body.employeeId, {
              statusCmpAttendance: false,
            });
            const upres = await result.save();
            if (upres) {
              return res.status(200).json({
                success: 1,
                result: `shift ended successfully. Employee worked from ${startTime} to ${endTime}`,
              });
            }
          } else {
            const startTime = new Date();
            result.statusCmp = true;
            result.shiftyTakenByCompany.push({ startTime: startTime });
            await employees.findByIdAndUpdate(req.body.employeeId, {
              statusCmpAttendance: true,
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
            employeeId: req.body.employeeId,
            companyId: req.decoded.result._id,
            date: new Date().setUTCHours(0, 0, 0, 0),
            statusCmp: true,
            shiftyTakenByCompany: [{ startTime: startTime }],
          });
          await employees.findByIdAndUpdate(req.body.employeeId, {
            statusCmpAttendance: true,
          });
          const add = await takeattendance.save();
          if (add) {
            return res.status(200).json({
              success: 1,
              result: `Shift strated successfully at ${startTime}`,
            });
          }
        }
      } else {
        throw new Error("employeeId required");
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
      if (
        req.body &&
        req.body.firstdate &&
        req.body.seconddate &&
        req.body.employeeId
      ) {
        const result = await attendance.find({
          employeeId: req.body.employeeId,
          companyId: req.decoded.result._id,
          date: {
            $gte: new Date(req.body.firstdate).setUTCHours(0, 0, 0, 0),
            $lte: new Date(req.body.seconddate).setUTCHours(0, 0, 0, 0),
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
      } else {
        throw new Error("Provide filter dates");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async selectEmpByAttendance(req, res) {
    try {
      if (req.body.shiftBy && req.body) {
        let result = await employees.aggregate([
          {
            $match: {
              companyId: mongoose.Types.ObjectId(req.decoded.result._id),
              [req.body.shiftBy]: req.body.status,
              leavingDate: null,
            },
          },
          {
            $lookup: {
              from: "departments",
              localField: "department",
              foreignField: "_id",
              as: "department",
            },
          },
          {
            $unwind: "$department",
          },
          {
            $lookup: {
              from: "designations",
              localField: "designation",
              foreignField: "_id",
              as: "designation",
            },
          },
          {
            $unwind: "$designation",
          },
        ]);
        if (!result.length) {
          throw new Error("Records are not available");
        }
        if (result) {
          return res.status(200).json({
            success: 1,
            result: result,
          });
        }
      } else {
        throw new Error("Provide required details");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  //events
  async addEventType(req, res) {
    try {
      if (req.body && req.body.type && req.body.backgroundColor) {
        const type = new eventtypes({
          companyId: req.decoded.result._id,
          type: req.body.type,
          backgroundColor: req.body.backgroundColor,
        });
        const result = await type.save();
        if (result) {
          return res.status(200).json({
            success: 1,
            result: "Event type added successfully",
          });
        }
      } else {
        throw new Error("Provide All details");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async selectEventType(req, res) {
    try {
      const result = await eventtypes.find({
        companyId: req.decoded.result._id,
      });
      if (!result.length) {
        throw new Error("please add Event Types");
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
  async deleteEventType(req, res) {
    try {
      if (req.query && req.query.id) {
        await eventtypes.findByIdAndDelete(req.query.id);
        return res.status(200).json({
          success: 1,
          result: "Event type deleted successfully",
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
          companyId: req.decoded.result._id,
          title: req.body.title,
          start: req.body.start,
          end: req.body.end,
          allDay: req.body.allDay,
          url: req.body.url,
          type: req.body.type,
          backgroundColor: req.body.backgroundColor,
          borderColor: req.body.backgroundColor,
          isCompany: true,
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
  async selectEvents(req, res) {
    try {
      const result = await events.find({
        companyId: req.decoded.result._id,
        isCompany: true,
      });
      if (!result.length) {
        throw new Error("please add Events");
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
  async editEvent(req, res) {
    try {
      if (req.body && req.body.start && req.body.id) {
        const update = {
          start: req.body.start,
          end: req.body.end,
        };
        await events.findByIdAndUpdate(req.body.id, update);
        return res.status(200).json({
          success: 1,
          result: "updated",
        });
      } else {
        throw new Error("provide all details");
      }
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
  //leave
  async getLeaveRequest(req, res) {
    try {
      let result = await leaves.aggregate([
        {
          $match: {
            companyId: mongoose.Types.ObjectId(req.decoded.result._id),
            status: "pending",
          },
        },
        {
          $lookup: {
            from: "employees",
            localField: "employeeId",
            foreignField: "_id",
            as: "empdetail",
          },
        },
        {
          $unwind: "$empdetail",
        },
      ]);
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
  async changeLeaveStatus(req, res) {
    try {
      if (req.body && req.body.status && req.body.id) {
        await leaves.findByIdAndUpdate(
          req.body.id,
          {
            status: req.body.status,
          },
          {
            runValidators: true,
          }
        );
        sendMail(
          req.body.email,
          "Leave Inform",
          `your leave has been ${req.body.status}`,
          async (error, info) => {
            if (error) {
              throw new Error(info);
            }
          }
        );
        return res.status(200).json({
          success: 1,
          result: `Request ${req.body.status}`,
        });
      } else {
        throw new Error("provide details");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async selectLeaveRecords(req, res) {
    try {
      if (
        req.body &&
        req.body.email &&
        req.body.startDate &&
        req.body.endDate
      ) {
        const emp = await employees.findOne({ email: req.body.email });
        const result = await leaves.find({
          companyId: req.decoded.result._id,
          employeeId: emp._id,
          startDate: {
            $gte: new Date(req.body.startDate).setUTCHours(0, 0, 0, 0),
            $lte: new Date(req.body.endDate).setUTCHours(0, 0, 0, 0),
          },
          endDate: {
            $gte: new Date(req.body.startDate).setUTCHours(0, 0, 0, 0),
            $lte: new Date(req.body.endDate).setUTCHours(0, 0, 0, 0),
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
      } else {
        throw new Error("invalid input");
      }
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
  async empOnLeaveToday(req, res) {
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      let result = await leaves.aggregate([
        {
          $match: {
            companyId: mongoose.Types.ObjectId(req.decoded.result._id),
            startDate: { $lte: today },
            endDate: { $gte: today },
            status: { $nin: ["cancelled", "pending"] },
          },
        },
        {
          $lookup: {
            from: "employees",
            localField: "employeeId",
            foreignField: "_id",
            as: "empdetail",
          },
        },
        {
          $unwind: "$empdetail",
        },
      ]);

      if (!result.length) {
        throw new Error("Records not found");
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
  //salary
  async calculateTime(req, res) {
    try {
      if (
        req.body &&
        req.body.employeeId &&
        req.body.firstdate &&
        req.body.seconddate &&
        req.body.calculate
      ) {
        const result = await attendance.find({
          employeeId: req.body.employeeId,
          companyId: req.decoded.result._id,
          date: {
            $gte: new Date(req.body.firstdate).setUTCHours(0, 0, 0, 0),
            $lte: new Date(req.body.seconddate).setUTCHours(0, 0, 0, 0),
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

        if (!empdata.length) {
          throw new Error("records not found");
        }

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

  //dashboard
  async getStatistic(req, res) {
    try {
      const currentemp = await employees.find({
        companyId: req.decoded.result._id,
        leavingDate: null,
      });
      const leavedemp = await employees.find({
        companyId: req.decoded.result._id,
        leavingDate: { $ne: null },
      });
      const empstartedshift = await employees.find({
        companyId: req.decoded.result._id,
        statusEmpAttendance: true,
      });
      const emponleave = await leaves.find({
        companyId: req.decoded.result._id,
        endDate: { $gte: new Date().setUTCHours(0, 0, 0, 0) },
        status: { $nin: ["cancelled", "pending"] },
      });
      return res.status(200).json({
        success: 1,
        result: {
          currentemp: currentemp.length,
          leavedemp: leavedemp.length,
          empstartedshift: empstartedshift.length,
          emponleave: emponleave.length,
        },
      });
    } catch (err) {
      return res.status(400).json({
        success: 0,
        message: err.message,
      });
    }
  },
};
