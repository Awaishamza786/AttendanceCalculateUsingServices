const router = require("express").Router();
const ip_router = require("./ip/ip_router");
const attendance_router = require("./attendance/attendanceRouter");

router.use("/attendance", attendance_router);
router.use("/ip", ip_router);

router.get("/", (req, res) => {
  res.status(200).send({
    saveAttandance: "localhost:8080/attendance            It will calculate attendace with time speration also", 
    showRegisteredIP: "localhost:8080/ip/showregistered    It will registered ips",
    saveIP: "localhost:8080/ip/save                        It will save ips by taking ip,floor from body",
  });
});

module.exports = router;
