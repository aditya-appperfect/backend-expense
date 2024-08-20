const express = require("express");
const auth_controller = require("../controllers/auth_controller.js");

const router = express.Router();

router.get("/", auth_controller.getData);
// router.post("/login", auth_controller.login);

module.exports = router;