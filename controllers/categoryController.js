const Category = require("../models/categoryModel");

const addCategory = async (req, res, next) => {
  // console.log("triggered category", req.body);
  try {
    const categoryData = await Category.find();
    console.log("category Data--->", categoryData);
    if (categoryData.length > 0) {
      let catExists = false;
      for (let i = 0; i < categoryData.length; i++) {
        const cat_data = categoryData[i]["category"];
        console.log("cata Data", cat_data);
        console.log("request Category", req.body.category);
        if (cat_data.toLowerCase() == req.body.category.toLowerCase()) {
          console.log("inside if --->");
          catExists = true;
          break;
          ///do smethinng...
        }
      }
      console.log("catExist", catExists);
      if (catExists) {
        res.status(200).send({
          success: false,
          message: "Category (" + req.body.category + ") already exists.",
        });
      } else {
        const category = new Category({
          category: req.body.category,
        });

        const catData = await category.save();
        res.status(200).send({ success: true, message: "Category added1!" });
      }
    } else {
      const category = new Category({
        category: req.body.category,
      });

      const catData = await category.save();
      res.status(200).send({ success: true, message: "Category added2!" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const get_category = async (req, res, next) => {
  try {
    return Category.find();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addCategory,
  get_category
};
