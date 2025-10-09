'use strict';

const { Prestador } = require('../models'); // Asegurate de la ruta correcta si es distinto

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Prestador.bulkCreate([
        {
          username: "medico",
          password: "12345",
          role: "medico",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: "centro medico",
          password: "9876",
          role: "centro_medico",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      console.log("Prestadores insertados correctamente");
    } catch (err) {
      console.error("Error insertando prestadores:", err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await Prestador.destroy({ where: {}, truncate: true });
      console.log("Prestadores eliminados correctamente");
    } catch (err) {
      console.error("Error eliminando prestadores:", err);
    }
  }
};