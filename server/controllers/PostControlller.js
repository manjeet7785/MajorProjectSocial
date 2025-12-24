const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const { Error, Success } = require("../utilis/responseWrapper");
const mapPostOutput = require("../utilis/Utilis");

const createPost = async (req, res) => {
  try {
    const { title, caption, image } = req.body;

    if (!caption) {
      return res.status(400).send(Error(400, "Caption is required"));
    }

    if (!image) {
      return res.status(400).send(Error(400, "Image is required"));
    }

    console.log("📸 Creating post - Caption length:", caption.length, "Image size:", image.length);

    let cloudImg;
    try {
      cloudImg = await cloudinary.uploader.upload(image, {
        folder: "Post"
      });
      console.log("✅ Cloudinary upload successful:", cloudImg.public_id);
    } catch (cloudError) {
      console.error("❌ Cloudinary upload failed:", cloudError.message);
      return res.status(400).send(Error(400, "Image upload failed: " + cloudError.message));
    }

    const owner = req._id;
    console.log("👤 Owner ID:", owner);

    const user = await User.findById(owner);

    if (!user) {
      return res.status(404).send(Error(404, "User not found"));
    }

    const post = await Post.create({
      title,
      caption,
      owner,
      image: {
        publicId: cloudImg.public_id,
        url: cloudImg.secure_url,
      },
    });

    user.posts.push(post._id);
    await user.save();

    console.log("💾 Post created successfully:", post._id);

    return res.send(Success(201, { post: mapPostOutput(post, owner) }));
  } catch (error) {
    console.error("💥 Error creating post:", error.message, error.stack);
    return res.status(500).send(Error(500, error.message));
  }
};

const getAllPostsController = (req, res) => {
  console.log("User ID:", req._id);
  res.send(Success(200, "Get all posts controller working"));
};

const likeAndUnlikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const CurrentuserId = req._id;

    const post = await Post.findById(postId).populate('owner');

    if (!post) {
      return res.status(404).send(Error(404, "Post not found"));
    }

    if (post.likes.includes(CurrentuserId)) {
      const index = post.likes.indexOf(CurrentuserId);
      post.likes.splice(index, 1);
    } else {
      post.likes.push(CurrentuserId);
    }
    await post.save();
    return res.send(Success(200, { post: mapPostOutput(post, req._id) }));
  } catch (LikeAndUnLike) {
    res.send(Error(500, "Internal Server Error"));
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId, caption } = req.body;
    const CurrUserId = req._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.send(Error(404, "Post Not Found"));
    }

    if (post.owner.toString() !== CurrUserId) {
      return res.send(Error(403, "Only Owners con Update this post"))
    }

    if (caption) {
      post.caption = caption;
    }

    await post.save();
    return res.send(Success(200, post))

  } catch (error) {
    console.log("Error");
  }
}

const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const { CurrentUserId } = req._id

    const post = await Post.findById(postId);
    const CurrentUser = await User.findById(CurrentUserId);
    if (!post) {
      return res.send(Error(404, "Post not Found"))
    }
    if (post.owner.toString() !== CurrentUserId) {
      return res.send(Error(403, "Only owners can delete their Posts"));
    }
    const index = CurrentUser.posts.indexOf(postId);
    CurrentUser.posts.splice(index, 1);
    await CurrentUser.save();
    await post.remove();

    return res.send(Success(200, "Post Delete Successfully"))
  } catch (DelePost) {
    console.log(DelePost.message);

  }
}

module.exports = {
  createPost, getAllPostsController, likeAndUnlikePost,
  updatePost, deletePost
};
