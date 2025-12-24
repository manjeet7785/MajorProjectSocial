const mongoose = require("mongoose")
const User = require("../models/User");
const Post = require("../models/Post");
const cloudinary = require("cloudinary")
const { Error, Success } = require("../utilis/responseWrapper");
const mapPostOutput = require("../utilis/Utilis");

const followOrUnfollowUser = async (req, res) => {
  try {
    const { userIdFollow } = req.body;
    const currentUserId = req._id;


    if (!userIdFollow) {
      return res.send(Error(400, "userIdFollow is required"));
    }

    const userToFollow = await User.findById(userIdFollow);
    const currentUser = await User.findById(currentUserId);

    if (currentUserId === userIdFollow) {
      return res.send(Error(409, "User can't follow themselves"));
    }

    if (!userToFollow) {
      return res.status(404).send(Error(404, "User to follow not found"));
    }

    if (currentUser.following.includes(userIdFollow)) {
      currentUser.following.pull(userIdFollow);
      userToFollow.followers.pull(currentUserId);

      await currentUser.save();
      await userToFollow.save();

      return res.send(Success(200, "User unfollowed successfully"));
    } else {
      currentUser.following.push(userIdFollow);
      userToFollow.followers.push(currentUserId);

      await currentUser.save();
      await userToFollow.save();

      return res.send(Success(200, "User followed successfully"));
    }
  } catch (error) {
    console.error("Follow Error:", error);
    return res.status(500).send(Error(500, "Internal Server Error"));
  }
};

const getPostOfFollowing = async (req, res) => {
  try {
    const currentUserId = req._id;
    const currentUser = await User.findById(currentUserId).populate("following");

    const fullPosts = await Post.find({
      owner: {
        $in: currentUser.following
      }
    }).populate("owner")

    const posts = fullPosts.map(item => mapPostOutput(item, req._id)).reverse();

    const follwingsIds = currentUser.following.map(item => item._id);

    const suggestion = await User.find({
      _id: {
        '$nin': follwingsIds
      }
    })

    return res.send(Success(200, { ...currentUser._doc, suggestion, posts }))
  } catch (error) {
    console.log("Eoeoe", error.message);
  }
}

const getMyPost = async (req, res) => {
  try {
    const { currentUserId } = req._id;
    const allUserPosts = await Post.find({
      owner: currentUserId,
    })
    return res.send(Success(200, { allUserPosts }))
  } catch (GetMyPostError) {
    console.log(GetMyPostError);
  }
}

const getUserPost = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      res.send(Error(404, "Please Enter Valid USer "))
    }

    const allUserPosts = await Post.find({
      owner: userId
    }).populate('likes');
    return res.send(Success(200, { allUserPosts }))
  }
  catch (getUserPost) {
    console.log(getUserPost.message);
    return res.send(Error(500, getUserPost.message))
  }
}

const deleteMyProfile = async (req, res) => {
  try {
    const CurrentUSerId = req._id;
    const CurrentUser = await User.findById(CurrentUSerId);

    await Post.deleteMany({
      owner: CurrentUSerId
    })

    CurrentUser.followers.forEach(async followersId => {
      const follower = await User.findById(followersId);
      const Index = follower.following.indexOf(CurrentUSerId);
      follower.following.splice(index, 1);
      await follower.save();
    })

    CurrentUser.following.forEach(async followingId => {
      const following = await User.findById(followingId);
      const Index = following.followers.indexOf(CurrentUSerId);
      following.followers.splice(index, 1);
      await following.save();
    })

    const allPosts = await Post.find();
    allPosts.forEach(async post => {
      const index = post.likes.indexOf(CurrentUSerId)
      post.likes.splice(index, 1);
      await post.save();
    })

    await CurrentUser.remove();
  } catch (DeleteMyProfile) {
    console.log(DeleteMyProfile.message);
  }
}

const getMyInfo = async (req, res) => {
  try {
    const user = await User.findById(req._id);

    if (!user.avatar) {
      user.avatar = { publicId: "", url: "" };
    } else if (!user.avatar.url) {
      user.avatar.url = "";
    }

    return res.send(Success(200, { user }));
  } catch (err) {
    console.error("getMyInfo error:", err.message);
    return res.send(Error(500, "Error"));
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req._id;
    const { name, bio, avatar } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send(Error(404, "User not found"));

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;

    if (avatar && typeof avatar === "string" && avatar.startsWith("data:image")) {
      const uploadedImg = await cloudinary.uploader.upload(avatar, {
        folder: "SocialMedia",
      });

      user.avatar = {
        url: uploadedImg.secure_url,
        publicId: uploadedImg.public_id,
      };
    }

    await user.save();
    return res.send(Success(200, { user }));
  } catch (error) {
    return res.status(500).send(Error(500, "Internal Server Error"));
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.send(Error(400, "User ID is required"));
    }

    const user = await User.findById(userId).populate({
      path: 'posts',
      populate: { path: "owner" }
    });

    if (!user) {
      return res.send(Error(404, "User not found"));
    }

    const fullPosts = user.posts || [];
    const posts = fullPosts.map(item => mapPostOutput(item, req._id)).reverse();

    return res.send(Success(200, { ...user._doc, posts }));
  } catch (e) {
    return res.send(Error(500, e.message));
  }
};

module.exports = {
  followOrUnfollowUser,
  getPostOfFollowing,
  getMyPost,
  deleteMyProfile,
  getUserPost,
  getMyInfo,
  updateProfile,
  getUserProfile
};
