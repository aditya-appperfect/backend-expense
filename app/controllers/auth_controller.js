const { getClient } = require("../../connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  query,
  validationResult,
  matchedData,
  body,
} = require("express-validator");

exports.allUser = async (req, res) => {
  const client = await getClient();
  const data = await client.query(`SELECT * FROM users`);
  client.release();
  return res.status(200).json({
    status: "success",
    data: data.rows,
  });
};

exports.signup = async (req, res) => {
  const { email, pass } = req.body;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.send({ errors: result.array() });
  }
  const client = await getClient();
  const data = await client.query(`SELECT * FROM users WHERE email='${email}'`);
  const users = data.rows;

  if (users.length) {
    return res.status(400).json({
      status: "fail",
      message: "Email already exists",
    });
  }

  const encryptedPass = await bcrypt.hash(pass, 12);

  const newUser = await client.query(`INSERT INTO users (email, pass)
  VALUES ('${email}', '${encryptedPass}');`);
  client.release();

  const token = jwt.sign(
    { email },
    process.env.USER_VERIFICATION_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  return res.status(201).json({
    status: "success",
    Token: token,
  });
};

exports.login = async (req, res) => {
  const { email, pass } = req.body;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.send({ errors: result.array() });
  }

  const client = await getClient();
  const data = await client.query(`SELECT * FROM users WHERE email='${email}'`);
  client.release();
  const user = data.rows[0];

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Email dosen't exists",
    });
  }

  if (!(await bcrypt.compare(pass, user.pass))) {
    return res.status(400).json({
      status: "fail",
      message: "Email or password is incorrect",
    });
  }

  const token = jwt.sign(
    { email },
    process.env.USER_VERIFICATION_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  return res.status(200).json({
    status: "success",
    Token: token,
    data: {
      email: user.email,
    },
  });
};

exports.protect = async (req, res, next) => {
  let token;
  if (req.get("Token")) {
    token = req.get("Token");
  }

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "You are not loged in please login",
    });
  }

  let decoded = "";
  try {
    jwt.verify(
      token,
      process.env.USER_VERIFICATION_TOKEN_SECRET,
      (err, dec) => {
        if (err) {
          throw err;
        } else {
          decoded = dec;
        }
      }
    );
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid Token",
      error: err,
    });
  }

  const client = await getClient();
  const data = await client.query(
    `SELECT * FROM users WHERE email='${decoded?.email}'`
  );
  const currentUser = data?.rows[0];

  if (!currentUser) {
    return res.status(401).json({
      status: "fail",
      message: "No user exists",
    });
  }

  req.user = currentUser;
  next();
};
