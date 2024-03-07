const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  product_id: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  vendor_id: {
    type: String,
    required: true,
  },
  store_id: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  uniqueRef: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Cart", CartSchema);
