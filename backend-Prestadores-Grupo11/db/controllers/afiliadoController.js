const { Afiliado, Integrante, Situacion } = require('../models');

module.exports = {
  async getHistoriaClinica(req, res) {
    try {
      const { id } = req.params;
      const afiliado = await Afiliado.findByPk(id, {
        include: {
          model: Integrante,
          as: 'integrantes',
          include: {
            model: Situacion,
            as: 'situaciones'
          }
        }
      });

      if (!afiliado) return res.status(404).json({ error: 'Afiliado no encontrado' });
      res.status(200).json(afiliado);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener historia clínica' });
    }
  }
};