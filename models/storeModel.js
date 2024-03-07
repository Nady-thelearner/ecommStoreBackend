const mongoose = require("mongoose");

const store = mongoose.Schema({
  store_name: {
    type: String,
    required: true,
  },
  vendor_id: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  business_email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    requied: true,
  },
  location: {
    type: { type: String, required: true },
    coordinates: [],
  },
});

store.index({ location: "2dsphere" });
module.exports = mongoose.model("Store", store);
