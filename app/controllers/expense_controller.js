const { validationResult } = require("express-validator");
const { getClient } = require("../../connect");

exports.getExpenses = async (req, res) => {
  try {
    const { tag } = req.query;
    const { user } = req;
    const client = await getClient();
    let data = {
      exp: [],
      total: 0,
    };
    let text = "";
    let values = [];
    if (tag == "all") {
      values = [user.id];
      text = "SELECT * FROM expense WHERE userid=$1";
      const expenseResult = await client.query(text, values);
      text = "SELECT SUM(amount) AS total_income FROM expense WHERE userid=$1";
      const totalResult = await client.query(text, values);
      data.exp = expenseResult.rows;
      data.total = totalResult.rows[0]?.total_income || 0;
    } else if (tag == "expense" || tag == "income") {
      values = [user.id, tag];
      text = "SELECT * FROM expense WHERE userid=$1 AND exptype=$2";
      const expenseResult = await client.query(text, values);
      text =
        "SELECT SUM(amount) AS total_income FROM expense WHERE userid=$1 AND exptype=$2";
      const totalResult = await client.query(text, values);
      data.exp = expenseResult.rows;
      data.total = totalResult.rows[0]?.total_income || 0;
    } else {
      return res.status(401).json({
        status: "fail",
        message: "Invalid query params",
      });
    }
    client.release();
    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: `Internal Server error, ${err}`,
    });
  }
};

exports.allExpenses = async (req, res) => {
  try {
    const { tag } = req.query;
    const client = await getClient();
    let data = {
      exp: [],
      total: 0,
    };
    let text = "";
    let values = [];
    if (tag == "all") {
      const expenseResult = await client.query("SELECT * FROM expense");
      const totalResult = await client.query(
        "SELECT SUM(amount) AS total_income FROM expense"
      );
      data.exp = expenseResult.rows;
      data.total = totalResult.rows[0]?.total_income || 0;
    } else {
      values = [tag];
      text = "SELECT * FROM expense WHERE exptype=$1";
      const expenseResult = await client.query(text, values);
      text = "SELECT SUM(amount) AS total_income FROM expense WHERE exptype=$1";
      const totalResult = await client.query(text, values);
      data.exp = expenseResult.rows;
      data.total = totalResult.rows[0]?.total_income || 0;
    }
    client.release();
    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: `Internal Server error, ${err}`,
    });
  }
};

exports.addExpenses = async (req, res) => {
  try {
    const { title, exptype, amount } = req.body;
    const { id } = req.user;
    const client = await getClient();
    const text =
      "INSERT INTO expense (userid, title, exptype, amount) VALUES ($1, $2, $3, $4)";
    let values = [];
    if (exptype == "income") {
      values = [id, title, exptype, amount];
    } else {
      values = [id, title, exptype, -amount];
    }
    const newUser = await client.query(text, values);
    client.release();
    return res.status(201).json({
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: `Internal Server error, ${err}`,
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { expenseid } = req.body;
    const { id } = req.user;
    const client = await getClient();
    const text = "DELETE FROM expense WHERE expenseid=$1 AND userid=$2";
    const values = [expenseid, id];
    const data = await client.query(text, values);
    client.release();
    if (!data.rowCount) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid expense id",
      });
    }
    return res.status(200).json({
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: `Internal Server error, ${err}`,
    });
  }
};
