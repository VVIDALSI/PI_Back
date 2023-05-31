const { Router } = require("express");
const {
  cratePokemon,
  getAllPokemons,
  getPokeByName,
  getPokeById,
} = require("../controllers/pokemonController");

const router = Router();

router
  .get("/", getAllPokemons)
  .post("/", cratePokemon)
  .get("/id/:id", getPokeById)
  .get("/name", getPokeByName);

module.exports = router;
