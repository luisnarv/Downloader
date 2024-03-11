const express = require("express");
const cors = require("cors");
const route = require("./route.js");

const app = express();

app.use(cors());
app.use("/", route);

module.exports = app;
