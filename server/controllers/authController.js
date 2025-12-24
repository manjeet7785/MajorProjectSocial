const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Error, Success } = require("../utilis/responseWrapper");

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || "koi bhi String De skte hai";

const generateAccessToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "1d" });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
};

const signController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.send(Error(400, "All fields (name, email, password) are required"));
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send(Error(409, "User already exists. Please login."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashedPassword });

    return res.send(Success(201, {
      message: "User registered successfully",
      user: { email, name }
    }));

  } catch (error) {
    console.error("Sign Up Error:", error);
    return res.send(Error(500, "Internal Server Error"));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send(Error(400, "All fields are required"));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.send(Error(404, "User is not registered"));
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.send(Error(403, "Incorrect password"));
    }

    const payload = { _id: user._id };
    const AccessToken = generateAccessToken(payload);
    const RefreshToken = generateRefreshToken(payload);

    res.cookie("jwt", RefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.send(Success(200, { AccessToken }));

  } catch (error) {
    console.error("Login Error:", error);
    return res.send(Error(500, "Internal Server Error"));
  }
};

const LogoutController = async (req, res) => {
  try {

    res.clearCookies("jwt", {
      httpOnly: true,
      secure: true
    })
    return res.send(Success(200, "Loguot Successfully"))
  }
  catch (LogoutError) {
    return res.send(Error(500, LogoutError.message));


  }
}


const refreshAccessTokenControler = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt) {
    return res.send(Error(401, "Refresh Token is required"));
  }

  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const _id = decoded._id;
    const AccessToken = generateAccessToken({ _id });

    return res.send(Success(200, { AccessToken }));

  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.send(Error(403, "Invalid refresh token"));
  }
};

module.exports = { signController, loginController, refreshAccessTokenControler, LogoutController };

















