const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");

router.get("/register", userController.register);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
