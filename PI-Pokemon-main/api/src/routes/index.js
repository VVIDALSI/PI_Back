const { Router } = require("express");
const pokeRoutes = require("./pokeRoutes");
const typesRoutes = require("./typesRoutes");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/pokemon", pokeRoutes).use("/poketypes", typesRoutes);

module.exports = router;
