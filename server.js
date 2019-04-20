const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// 引入users.js
const users = require("./routes/api/users");
// 引入profiles.js
const profiles = require("./routes/api/profiles");

// DB config
const url = require("./config/keys").mongoURI;

// Conected to mongodb
mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log("************************ Database connected success! ************************");
  })
  .catch(err => {
    console.log(err);
  });

// 使用routes
app.use("/api/users", users);
app.use("/api/profiles", profiles);

const port = process.env.PORT || 5000;

// passport 初始化
app.use(passport.initialize());
require("./config/passport")(passport);

app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});
