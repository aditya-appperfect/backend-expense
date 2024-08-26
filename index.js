const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { query, body } = require("express-validator");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(cookieParser());

app.use(
  "/auth",
  require("./app/routes/auth_routes.js")
);
app.use("/expenditure", require("./app/routes/expense_routes.js"));

app.get("/", (req, res) => {
  res.end("Hello from server");
});

app.listen(3500, () => {
  console.log(`App running on http://localhost:3500`);
});
