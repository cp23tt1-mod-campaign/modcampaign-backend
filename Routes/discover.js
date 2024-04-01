const express = require("express");
const router = express.Router();
const DiscoverController = require("../Controllers/discover");

router.route("/discover").get(DiscoverController.getDiscoverList);

module.exports = router;
