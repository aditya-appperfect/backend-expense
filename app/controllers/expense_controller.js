const { getClient } = require("../../connect");

exports.getExpenses = async (req, res) => {
  const { tag } = req.query;
  const { user } = req;
  const client = await getClient();
  let data = {
    exp: [],
    total: 0,
  };
  if (tag == "all") {
    const expenseResult = await client.query(
      `SELECT * FROM expense WHERE userid='${user.id}'`
    );
    const totalResult = await client.query(
      `SELECT SUM(amount) AS total_income FROM expense WHERE userid='${user.id}'`
    );
    data.exp = expenseResult.rows;
    data.total = totalResult.rows[0]?.total_income || 0;
  } else {
    const expenseResult = await client.query(
      `SELECT * FROM expense WHERE userid='${user.id}' AND exptype='${tag}'`
    );
    const totalResult = await client.query(
      `SELECT SUM(amount) AS total_income FROM expense WHERE userid='${user.id}' AND exptype='${tag}'`
    );
    data.exp = expenseResult.rows;
    data.total = totalResult.rows[0]?.total_income || 0;
  }
  client.release();
  return res.status(200).json({
    status: "success",
     data,
  });
};

exports.addExpenses = async (req, res) => {
  const { title, exptype, amount } = req.body;
  const { id } = req.user;
  const client = await getClient();
  if (exptype == "income") {
    await client.query(`INSERT INTO expense (userid, title, exptype, amount)
  VALUES ('${id}', '${title}', '${exptype}', '${amount}');`);
  } else {
    await client.query(`INSERT INTO expense (userid, title, exptype, amount)
    VALUES ('${id}', '${title}', '${exptype}', '-${amount}');`);
  }
  client.release();
  return res.status(200).json({
    status: "success",
  });
};

exports.deleteExpense = async (req, res) => {
  const { expenseid } = req.body;
  const { id } = req.user;
  const client = await getClient();
  const data = await client.query(
    `DELETE FROM expense WHERE expenseid='${expenseid}' AND userid='${id}';`
  );
  client.release();
  return res.status(200).json({
    status: "success",
  });
};
