const express = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: ["*"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(cookieParser());

app.use("/auth", require("./app/routes/auth_routes.js"));

app.get("/", (req, res) => {
  res.end("Hello from server");
});

app.listen(3500, () => {
  console.log(`App running on http://localhost:3500`);
});
