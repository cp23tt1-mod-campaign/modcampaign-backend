const db = require("../Config/db.js");

class DiscoverService {
  async getDiscoverList() {
    const table = db("discover");
    const data = await table.select();
    return data;
  }
}
module.exports = new DiscoverService();
