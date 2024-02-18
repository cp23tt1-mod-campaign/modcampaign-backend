const CampaignCategoriesService = require("../Service/campaign-categories");
const { ErrorHandler, handleError } = require("../Util/Error.js");

class CampaignCategoriesController {
  async readCampaignCategories(req, res) {
    try {
      const data = await CampaignCategoriesService.readCampaignCategories();
      res.status(200).send({
        message: "Get campaign categories success",
        data: data,
      });
    } catch (error) {
      return handleError(error, res);
    }
  }
}
module.exports = new CampaignCategoriesController();
