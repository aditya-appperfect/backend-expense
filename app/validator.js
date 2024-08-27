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

exports.validateAddExpensesSchema = () => {
  return checkSchema({
    title: {
      notEmpty: { errorMessage: "Title is required" },
      trim: true,
    },
    exptype: {
      notEmpty: { errorMessage: "Expense type is required" },
      isIn: {
        options: [["income", "expense"]],
        errorMessage: "Expense type must be either 'income' or 'expense'",
      },
    },
    amount: {
      notEmpty: { errorMessage: "Amount is required" },
      isNumeric: { errorMessage: "Amount must be a number" },
      custom: {
        options: (value) => value > 0,
        errorMessage: "Amount must be a positive number",
      },
    },
  });
};
