const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  date: [
    {
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
      ip: [
        {
          ip: {
            type: String,
            required: true,
          },
          total_time: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("attandance", attendanceSchema, "attandance");
