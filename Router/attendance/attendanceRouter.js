const router = require("express").Router();
const { getTimeAccordingToIP } = require("./../../controller/attendance/attendanceController");

router.get("/", getTimeAccordingToIP);


module.exports=router ;
