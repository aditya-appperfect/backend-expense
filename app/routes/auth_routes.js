const express = require("express");
const auth_controller = require("../controllers/auth_controller.js");
const { body, validationResult, checkSchema } = require("express-validator");
const { getClient } = require("../../connect.js");
const { emailValid, passValid } = require("../validator.js");

const router = express.Router();

router.post("/login", emailValid(), passValid(), auth_controller.login);
router.post("/signup", auth_controller.signup);

module.exports = router;
