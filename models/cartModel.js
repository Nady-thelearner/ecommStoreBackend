const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  product_id: {
    type: String,
    required: true,
  },
  price: {
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
});

module.exports = mongoose.model("Cart", CartSchema);
