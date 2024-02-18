const express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "Service/fileUploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
// const upload = multer({ dest: "Service/fileUploads" });
const router = express.Router();

const CampaignController = require("../Controllers/campaign");

router
  .route("/campaign")
  .get(CampaignController.readCampaignList)
  .post(CampaignController.createCampaign)
  .delete(CampaignController.deleteCampaign);

router
  .route("/campaign/:id")
  .get(CampaignController.readCampaignById)
  .patch(CampaignController.updateCampaign);

router
  .route("/campaign/upload-img")
  .post(upload.single("image"), CampaignController.uploadCampaignImage);

router.route("/campaign/join").post(CampaignController.joinCampaign);

module.exports = router;
