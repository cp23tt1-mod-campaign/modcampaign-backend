// const _ = require("lodash");
const dataMapper = (models, dto) => {
  if (Array.isArray(models)) {
    const ArrayDTO = models.map((model) => {
      const ObjectDTO = {};
      for (const [key, value] of Object.entries(dto)) {
        ObjectDTO[key] = model[value];
      }
      return ObjectDTO;
    });

    return ArrayDTO;
  } else {
    const ObjectDTO = {};
    for (const [key, value] of Object.entries(dto)) {
      ObjectDTO[key] = models[value];
    }
    return ObjectDTO;
  }
};
module.exports = {
  dataMapper,
};
