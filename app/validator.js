const { body, checkSchema } = require("express-validator");

exports.emailValid = () =>
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is empty")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail();

exports.passValid = () =>
  body("pass")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 3 })
    .withMessage("Password must be of atleast 3 characters ")
    .matches(/\d/)
    .withMessage("Password must have atleast one number");

exports.validateSchema = () => {
  return checkSchema({
    email: {
      notEmpty: { errorMessage: "email is required" },
      isEmail: { errorMessage: "Invalid email format" },
    },
    password: {
      notEmpty: { errorMessage: "password is required" },
      isLength: {
        options: { min: 8 },
        errorMessage: "Password must be of atleast 8 characters",
      },
      matches: {
        options: /\d/,
        errorMessage: "Password must contain at least one digit",
      },
    },
    username: { notEmpty: { errorMessage: "Username is required" } },
    address: { notEmpty: { errorMessage: "address is required" } },
  });
};