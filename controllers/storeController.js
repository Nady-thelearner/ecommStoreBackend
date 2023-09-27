const User = require("../models/userModel");
const Store = require("../models/storeModel");
const querystring = require("querystring");
const url = require("url");

const createStore = async (req, res, next) => {
  try {
    const userData = await User.findOne({ _id: req.body.vendor_id });
    if (userData) {
      if (!req.body.latitude || !req.body.longitude) {
        res
          .status(200)
          .send({ success: false, message: "Location details are missing." });
      } else {
        const vendorData = await Store.findOne({
          vendor_id: req.body.vendor_id,
        });
        console.log("vendorData---->", vendorData);
        if (vendorData) {
          res
            .status(200)
            .send({ success: false, message: "Vendor already Exist." });
        } else {
          let imagePath = req.body.imagePath;
          if (req.file) {
            const url = req.protocol + "://" + req.get("host");
            imagePath = url + "/images/" + req.file.filename;
          }
          const store = Store({
            vendor_id: req.body.vendor_id,
            logo: imagePath,
            business_email: req.body.business_email,
            address: req.body.address,
            pin: req.body.pin,
            location: {
              type: "Point",
              coordinates: [
                parseFloat(req.body.longitude),
                parseFloat(req.body.latitude),
              ],
            },
          });
          console.log("Store Data----->", store);
          const storeData = await store.save();
          res.status(200).send({
            success: true,
            message: "Store created successfully",
            data: storeData,
          });
        }
      }
    } else {
      res
        .status(200)
        .send({ success: false, message: "Vendor does not exist." });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const get_store = async (req, res, next) => {
  try {
    // const urlString = req.url;
    // const parsedUrl = new URL(urlString, "http://some.com"); // 'http://example.com' is a placeholder base URL
    // const queryParams = new URLSearchParams(parsedUrl.search);
    // const vendor_id = queryParams.get("vendor_id");
    const vendor_id = req.query.userID; // Extract the parameter from the query string
    // const authorizationHeader = req.headers.authorization;
    console.log("vendor_id-------->", vendor_id);
    const storeData = await Store.findOne({
      vendor_id: vendor_id,
    });
    if (storeData) {
      res.status(200).send({
        success: true,
        message: "Store Fetched successfully",
        data: storeData,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const find_nearestStore = async (req, res) => {
  try {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    const store_data = await Store.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          key: "location",
          maxDistance: parseFloat(1000) * 1609,
          distanceField: "dist.calculated",
          spherical: true,
        },
      },
    ]);

    res.status(200).send({
      success: true,
      message: "list of Stores --_->",
      data: store_data,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  createStore,
  get_store,
  find_nearestStore,
};
