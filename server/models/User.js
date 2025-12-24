const mongoose = require("mongoose");
const { post } = require("../routers/authRouter");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    publicId: { type: String, default: "" },
    url: { type: String, default: "" }
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  bio: {
    type: String,
  },

  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  }],

}, {
  timestamps: true
})

module.exports = mongoose.model("User", userSchema); 
