const Address = require("../models/addressModel");

const getAddress = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    console.log(user_id, "userid");
    const address_d = await Address.findOne({ user_id: user_id });
    if (address_d) {
      // console.log("address----->", address_d.address.length);
      var addAddress = [];
      for (let i = 0; i < address_d.address.length; i++) {
        addAddress.push(address_d.address[i]);
      }
      res.status(200).send({
        success: true,
        message: "Address FETCHED Successfully!",
        data: addAddress,
      });
    } else {
      res.status(200).send({ success: false, message: "No record found" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addAddress = async (req, res) => {
  try {
    const user_id = req.query.user_id;

    const address_d = await Address.findOne({ user_id: user_id });

    if (address_d) {
      console.log("address----->", address_d.address.length);
      const addAddress = [];
      for (let i = 0; i < address_d.address.length; i++) {
        addAddress.push(address_d.address[i]);
      }
      addAddress.push(req.query.address);
      console.log("add address arrray", addAddress);
      const address_data = await Address.findOneAndUpdate(
        { user_id: req.query.user_id },
        { $set: { address: addAddress } },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Address updated Successfully!",
        data: address_data,
      });
    } else {
      const address = new Address({
        user_id: req.query.user_id,
        address: req.query.address,
      });

      const address_data = await address.save();

      res.status(200).send({
        success: true,
        message: "address added successfully",
        data: address_data,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addAddress,
  getAddress,
};
