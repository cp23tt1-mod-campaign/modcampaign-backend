const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/user");
const { auth } = require("../Middleware/auth");

router.route("/sign-in").post(UserController.validateUserExists);

router.route("/create-user").post(UserController.createUser);

// router.get("/user", auth(), UserController.getUserById);

// router.route("/user").get(auth(), UserController.getUserById);
router
  .route("/user")
  .get(UserController.getUserById)
  .patch(UserController.updateUser);

module.exports = router;
