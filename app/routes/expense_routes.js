const express = require("express");
const { protect, checkRole } = require("../controllers/auth_controller.js");
const {
  getExpenses,
  deleteExpense,
  addExpenses,
  allExpenses,
} = require("../controllers/expense_controller.js");
const {
  validateAddExpensesSchema,
  handleValidationErrors,
} = require("../validator.js");

const router = express.Router();

router.get("/", protect, getExpenses);
router.post(
  "/",
  validateAddExpensesSchema(),
  handleValidationErrors,
  protect,
  addExpenses
);
router.delete("/", protect, deleteExpense);

//Admin Roles
router.get('/admin/', protect, checkRole('admin'), allExpenses);


module.exports = router;
