const express = require("express");
const auth_controller = require("../controllers/auth_controller.js");
const { body, validationResult, checkSchema } = require("express-validator");
const { getClient } = require("../../connect.js");
const {
  emailValid,
  passValid,
  handleValidationErrors,
} = require("../validator.js");

const router = express.Router();

router.post(
  "/login",
  emailValid(),
  passValid(),
  handleValidationErrors,
  auth_controller.login
);
router.post(
  "/signup",
  emailValid(),
  passValid(),
  handleValidationErrors,
  auth_controller.signup
);

module.exports = router;
