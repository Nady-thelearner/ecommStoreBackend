const User = require("../models/userModel");
const UserData = require("../models/userDataModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const nodeMailer = require("nodemailer");
const randomString = require("randomstring");
const fs = require("fs");
const cryptoJs = require("crypto-js");

const secretKey = "this is terst";

function decryptData(encryptedData) {
  const decryptedBytes = cryptoJs.AES.decrypt(encryptedData, secretKey);
  const decryptedData = JSON.parse(decryptedBytes.toString(cryptoJs.enc.Utf8));
  return decryptedData;
}

function encryptData(data) {
  const encryptedData = cryptoJs.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  return encryptedData;
}

const sendResetPassMail = async (req, res, name, email, token) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });

    const mailOptions = {
      from: config.emailUser,
      to: req.body.email,
      subject: "Reset password",
      html: `<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">Hi <span style="font-weight: bold;">${name}</span>, Please copy the link and <a href='${config.resetURl}${token}'  style="display: inline-block; margin-top: 10px; padding: 8px 12px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px;">reset the password</a></p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error----------->", error);
      } else {
        console.log("Mail has been sent", info.response);
      }
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const createToken = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, config.JWT_SECRET_KEY);
    return token;
  } catch (error) {
    res.status(400).send({ message: "inernal server error" });
  }
};

const securePass = async (pass) => {
  try {
    const hashedPass = await bcrypt.hash(pass, 10);
    return hashedPass;
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

const registerUser = async (req, res, next) => {
  console.log("userDataw---->", req.body);

  try {
    const hashedPass = await securePass(req.body.password);
    // console.log("request----->", req.file.filename);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPass,
      image: req.file.filename,
      mobile: req.body.mobile,
      type: req.body.type,
    });

    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      res.status(200).send({ success: false, message: "User already exists!" });
    } else {
      const userData = await user.save();
      res.status(200).send({
        success: true,
        message: "User registered successfully!",
        data: userData,
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to register user!" });
    console.log("error ------->", error.message);
  }
};

const userLogin = async (req, res, next) => {
  console.log("userData---->", req.body);

  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      const token = await createToken(userData._id);

      if (passwordMatch) {
        const userResult = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          password: userData.password,
          image: userData.image,
          mobile: userData.mobile,
          type: userData.type,
          token: token,
        };
        const response = {
          success: true,
          message: "Logged in data :",
          data: userResult,
        };
        res.status(200).send(response);
      } else {
        res.status(200).send({
          success: false,
          message: "Login details are incorrectddd! ",
        });
      }
    } else {
      res
        .status(200)
        .send({ success: false, message: "Login details are incorrectdd! " });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//users should be authenticated to update pass in the first place.
const updatePass = async (req, res, next) => {
  try {
    if (req.body.password) {
      const _id = req.body._id;
      const userData = await User.findOne({ _id: _id });
      if (userData) {
        const updatedPass = await securePass(req.body.password);

        await User.findByIdAndUpdate(
          { _id: _id },
          { $set: { password: updatedPass } }
        );

        res.status(200).send({ success: true, message: "password updated!" });
      } else {
        res.status(200).send({ success: false, message: "User not found!" });
      }
    } else {
      res.status(200).send({
        success: false,
        message: " password required to update!",
      });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      const randomToken = randomString.generate();
      const data = await User.updateOne(
        { email: req.body.email },
        { $set: { token: randomToken } }
      );
      await sendResetPassMail(
        req,
        res,
        userData.name,
        userData.email,
        randomToken
      );
      res.status(200).send({
        message: "Url for resetting the password has been sent to your mail.",
      });
    } else {
      res.status(200).send({ success: false, message: "User not found!" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const token = req.query.token;
    const userData = await User.findOne({ token: token });

    if (userData) {
      const password = req.body.password;
      const hashedPass = await securePass(password);
      const updatedData = await User.findByIdAndUpdate(
        { _id: userData._id },
        { $set: { password: hashedPass, token: "" } },
        { new: true }
      );

      res.status(200).send({
        success: true,
        message: "password Updated Successfully",
        data: updatedData,
      });
    } else {
      res
        .status(200)
        .send({ success: false, message: "Link has been expired" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

//renewToken
const renewToken = async (id) => {
  try {
    const secret_jwt = config.JWT_SECRET_KEY;
    const newSecretKey = randomString.generate();

    fs.readFile("config/config.js", "utf-8", (err, data) => {
      if (err) throw err;
      var newValue = data.replace(new RegExp(secret_jwt, "g"), newSecretKey);

      fs.writeFile("config/config.js", newValue, "utf-8", (err, data) => {
        if (err) throw err;
        console.log("ayependa!");
      });
    });

    const token = await jwt.sign({ _id: id }, newSecretKey);
    return token;
  } catch (error) {
    res.status(400).send({ message: "inernal server error" });
  }
};

const refereshToken = async (req, res, next) => {
  console.log("inside referesh");
  try {
    const user_id = req.body.user_id;

    const userData = await User.findById({ _id: user_id });
    if (userData) {
      const refereshedToken = await renewToken(user_id);
      const response = {
        user_id: user_id,
        token: refereshedToken,
      };
      res.status(200).send({
        success: true,
        message: "referesh token details!",
        data: response,
      });
    } else {
      res.status(200).send({ success: false, message: "User not found!" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const setUserStatus = async (req, res, next) => {
  const encryptedToken = encryptData(req.body.token);
  try {
    const user = new UserData({
      user_id: req.body.userId,
      token: encryptedToken,
      status: req.body.status,
      isVendor: req.body.isVendor,
    });

    const userData = await UserData.findOne({ user_id: req.body.userId });
    if (userData) {
      await UserData.findOneAndUpdate(
        { user_id: req.body.userId },
        {
          $set: {
            status: req.body.status,
            user_id: req.body.userId,
            token: encryptedToken,
          },
        }
      );
      const userData = await UserData.findOne({ user_id: req.body.userId });
      res.status(200).send({
        success: true,
        message: "User logged in again!",
        data: userData,
      });
    } else {
      const userData = await user.save();
      res.status(200).send({
        success: true,
        message: "User Logged In successfully!",
        data: userData,
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to register user!" });
    console.log("error ------->", error.message);
  }
};

const getUserStatus = async (req, res, next) => {
  try {
    console.log("id", req.query.id);
    const userData = await UserData.findOne({ user_id: req.query.id });
    const decryptedToken = decryptData(userData.token);
    userData.token = decryptedToken;
    if (userData) {
      if (userData.status == "loggedOut") {
        res.status(200).send({
          success: true,
          message: "User Logged out!",
          data: userData,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "User have an active session!",
          data: userData,
        });
      }
    } else {
      res.status(200).send({
        success: false,
        message: "User does not have an active session!",
        data: userData,
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to get status!" });
    console.log("error ------->", error.message);
  }
};

const updateUserStatus = async (req, res, next) => {
  const encryptedToken = encryptData(req.body.token);
  try {
    console.log("req", req.body);
    if (req.body.userId) {
      // const _id = req.body.id;
      const userID = req.body.userId;
      const userData = await UserData.findOne({ user_id: userID });
      if (userData) {
        await UserData.findOneAndUpdate(
          { user_id: userID },
          {
            $set: {
              status: req.body.status,
              user_id: req.body.userId,
              token: encryptedToken,
            },
          }
        );
        const userData = await UserData.findOne({ user_id: userID });
        res.status(200).send({
          success: true,
          message: "User status updated!",
          data: userData,
        });
      } else {
        res.status(200).send({ success: false, message: "User not found!" });
      }
    } else {
      res.status(200).send({
        success: false,
        message: "Unique Id is required to update records!",
      });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  registerUser,
  userLogin,
  updatePass,
  forgetPassword,
  resetPassword,
  refereshToken,
  setUserStatus,
  getUserStatus,
  updateUserStatus,
};
