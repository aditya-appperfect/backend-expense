const express = require("express");
const auth_controller = require("../controllers/auth_controller.js");
const expense_controller = require("../controllers/expense_controller.js");

const router = express.Router();

router.use(auth_controller.protect);
router.get("/", expense_controller.getExpenses);
router.post("/", expense_controller.addExpenses);
router.delete("/", expense_controller.deleteExpense);

module.exports = router;