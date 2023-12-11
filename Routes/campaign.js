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

router
  .route("/campaign-categories")
  .get(CampaignController.readCampaignCategories);

// router.get("/getPersonalHealth/:id", (req, res) => {
//   console.log(req.params);
//   const { id } = req.params;
//   console.log(id);
//   res.send(`Your personal health id is: ${id}`);
// });

// router.post("/createCampaign", (req, res) => {
//   // const body = req.body;
//   const jsonBody = JSON.stringify(req.body);
//   console.log(jsonBody);
//   console.log(req.body);

//   res.status(201);
//   res.send(`Your campaign is created`);
// });

module.exports = router;
