const mongoose = require("mongoose");

const ip = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  total_time: {
    type: Number,
    required: true,
  },
});

const date = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  virtualTime: {
    type: Number,
    required: true,
  },
  officeTime: {
    type: Number,
    required: true,
  },
  attendance: {
    type: String,
    required: true,
  },
  ip: [ip],
});

const attendanceSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  date: [date],
});

module.exports = mongoose.model("attendance", attendanceSchema, "attendance");
