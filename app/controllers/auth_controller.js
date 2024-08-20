const { getClient } = require("../../connect");

exports.getData = async (req, res) => {
  const client = await getClient();
  const data = await client.query(`SELECT * FROM users`);
  return res.status(200).json({
    status: "success",
    data: data.rows,
  });
};
