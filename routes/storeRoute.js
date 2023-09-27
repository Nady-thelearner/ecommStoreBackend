  const express = require("express");
  const bodyParser = require("body-parser");
  const multer = require("multer");
  const path = require("path");
  const auth = require("../middleware/auth");
  const storeController = require("../controllers/storeController");

  const store_Route = express();
  store_Route.use(bodyParser.json());
  store_Route.use(bodyParser.urlencoded({ extended: false }));
  store_Route.use("/images", express.static(path.join("public/storeLogo")));

  const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
  };

  // const storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "public/storeLogo", (error, success) => {
  //       if (error) throw error;
  //     });
  //   },
  //   filename: (req, file, cb) => {
  //     // const name = Date.now() + "_" + file.originalname;
  //     const name = file.originalname.toLowerCase().split(" ").join("-");
  //     const ext = MIME_TYPE_MAP[file.mimetype];
  //     cb(null, name + "-" + Date.now() + "." + ext, (error, success) => {
  //       if (error) throw error;
  //     });
  //   },
  // });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/storeLogo"); // Removed the unnecessary callback argument
    },
    filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(" ").join("-");
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + ext);
    },
  });

  const upload = multer({ storage: storage });

  store_Route.post(
    "/create-store",
    auth,
    upload.single("logo"),
    storeController.createStore
  );

  store_Route.get("/find-nearest-store", auth, storeController.find_nearestStore);
  store_Route.get("/get-store", auth, storeController.get_store);

  module.exports = store_Route;
