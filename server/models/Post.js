const mongoose = require("mongoose");
const { User } = require("./User");

const postSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,

  },
  image: {
    publicId: String,
    url: String,

  },
  caption: {
    type: String,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],

}, {
  timestamps: true
});

module.exports = mongoose.model("Post", postSchema);

