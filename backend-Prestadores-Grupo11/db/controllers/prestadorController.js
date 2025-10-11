const { Prestador } = require('../models');

module.exports = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const prestador = await Prestador.findOne({ where: { username, password } });

      if (!prestador) return res.status(401).json({ error: 'Credenciales inválidas' });
      res.status(200).json({ message: 'Login exitoso', prestador });
    } catch (error) {
      res.status(500).json({ error: 'Error en el login' });
    }
  }
};