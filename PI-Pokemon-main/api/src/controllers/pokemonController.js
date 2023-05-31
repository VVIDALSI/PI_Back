axios = require("axios");
const { Pokemon, Type, Op } = require("../db");

const cratePokemon = async (req, res) => {
  try {
    let { id, name, sprites, stats, height, weight, types } = req.body;

    name = name.trim();

    //Valida si se esta enviando toda la informacion por body
    if (!id || !name || !sprites || !stats || !height || !weight || !types) {
      return res
        .status(400)
        .json({ message: "Faltan campos obligatorios en la solicitud" });
    }

    //Valida si ya existe el pokemon en la BDD
    const pokeFound = await Pokemon.findOne({ where: { name: name } });

    if (pokeFound) {
      return res.status(500).json({ message: "El pokemon ya existe" });
    }

    //Extrae campos especificaos
    let minValue = 0;
    const maxValue = 8000;

    let image = sprites.other.dream_world.front_default;
    let hp = stats[0]["base_stat"];
    let attack = stats[1]["base_stat"];
    let defense = stats[2]["base_stat"];
    let speed = stats[5]["base_stat"];
    let type1 = types[0].type.name;
    let type2 = types[1].type.name;
    // let type = types.type.name;

    

    let specificCamps = [hp, attack, defense, speed, height, weight];

    let nameOfSpecificCammps = [
      "hp",
      "attack",
      "defense",
      "speed",
      "height",
      "weght",
    ];

    //Valida los campos especificos

    for (i = 0; i <= 5; i++) {
      let intValue = parseInt(specificCamps[i], 10);
      if (isNaN(intValue) || !Number.isInteger(intValue)) {
        return res.status(400).json({
          message: `El valor de ( ${nameOfSpecificCammps[i]}: ${specificCamps[i]} ) debe ser un número entero`,
        });
      }

      if (nameOfSpecificCammps[i] === "hp") {
        minValue = 10;
      } else {
        minValue = 0;
      }

      if (specificCamps[i] < minValue || specificCamps[i] > maxValue) {
        return res.status(400).json({
          message: `El valor ( ${nameOfSpecificCammps[i]}: ${specificCamps[i]} ) debe estar entre ${minValue} y ${maxValue}`,
        });
      }
    }

    let pokemonCreated = await Pokemon.create({
      id,
      name,
      image,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      types,
    });

    let typeFound = await Type.findOne({where:{name:type1}});

    await pokemonCreated.addType(typeFound);

    typeFound = await Type.findOne({where:{name:type2}});

    await pokemonCreated.addType(typeFound);

    // let type1 = types[0].type.name;
    // let type = "grass"

    // await pokemonCreated.addType("type",type);

    // for(i=0;i<=typesLength;i++){
    //   await pokemonCreated.addType(types[i].type.name)
    // }

    // console.log(types[0].type.name);
    //   await pokemonCreated.addType(typeFoud);

    return res.status(201).json({
      message: "Personaje creado correctamente",
      pokemon: pokemonCreated,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllPokemons = async (req, res) => {
  try {
    let response = await Pokemon.findAll({ include: { model: Type } });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPokeById = async (req, res) => {
  try {
    const { id } = req.params;
    let response = await Pokemon.findByPk(id);

    if (!response) {
      const findByIdOfApi = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${id}`
      );

      if (findByIdOfApi.status !== 200) {
        return res.status(500).json({ message: "El ID no existe" });
      }

      let { name, sprites, stats, height, weight } = findByIdOfApi.data;

      name = name.trim();

      //Valida si se esta enviando toda la informacion por body
      if (!id || !name || !sprites || !stats || !height || !weight) {
        return res
          .status(400)
          .json({ message: "Faltan campos obligatorios en la solicitud" });
      }

      //Valida si ya existe el pokemon en la BDD
      const pokeFound = await Pokemon.findOne({ where: { name: name } });

      if (pokeFound) {
        return res.status(500).json({ message: "El pokemon ya existe" });
      }

      //Extrae campos especificaos
      let minValue = 0;
      const maxValue = 8000;

      let image = sprites.other.dream_world.front_default;
      let hp = stats[0]["base_stat"];
      let attack = stats[1]["base_stat"];
      let defense = stats[2]["base_stat"];
      let speed = stats[5]["base_stat"];

      let specificCamps = [hp, attack, defense, speed, height, weight];

      let nameOfSpecificCammps = [
        "hp",
        "attack",
        "defense",
        "speed",
        "height",
        "weght",
      ];

      //Valida los campos especificos

      for (i = 0; i <= 5; i++) {
        let intValue = parseInt(specificCamps[i], 10);
        if (isNaN(intValue) || !Number.isInteger(intValue)) {
          console.log(specificCamps[i]);
          console.log(specificCamps[i]);
          return res.status(400).json({
            message: `El valor de ( ${nameOfSpecificCammps[i]}: ${specificCamps[i]} ) debe ser un número entero`,
          });
        }

        if (nameOfSpecificCammps[i] === "hp") {
          minValue = 10;
        } else {
          minValue = 0;
        }

        if (specificCamps[i] < minValue || specificCamps[i] > maxValue) {
          return res.status(400).json({
            message: `El valor ( ${nameOfSpecificCammps[i]}: ${specificCamps[i]} ) debe estar entre ${minValue} y ${maxValue}`,
          });
        }
      }

      let pokemonCreated = {
        id,
        name,
        image,
        hp,
        attack,
        defense,
        speed,
        height,
        weight,
      };

      response = pokemonCreated;
      return res
        .status(200)
        .json({ message: "Pokemon encontrado en la API", response });
    }

    return res
      .status(200)
      .json({ message: "Pokemon encontrado en la BDD", response });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPokeByName = async (req, res) => {
  try {
    let { name } = req.query;
    let response = await Pokemon.findOne({
      where: {
        name: {
          [Op.iLike]: "%" + name + "%",
        },
      },
    });

    if (!response) {
      let findNameApi = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      );
      let {
        id,
        name: apiName,
        sprites,
        stats,
        height,
        weight,
      } = findNameApi.data;

      //Valida si se esta enviando toda la informacion por body
      if ((!id, !apiName || !sprites || !stats || !height || !weight)) {
        return res
          .status(400)
          .json({ message: "Faltan campos obligatorios en la solicitud" });
      }

      //Extrae campos especificaos
      let minValue = 0;
      const maxValue = 8000;

      let image = sprites.other.dream_world.front_default;
      let hp = stats[0]["base_stat"];
      let attack = stats[1]["base_stat"];
      let defense = stats[2]["base_stat"];
      let speed = stats[5]["base_stat"];

      let specificCamps = [hp, attack, defense, speed, height, weight];

      let nameOfSpecificCammps = [
        "hp",
        "attack",
        "defense",
        "speed",
        "height",
        "weght",
      ];

      //Valida los campos especificos

      for (i = 0; i <= 5; i++) {
        let intValue = parseInt(specificCamps[i], 10);
        if (isNaN(intValue) || !Number.isInteger(intValue)) {
          console.log(specificCamps[i]);
          console.log(specificCamps[i]);
          return res.status(400).json({
            message: `El valor de ( ${nameOfSpecificCammps[i]}: ${specificCamps[i]} ) debe ser un número entero`,
          });
        }

        if (nameOfSpecificCammps[i] === "hp") {
          minValue = 10;
        } else {
          minValue = 0;
        }

        if (specificCamps[i] < minValue || specificCamps[i] > maxValue) {
          return res.status(400).json({
            message: `El valor ( ${nameOfSpecificCammps[i]}: ${specificCamps[i]} ) debe estar entre ${minValue} y ${maxValue}`,
          });
        }
      }

      let pokemonApi = {
        id,
        name,
        image,
        hp,
        attack,
        defense,
        speed,
        height,
        weight,
      };

      // response = pokemonApi;
      return res
        .status(200)
        .json({ message: "Pokemon encontrado en la API", pokemonApi });
    }
    return res
      .status(200)
      .json({ message: "Pokemon encontrado en la BDD", response });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Pokemon no fue encontrado por nombre" });
  }
};

module.exports = {
  cratePokemon,
  getAllPokemons,
  getPokeById,
  getPokeByName,
};
