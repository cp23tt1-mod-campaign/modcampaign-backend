const express = require("express");
require("dotenv").config();
const db = require("./Config/knexfile");

// const campaignRouter = require('./Routes/campaign');
const { readdirSync } = require("fs");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const { auth } = require("./Middleware/auth");
// const mydb = require('./Config/db.js')
// const ldapAuth = require('ldapauth-fork');

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // console.log("HTTP Method: ", req.method);
  // console.log("URL", req.url);
  auth(req, res, next);
  // next();
});

readdirSync("./Routes").map((route) => {
  app.use("/api", require("./Routes/" + route));
});

app.listen(port, () => {
  console.log(`ModCampaign API running on port ${port}!!!`);
});
