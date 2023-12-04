const CampaignService = require("../Service/campaign.js");
const { ErrorHandler, handleError } = require("../Util/Error.js");

class CampaignController {
  async readCampaignList(req, res) {
    // console.log(req.headers.authorization);
    const { userId } = req.query;
    // console.log(userId);

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
      // console.log(error);
      // res.status(500).send({
      //   message: "Get campaign fail",
      //   data: error,
      // });
    }
  }
  async readCampaignById(req, res) {
    const { id } = req.params;
    try {
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
      // res.status(500).send({
      //   message: "Get campaign fail",
      //   data: error,
      // });
    }
  }
  async createCampaign(req, res) {
    try {
      const data = await CampaignService.createCampaign(req.body);
      res.status(200).send({
        message: "Create campaign success",
        // data: data
      });
    } catch (error) {
      res.status(500).send({
        message: "Create campaign fail",
        data: error,
      });
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
      // res.status(500).send({
      //   message: "Update campaign fail",
      //   data: error,
      // });
    }
  }
  async deleteCampaign(req, res) {
    try {
      if (req.params.id == null) {
        throw new ErrorHandler(400, "Campaign id is required");
      }

      const data = await CampaignService.deleteCampaign(req.params.id);
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
      // res.status(500).send({
      //   message: "Delete campaign fail",
      //   data: error,
      // });
    }
  }
  async uploadCampaignImage(req, res) {
    try {
      const data = await CampaignService.uploadImage(req.file);
      res.status(200).send({
        message: "Upload campaign image success",
        data: data,
      });
    } catch (error) {
      return handleError(error, res);
    }
  }
  async joinCampaign(req, res) {
    try {
      const data = await CampaignService.joinCampaign(req.body);
      if (data.status === "error") {
        throw new ErrorHandler(400, data.message);
      } else if (data.status === "success") {
        res.status(200).send({
          message: data.message,
          // data: data
        });
      }
    } catch (error) {
      return handleError(error, res);
      // res.status(500).send({
      //   message: "Join campaign fail",
      //   data: error,
      // });
    }
  }
}
module.exports = new CampaignController();
// const db = require('../Config/db.js');

// // exports.read = async (req, res) => {
// //   console.log(req.query);
// //   const { target, sortBy } = req.query;
// //   console.log(target);
// //   console.log(sortBy);
// //   res.send(`Your target is: ${target} \n and sort by: ${sortBy}`);
// // }

// exports.readCampaignList = async (req, res) => {
//   db('campaign').then(data => {
//     res.status(200).send({
//       message: 'Get campaign success',
//       data: data
//     })
//   }).catch(err => {
//     res.status(500).send({
//       message: 'Get campaign fail',
//       data: err
//     })
//   })
// }
// exports.readCampaignId = async (req, res) => {
//   const { id } = req.params;
//   db('campaign').where('campaignId', id).then(data => {
//     res.status(200).send({
//       message: 'Get campaign success',
//       data: data
//     })
//    }
//   ).catch(err => {
//     res.status(500).send({
//       message: 'Get campaign fail',
//       data: err
//     })
//   })
// }

// exports.create = async (req, res) => {
//   const { body } = req;
//   console.log(body);
//   res.send(`Your campaign is created`);
// }
