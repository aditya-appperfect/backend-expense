const express = require("express");
const auth_controller = require("../controllers/auth_controller.js");
const { body, validationResult, checkSchema } = require("express-validator");
const { getClient } = require("../../connect.js");
const { emailValid, passValid } = require("../validator.js");

const router = express.Router();

// router.post(
//   "/signup",
//   body("email").isEmail(),
//   body("pass").isStrongPassword(),
//   auth_controller.signup
// );
// let client;
// const fetchClient = async () => {
//   client = await getClient();
// };
// fetchClient();
// router.post(
//   "/testValidator",
//   body("addresses.**.here").isInt(),
//   body("siblings.*.name").notEmpty(),
//   body("email").custom(async (value) => {
//     const user = await client.query(
//       `SELECT * FROM users WHERE email='${value}'`
//     );
//     if (!user.rows.length) {
//       throw new Error("E-mail do not exists");
//     }
//   }),
//   (req, res) => {
//     const result = validationResult(req);
//     if (!result.isEmpty()) {
//       return res.send({ errors: result.array() });
//     }
//     return res.json(req.body);
//   }
// );
router.post("/login", emailValid(), passValid(), auth_controller.login);
router.post("/signup", auth_controller.signup);

module.exports = router;
