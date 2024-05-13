const CampaignService = require("../Service/campaign.js");
const { ErrorHandler, handleError } = require("../Util/Error.js");

class CampaignController {
  async readCampaignList(req, res) {
    const { userId } = req.query;
    try {
      if (userId === undefined) {
        throw new ErrorHandler(400, "User id is required");
      }
      const data = await CampaignService.readCampaignList(req.query);
      res.status(200).send({
        message: "Get campaign success",
        data: data,
      });
    } catch (error) {
      return handleError(error, res);
    }
  }
  async readCampaignById(req, res) {
    const { id } = req.params;
    try {
      if (id === undefined) {
        throw new ErrorHandler(400, "Campaign id is required");
      }
      const data = await CampaignService.readCampaignById(id);
      if (data.status === "notFound") {
        throw new ErrorHandler(404, data.message);
      } else {
        res.status(200).send({
          message: "Get campaign success",
          data: data,
        });
      }
    } catch (error) {
      return handleError(error, res);
    }
  }
  async getLeaderBoard(req, res) {
    const { campaignId, userId, limit } = req.query;
    try {
      const data = await CampaignService.getLeaderBoard(
        campaignId,
        userId,
        limit
      );
      if (data.status === "error") {
        res.status(400).send({
          statusCode: 400,
          message: data.message,
          data: data.data,
        });
      } else if (data.status === "success") {
        res.status(200).send({
          message: data.message,
          data: data.data,
        });
      }
    } catch (error) {
      return handleError(error, res);
    }
  }
  async updateLeaderBoard(req, res) {
    const { campaignId, userId, targetValue } = req.body;
    try {
      const data = await CampaignService.updateLeaderBoard(
        campaignId,
        userId,
        targetValue
      );
      if (data.status === "error") {
        throw new ErrorHandler(400, data.message);
      } else {
        res.status(200).send({
          message: data.message,
          data: data,
        });
      }
    } catch (error) {
      return handleError(error, res);
    }
  }
  async createCampaign(req, res) {
    try {
      const data = await CampaignService.createCampaign(req.body);
      if (data.status === "error") {
        throw new ErrorHandler(400, data.message);
      } else if (data.status === "success") {
        res.status(200).send({
          status: data.status,
          statusCode: 200,
          message: data.message,
        });
      }
    } catch (error) {
      return handleError(error, res);
    }
  }
  async updateCampaign(req, res) {
    try {
      if (req.params.id == null) {
        throw new ErrorHandler(400, "Campaign id is required");
      }
      const data = await CampaignService.updateCampaign(
        req.params.id,
        req.body
      );
      res.status(200).send({
        message: "Update campaign success",
        // data: data
      });
    } catch (error) {
      return handleError(error, res);
    }
  }
  async deleteCampaign(req, res) {
    const { campaignId, userId } = req.query;
    try {
      if (userId === null) {
        throw new ErrorHandler(400, "User id is required");
      }
      if (campaignId === null) {
        throw new ErrorHandler(400, "Campaign id is required");
      }

      const data = await CampaignService.deleteCampaign(campaignId, userId);
      if (data.status === "notFound") {
        throw new ErrorHandler(404, data.message);
      } else if (data.status === "error") {
        throw new ErrorHandler(400, data.message);
      } else if (data.status === "success") {
        res.status(200).send({
          message: "Delete campaign success",
          // data: data
        });
      }
    } catch (error) {
      return handleError(error, res);
    }
  }
  async uploadCampaignImage(req, res) {
    try {
      const data = await CampaignService.uploadImage(req.file);
      console.log(data);
      if (data.success) {
        res.status(200).send({
          message: data.message,
          fileName: data.fileName,
        });
      } else {
        throw new ErrorHandler(400, data.message);
      }
    } catch (error) {
      return handleError(error, res);
    }
  }
  async joinCampaign(req, res) {
    try {
      const data = await CampaignService.joinCampaign(req.body);
      console.log(data);
      if (data.status === "error") {
        throw new ErrorHandler(400, data.message);
      } else if (data.status === "success") {
        res.status(200).send({
          message: data.message,
          // data: data
        });
      }
    } catch (error) {
      console.log(error);
      return handleError(error, res);
    }
  }
  async claimReward(req, res) {
    const { campaignId, userId, email } = req.body;

    if (userId === null) {
      throw new ErrorHandler(400, "User id is required");
    }
    if (campaignId === null) {
      throw new ErrorHandler(400, "Campaign id is required");
    }
    try {
      const data = await CampaignService.claimReward(campaignId, userId);
      console.log(data);
      if (data.status === "error") {
        throw new ErrorHandler(400, data.message);
      } else if (data.status === "success") {
        res.status(200).send({
          message: data.message,
          // data: data
        });
      }
    } catch (error) {
      console.log(error);
      return handleError(error, res);
    }
  }
}
module.exports = new CampaignController();
