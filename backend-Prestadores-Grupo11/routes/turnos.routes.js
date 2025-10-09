const express = require("express");
const router = express.Router();

router.get('/afiliado/:id', (req, res) => {
  res.send(`Listar turnos para id ${req.params.id}`);
});

router.post('/:id', (req, res) => {
  res.send(`Agregar nota al turno para id ${req.params.id}`);
});

module.exports = router;