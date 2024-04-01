const DiscoverService = require("../Service/discover");
const { ErrorHandler, handleError } = require("../Util/Error.js");

class DiscoverController {
  async getDiscoverList(req, res) {
    try {
      const data = await DiscoverService.getDiscoverList();
      res.status(200).send({
        message: "Get discover success",
        data: data,
      });
    } catch (error) {
      return handleError(error, res);
    }
  }
}
module.exports = new DiscoverController();
