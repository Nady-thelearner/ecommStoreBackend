const mongoose = require("mongoose");

const userdata = mongoose.Schema({
  user_id: {
    type: String,
    default: "",
  },
  token: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "",
  },
  isVendor: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("userData", userdata);
