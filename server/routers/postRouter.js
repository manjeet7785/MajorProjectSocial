const express = require("express");
const router = express.Router();
const postController = require("../controllers/PostControlller");
const requireUser = require("../midd/requireUser");
const { updatePost } = require("../controllers/PostControlller");
const { createPost } = require("../controllers/PostControlller");


router.get("/all", requireUser, postController.getAllPostsController);
router.post("/", requireUser, postController.createPost);
router.post("/like", requireUser, postController.likeAndUnlikePost);
router.put("/update", requireUser, updatePost);

router.delete("/", requireUser, postController.deletePost);

module.exports = router;



