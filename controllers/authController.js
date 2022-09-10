const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
  registerUser: async (req, res) => {
    try {
      const { username, phone, password, email, firstname, lastname } =
        req.value.body;

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      const beforeInfo = await User.find();
      const listUserName = beforeInfo.map((item) => {
        return item.username;
      });
      for (var i = 0; i < listUserName.length; i++) {
        if (listUserName[i] == username)
          return res
            .status(404)
            .json({ msg: "This username is already registered" });
        break;
      }

      // Create new user
      const newUser = {
        phone: phone,
        username: username,
        password: hashed,
        firstname: firstname,
        lastname: lastname,
        email: email,
        address: "",
      };

      const result = await User.create(newUser);

      res.status(200).json(result);
    } catch (err) {
      const errPhone = "Phone number available";

      const errEmail = "Email available";

      const errUsername = "Username available";

      let result = "";
      let obj = {
        title: "",
        message: "",
      };

      if (err.keyPattern.username == 1) {
        (obj.title = "username"), (obj.message = errUsername);
      }
      if (err.keyPattern.phone == 1) {
        (obj.title = "phone"), (obj.message = errPhone);
      }

      if (err.keyPattern.email == 1) {
        (obj.title = "email"), (obj.message = errEmail);
      }

      res.status(500).json(obj);
    }
  },
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      "secretkey",
      { expiresIn: "3d" },
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      "secretkey",
      { expiresIn: "7d" },
    );
  },
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.value.body;
      const user = await User.findOne({ username: username }).populate(
        "paymentid",
      );

      console.log(user);
      if (!user) {
        return res.status(404).json("Incorrect username");
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(404).json("Incorrect password");
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        // res.cookie("refreshToken", refreshToken, {
        //   httpOnly: true,
        //   secure: false,
        //   path: "/",
        //   sameSite: "strict",
        // });

        // res.header("Authorization", `Bearer ${accessToken}`).send();

        // save all - password

        const { password, ...others } = user._doc;
        // res.setHeader("token", accessToken);\
        res.status(200).json({
          ...others,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, "secretkey", (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      //create new access token, refresh token and send to user
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.setHeader("token", newAccessToken);
      res.status(200).json("successfully");

      // res.status(200).json({
      //     accessToken: newAccessToken,
      //     refreshToken: newRefreshToken,
      // })
    });
  },
  logOut: async (req, res) => {
    //Clear cookies when user logs out
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.clearCookie("refreshToken");
    res.status(200).json("Logged out successfully!");
  },
  authGoogle: async (req, res) => {
    try {
      const user = await User.findOne(req.user._id);
      const accessToken = authController.generateAccessToken(user);
      const refreshToken = authController.generateRefreshToken(user);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.setHeader("token", accessToken);
      res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

module.exports = authController;
