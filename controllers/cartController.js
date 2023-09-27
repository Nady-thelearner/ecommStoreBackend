const Cart = require("../models/cartModel");

const addToCart = async (req, res) => {
  try {
    const cart = new Cart({
      product_id: req.body.product_id,
      price: req.body.price,
      vendor_id: req.body.vendor_id,
      store_id: req.body.store_id,
    });

    const cart_data = await cart.save();

    res
      .status(200)
      .send({
        success: true,
        messgae: "Product added to the Cart",
        data: cart_data,
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addToCart,
};
