const { Prestador } = require('../models')

const getPrestadores = async (_, res) => {
  try {
    const prestadores = await Prestador.findAll();
    res.json(prestadores);
  } catch (err) { res.status(500).json({ error: err.message });}
};

module.exports = { getPrestadores }