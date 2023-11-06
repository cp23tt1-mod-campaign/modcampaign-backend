const CampaignService = require('../Service/campaign.js');

class CampaignController {
  async readCampaignList(req, res) {
    try {
      const data = await CampaignService.readCampaignList()
      res.status(200).send({
          message: 'Get campaign success',
          data: data
        })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Get campaign fail',
        data: error
      })
    }
  }
  async readCampaignById(req, res) {
    try {
      const data = await CampaignService.readCampaignById(req.params.id)
      res.status(200).send({
          message: 'Get campaign success',
          data: data
        })
    } catch (error) {
      res.status(500).send({  
        message: 'Get campaign fail',
        data: error
      })
    }
  }
  async createCampaign(req, res) {
    try {
      const data = await CampaignService.createCampaign(req.body)
      res.status(200).send({
          message: 'Create campaign success',
          // data: data
        })
    } catch (error) {
      res.status(500).send({  
        message: 'Create campaign fail',
        data: error
      })
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
