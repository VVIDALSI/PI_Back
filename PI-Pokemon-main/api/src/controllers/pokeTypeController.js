// const axios = require("axios");
const { Type } = require("../db");

const getAllTypes = async (req, res) => {
  try {
    const foundTypes = await Type.findAll();

    if (foundTypes.length > 0) {
      return res
        .status(200)
        .json(foundTypes);
    } else {
      const typesApi = await axios.get("https://pokeapi.co/api/v2/type");
      const typesApiData = typesApi.data.results;
      const existingTypes = await Type.findAll({
        where: { name: typesApiData.map((t) => t.name) },
      });
      const existingTypeNames = existingTypes.map((t) => t.name);
      const typesToCreate = typesApiData.filter(
        (t) => !existingTypeNames.includes(t.name)
      );
      const createdTypes = await Type.bulkCreate(typesToCreate);
      return res.status(201).json({
        message: "Los tipos de pokemon fueron creados con éxito",
        createdTypes: createdTypes,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTypes,
};