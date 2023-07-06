// const { chownSync } = require("fs");
// const lodash = require("lodash");
const ip_model = require("./../../model/ip_model");
const attendance_model = require("./../../model/attendance_model");

function getSortData(data) {
  const sortedUnique = Object.values(data).sort((a, b) =>
    a.email.localeCompare(b.email)
  );

  return sortedUnique;
}
// async function getUniqueEmails(data) {
//   return await lodash.uniqBy(data, "email");
// }
function getTotalMinutes(total_time) {
  if (total_time != null) {
    const timeParts = total_time.split(":");
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes;
  } else return 0;
}

function updateIPTime(ip_time, totalMinutes) {
  const db_ip_time = parseInt(ip_time);
  const time = db_ip_time + totalMinutes;
  return time;
}

async function getData(_data) {
  const unique = {};
  const db_ips = await ip_model.find({});
  const attendance_data = getSortData(_data);
  await attendance_data.map((data) => {
    if (unique[data.email] == null) {
      unique[data.email] = {
        date: {},
      };
    }
    if (unique[data.email].date[data.date] == null)
      unique[data.email].date[data.date] = {
        virtualTime: 0,
        officeTime: 0,
        attendance: 0,
        ip: {},
      };
    if (unique[data.email].date[data.date].ip[data.ip_address] == null)
      unique[data.email].date[data.date].ip[data.ip_address] = {
        ip: data.ip_address,
        total_time: 0,
      };
    //////////////////////
    let totalMinutes = getTotalMinutes(data.total_time);
    ///////////////
    const existIp = db_ips.find((item) => {
      if (item.ip == data.ip_address) return true;
    });
    if (existIp)
      unique[data.email].date[data.date].officeTime =
        parseInt(unique[data.email].date[data.date].officeTime) +
        parseInt(totalMinutes);
    else
      unique[data.email].date[data.date].virtualTime =
        parseInt(unique[data.email].date[data.date].virtualTime) +
        parseInt(totalMinutes);

    ////////////////////////
    unique[data.email].date[data.date].ip[data.ip_address].total_time =
      updateIPTime(
        unique[data.email].date[data.date].ip[data.ip_address].total_time,
        totalMinutes
      );

    //////////////// CALCULATE ATTENDANCE
    const totaltime =
      parseInt(unique[data.email].date[data.date].officeTime) +
      parseInt(unique[data.email].date[data.date].virtualTime);
    // console.log(totaltime, parseInt(process.env.HOURS) * 60);
    if (totaltime >= process.env.HOURS * 60) {
      // console.log("yes");
      if (
        unique[data.email].date[data.date].officeTime <
        process.env.ABSENT_HOUR * 60
      )
        unique[data.email].date[data.date].attendance = "ABSENT";
      else if (
        unique[data.email].date[data.date].officeTime <
        process.env.HALF_DAY_HOUR * 60
      )
        unique[data.email].date[data.date].attendance = "HALF DAY";
      else unique[data.email].date[data.date].attendance = "PRESENT";
    } else unique[data.email].date[data.date].attendance = "ABSENT";
  });

  try {
    const storeFlag = await updateDataInDataBase(unique);
    if (storeFlag) return unique;
    else return false;
  } catch (err) {
    console.log("error in save", err);
    return false;
  }
  // const sortedData=getSortData(unique)
  //   return sortedData;
}
// async function updateDataInDataBase(data) {
//   try {
//     const document = new attendance_model(data);
//     document.date=data.date
//     const savedDocument = await document.save();
//     return true; // Data saved successfully
//   } catch (error) {
//     console.error("Error in save", error);
//     return false; // Error occurred while saving data
//   }
// }

const updateDataInDataBase = async (employee) => {
  for (var email in employee) {
    const employee_attendance_model = new attendance_model();
    console.log("////////////////////////////////////////");
    if (employee.hasOwnProperty(email)) {
      var user = employee[email];
      var e_id = 0;
      for (var date in user.date) {
        if (user.date.hasOwnProperty(date)) {
          var attendanceData = user.date[date];
          employee_attendance_model.email = email;
          employee_attendance_model.date[e_id] = user.date[date];
          employee_attendance_model.date[e_id].date = date;

          employee_attendance_model.date[e_id].ip = []; // Create an empty array to store ipData values
          var ip_id = 0;
          for (var ip in attendanceData.ip) {
            if (attendanceData.ip.hasOwnProperty(ip)) {
              var ipData = attendanceData.ip[ip];
              employee_attendance_model.date[e_id].ip[ip_id] = ipData;
              ip_id++;
            }
          }

          e_id++;
        }
      }
      await employee_attendance_model.save({});
    }
  }

  return true;
};

const getTimeAccordingToIP = async (req, res) => {
  try {
    const response = await fetch(
      req.body.dataApi
    );
    const attendance_data = await response.json();
    // const attendance_data=require('./../../task/data/data.json')
    // const data = await attendance_data.attendance_data;
    const data = await attendance_data.data;
    const result = await getData(data);
    if (result == false) {
      res.status(500).send("Data not saved in the database");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    res.status(400).send({ Error: err });
    console.log(err);
  }
};

module.exports = { getTimeAccordingToIP };
