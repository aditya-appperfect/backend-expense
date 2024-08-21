const { getClient } = require("../../connect");

exports.getExpenses = async (req, res) => {
  const { tag } = req.query;
  const { user } = req;
  const client = await getClient();
  let data = {
    exp: [],
    total: 0,
  };
  if (!tag) {
    const expenseResult = await client.query(
      `SELECT * FROM expense WHERE userid='${user.userid}'`
    );
    const totalResult = await client.query(
      `SELECT SUM(amount) AS total_income FROM expense WHERE userid='${user.userid}'`
    );
    data.exp = expenseResult.rows;
    data.total = totalResult.rows[0]?.total_income || 0;
  } else {
    const expenseResult = await client.query(
      `SELECT * FROM expense WHERE userid='${user.userid}' AND exptype='${tag}'`
    );
    const totalResult = await client.query(
      `SELECT SUM(amount) AS total_income FROM expense WHERE userid='${user.userid}' AND exptype='${tag}'`
    );
    data.exp = expenseResult.rows;
    data.total = totalResult.rows[0]?.total_income || 0;
  }
  client.release();
  return res.status(200).json({
    status: "success",
    data: data,
  });
};

exports.addExpenses = async (req, res) => {
  const { title, exptype, amount } = req.body;
  const { userid } = req.user;
  const client = await getClient();
  if (exptype == "income") {
    await client.query(`INSERT INTO expense (userid, title, exptype, amount)
  VALUES ('${userid}', '${title}', '${exptype}', '${amount}');`);
  } else {
    await client.query(`INSERT INTO expense (userid, title, exptype, amount)
    VALUES ('${userid}', '${title}', '${exptype}', '-${amount}');`);
  }
  client.release();
  return res.status(200).json({
    status: "success",
  });
};

exports.deleteExpense = async (req, res) => {
  const { expenseid } = req.body;
  const { userid } = req.user;
  const client = await getClient();
  const data = await client.query(
    `DELETE FROM expense WHERE expenseid='${expenseid}' AND userid='${userid}';`
  );
  console.log(data);
  client.release();
  return res.status(200).json({
    status: "success",
  });
};
