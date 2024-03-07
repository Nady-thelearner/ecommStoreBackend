const Cart = require("../models/cartModel");
const productID = require("../models/productIDsModel");

const addProductIDEncrpted = async (req, res) => {
  try {
    console.log("req.body--->", req.body);
    const productID1 = await productID.findOne({ userId: req.body.userID });
    if (productID1) {
      console.log("if executed", productID1);
      const productID_data = await productID.findOneAndUpdate(
        { userId: req.body.userID },
        { $set: { productID: req.body.productID } },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "product ID updated successfully",
        data: productID_data,
      });
    } else {
      console.log("else executedreq.body.userID", req.body.userID);
      const productIDs = new productID({
        productID: req.body.productID,
        userId: req.body.userID,
      });
      console.log("else executed", productIDs);

      const productID_data = await productIDs.save();
      res.status(200).send({
        success: true,
        message: "product ID added successfully",
        data: productID_data,
      });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const deleteProductID = async (req, res) => {
  try {
    //deleteOne
    const productID1 = await productID.findOne({ userId: req.body.userID });

    if (productID1) {
      const result = await productID.deleteOne({ userId: req.body.userID });
      if (result.deletedCount === 1) {
        res.status(200).send({
          success: true,
          message: "product deleted successfully",
          data: result,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Failed to delete.",
          data: result,
        });
      }
    } else {
      res.status(200).send({
        success: true,
        message: "No records found.",
        data: productID1,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getProductID = async (req, res) => {
  try {
    console.log("req.body", req.query);
    const productID1 = await productID.findOne({ userId: req.query.userID });
    if (productID1) {
      res.status(200).send({
        success: true,
        message: "product ID fetched successfully",
        data: productID1,
      });
    } else {
      res.status(200).send({
        success: true,
        message: "product ID not present",
        data: productID1,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getCartDetVendSpecific = async (req, res) => {
  try {
    console.log("req.body...", req.query.vendorId);
    const cartDet = await Cart.find({ vendor_id: req.query.vendorId });
    console.log("Cart Details...", cartDet);

    if (cartDet && cartDet.length > 0) {
      const cartDict = {};

      for (var i = 0; i < cartDet.length; i++) {
        const uniqueRef = cartDet[i].uniqueRef;

        if (!cartDict[uniqueRef]) {
          cartDict[uniqueRef] = [];
        }

        cartDict[uniqueRef].push(cartDet[i]);
      }

      const cartDe = Object.values(cartDict);

      res.status(200).send({
        success: true,
        message: "Cart details fetched successfully",
        data: cartDict,
      });
    } else {
      res.status(200).send({
        success: true,
        message: "No Orders for the vendor",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateCartVendorStatus = async (req, res) => {
  try {
    console.log("req.body", req.query);
    const cartDet = await Cart.find({ uniqueRef: req.query.uniqueRef });
    if (cartDet) {
      await Cart.updateMany(
        { uniqueRef: req.query.uniqueRef },
        {
          $set: {
            status: req.body.status,
          },
        }
      );

      const cartDetN = await Cart.find({ uniqueRef: req.query.uniqueRef });
      res.status(200).send({
        success: true,
        message: "Status updated successfully.",
        data: cartDetN,
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Order not found in the db",
        data: null,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addToCart = async (req, res) => {
  try {
    console.log("product details", req.body[0]);
    console.log("product details", req.body[0].productDetails[0].product_id);
    var len = req.body[0].productDetails.length;
    console.log(len);
    if (len > 1) {
      const cart_datas = req.body[0].productDetails.map((item) => ({
        // console.log(item)
        product_id: item.product_id,
        quantity: item.quantity,
        vendor_id: item.vendor_id,
        store_id: item.store_id,
        address: req.body[0].address,
        uniqueRef: req.body[0].uniqueRef,
        userID: req.body[0].user_id,
      }));

      const cart_data = await Cart.insertMany(cart_datas);

      res.status(200).send({
        success: true,
        messgae: "Products added to the Cart",
        data: cart_data,
      });
    } else {
      const cart = new Cart({
        product_id: req.body[0].productDetails[0].product_id,
        quantity: req.body[0].productDetails[0].quantity,
        vendor_id: req.body[0].productDetails[0].vendor_id,
        store_id: req.body[0].productDetails[0].store_id,
        address: req.body[0].address,
        uniqueRef: req.body[0].uniqueRef,
        userID: req.body[0].user_id,
      });

      const cart_data = await cart.save();

      res.status(200).send({
        success: true,
        messgae: "Product added to the Cart",
        data: cart_data,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addToCart,
  getCartDetVendSpecific,
  addProductIDEncrpted,
  getProductID,
  deleteProductID,
  updateCartVendorStatus,
};
