const { followOrUnfollowUser, getPostOfFollowing, getMyPost, getUserProfile, getUserPost, getMyInfo, updateProfile, deleteMyProfile } = require("../controllers/UserController");
const requireUser = require("../midd/requireUser");
const router = require("express").Router();



router.post("/follow", requireUser, followOrUnfollowUser);

router.get("/getFeedData", requireUser, getPostOfFollowing);

router.get("/getMyPost", requireUser, getMyPost)
router.get("/getUserPost", requireUser, getUserPost)
router.delete("/", requireUser, deleteMyProfile)
router.get("/getMyInfo", requireUser, getMyInfo)

router.put("/", requireUser, updateProfile)

router.get("/getUserProfile", requireUser, getUserProfile)

module.exports = router;


