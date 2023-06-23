const mongoose = require("mongoose");

const ip_model = mongoose.Schema(
  {
    ip: {
      type: String,
      required: [true, "Please add ip 0.0.0.0"],
    },
    floor: {
      type: String,
      required: [true, "Please add Location"],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("ip_model", ip_model, "ip_model");
