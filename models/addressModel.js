const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  address: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Address", addressSchema);
