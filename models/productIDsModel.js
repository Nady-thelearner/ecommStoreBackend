const mongoose = require("mongoose");

var productID = mongoose.Schema({
  productID: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("prodctID", productID);
