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
  const unique = {
    email:{}
  };
  const db_ips = await ip_model.find({});
  const attendance_data = getSortData(_data);
  await attendance_data.map((data) => {
    if (unique.email[data.email] == null) {
      unique.email[data.email] = {
        date: {},
      };
    }
    if (unique.email[data.email].date[data.date] == null)
      unique.email[data.email].date[data.date] = {
        email: data.email,
        virtualTime: 0,
        officeTime: 0,
        attendance: 0,
        ip: {},
      };
    if (unique.email[data.email].date[data.date].ip[data.ip_address] == null)
      unique.email[data.email].date[data.date].ip[data.ip_address] = {
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
      unique.email[data.email].date[data.date].officeTime =
        parseInt(unique.email[data.email].date[data.date].officeTime) +
        parseInt(totalMinutes);
    else
      unique.email[data.email].date[data.date].virtualTime =
        parseInt(unique.email[data.email].date[data.date].virtualTime) +
        parseInt(totalMinutes);

    ////////////////////////
    unique.email[data.email].date[data.date].ip[data.ip_address].total_time =
      updateIPTime(
        unique.email[data.email].date[data.date].ip[data.ip_address].total_time,
        totalMinutes
      );

    //////////////// CALCULATE ATTENDANCE
    const totaltime =
      parseInt(unique.email[data.email].date[data.date].officeTime) +
      parseInt(unique.email[data.email].date[data.date].virtualTime);
    // console.log(totaltime, parseInt(process.env.HOURS) * 60);
    if (totaltime >= process.env.HOURS * 60) {
      // console.log("yes");
      if (
        unique.email[data.email].date[data.date].officeTime <
        process.env.ABSENT_HOUR * 60
      )
        unique.email[data.email].date[data.date].attendance = "ABSENT";
      else if (
        unique.email[data.email].date[data.date].officeTime <
        process.env.HALF_DAY_HOUR * 60
      )
        unique.email[data.email].date[data.date].attendance = "HALF DAY";
      else unique.email[data.email].date[data.date].attendance = "PRESENT";
    } else unique.email[data.email].date[data.date].attendance = "ABSENT";
  });
  return unique;
  // const sortedData=getSortData(unique)
  //   return sortedData;
}

const getTimeAccordingToIP = async (req, res) => {
  try {
    const response = await fetch(
      "https://champagne-bandicoot-hem.cyclic.app/api/data"
    );
    const attendance_data = await response.json();
    // const attendance_data=require('./../../task/data/data.json')
    // const data = await attendance_data.attendance_data;
    const data = await attendance_data.data;
    const result = await getData(data);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ Error: err });
    console.log(err);
  }
};

module.exports = { getTimeAccordingToIP };
