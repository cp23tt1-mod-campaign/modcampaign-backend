const express = require("express");
const router = express.Router();
const CampaignCategoriesController = require("../Controllers/campaign-categories");

router
  .route("/campaign-categories")
  .get(CampaignCategoriesController.readCampaignCategories);

module.exports = router;
