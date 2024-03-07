const express = require("express");
const auth = require("../middleware/auth");

const user_route = express();
const bodyParser = require("body-parser");

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

const multer = require("multer");
const path = require("path");

const user_controller = require("../controllers/userController");
user_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/userImages"), (error, success) => {
      if (error) throw error;
    });
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name, (error, success) => {
      if (error) throw error;
    });
  },
});

const upload = multer({ storage: storage });

user_route.post(
  "/register",
  upload.single("image"),
  user_controller.registerUser
);
user_route.post("/login", user_controller.userLogin);

user_route.post("/update-password", auth, user_controller.updatePass);

user_route.post("/forget-password", user_controller.forgetPassword);

user_route.get("/test", auth, (req, res) => {
  res.status(200).send("Authenticated");
});

user_route.post("/reset-password", user_controller.resetPassword);

user_route.post("/referesh-token", auth, user_controller.refereshToken);

user_route.post("/saveUserData", auth, user_controller.setUserStatus);
user_route.get("/getUserData", user_controller.getUserStatus);
user_route.post("/updateUserData", auth, user_controller.updateUserStatus);

module.exports = user_route;
//658c068c3ef29ccdccc52b10
