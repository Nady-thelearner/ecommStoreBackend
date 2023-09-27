const SubCategory = require("../models/subCategoriesModel");

const createSubCategory = async (req, res, next) => {
  console.log("Subcategory Called", req.body);
  try {
    const subCatData = await SubCategory.find({
      category_id: req.body.category_id,
    });

    let subCatExists = false;
    if (subCatData.length > 0) {
      for (let i = 0; i < subCatData.length; i++) {
        if (
          subCatData[i]["sub_category"].toLowerCase() ===
          req.body.sub_category.toLowerCase()
        ) {
          subCatExists = true;

          break;
        }
      }
    }
    if (subCatExists) {
      res
        .status(200)
        .send({ success: false, message: "Sub-category already exists!!" });
    } else {
      const subCategory = new SubCategory({
        category_id: req.body.category_id,
        sub_category: req.body.sub_category,
      });

      const subCategoryData = await subCategory.save();
      res.status(200).send({
        success: true,
        message: "SubCategory added successfully.",
        data: subCategoryData,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  createSubCategory,
};
