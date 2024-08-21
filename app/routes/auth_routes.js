const express = require("express");
const auth_controller = require("../controllers/auth_controller.js");

const router = express.Router();

router.post("/signup", auth_controller.signup);
router.post("/login", auth_controller.login);

module.exports = router;