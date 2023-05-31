const { Router } = require("express");
const {
  getAllTypes,
} = require("../controllers/pokeTypeController");

const router = Router();
router.get("/", getAllTypes);

module.exports = router;
