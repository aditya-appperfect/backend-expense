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
  try {
    const client = await getClient();
    const data = await client.query(`SELECT * FROM users`);
    client.release();
    return res.status(200).json({
      status: "success",
      data: data.rows,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: `Internal Server error, ${err}`,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, pass } = req.body;
    const client = await getClient();
    const text1 = "SELECT * FROM users WHERE email=$1";
    const values1 = [email];
    const data = await client.query(text1, values1);
    const users = data.rows;

    if (users.length) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists",
      });
    }

    const encryptedPass = await bcrypt.hash(pass, 12);

    const text2 = "INSERT INTO users (email, pass) VALUES ($1, $2)";
    const values2 = [email, encryptedPass];
    const newUser = await client.query(text2, values2);

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
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: `Internal Server error, ${err}`,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, pass } = req.body;
    const client = await getClient();
    const text = "SELECT * FROM users WHERE email=$1";
    const values = [email];
    const data = await client.query(text, values);

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
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: `Internal Server error, ${err}`,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
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
    const text = "SELECT * FROM users WHERE email=$1";
    const values = [decoded?.email];
    const data = await client.query(text, values);
    client.release();
    const currentUser = data?.rows[0];

    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "No user exists",
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: `Internal Server error, ${err}`,
    });
  }
};

exports.checkRole = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user;
    if (user.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
