const router = require("express").Router();
const { signController, loginController, refreshAccessTokenControler, LogoutController } = require("../controllers/authController");

router.post("/signup", signController);
router.post("/login", loginController);
router.get("/refresh", refreshAccessTokenControler);

router.post("/logout", LogoutController)

module.exports = router;

