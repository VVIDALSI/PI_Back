const axios = require("axios");
const { Type } = require("../db");

const getAllTypes = async (req, res) => {
  try {
    const response = await Type.findAll();

    if (response.length > 0) {
      return res
        .status(200)
        .json({ message: "Lista de tipos completa" }, response);
    } else {
      const typesApi = await axios.get("https://pokeapi.co/api/v2/type");
      const types = typesApi.data.results;
      const existingTypes = await Type.findAll({
        where: { name: types.map((t) => t.name) },
      });
      const existingTypeNames = existingTypes.map((t) => t.name);
      const typesToCreate = types.filter(
        (t) => !existingTypeNames.includes(t.name)
      );
      const createdTypes = await Type.bulkCreate(typesToCreate);
      return res.status(201).json({
        message: "Los tipos de pokemon fueron creados con éxito",
        createdTypes: createdTypes,
      });
    }
  } catch {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTypes,
};
