'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Consultas', [
      {
        descripcion: 'Consulta general de rutina',
        fecha: new Date('2025-10-15T09:00:00'),
        turnoId: 1,
        prestadorId: 1,
        afiliadoId: 1,
        integranteId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'Chequeo de seguimiento',
        fecha: new Date('2025-10-15T10:30:00'),
        turnoId: 2,
        prestadorId: 2,
        afiliadoId: 2,
        integranteId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'Consulta odontológica',
        fecha: new Date('2025-10-17T09:30:00'),
        turnoId: 2,
        prestadorId: 2,
        afiliadoId: 1,
        integranteId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Consultas', null, {});
  }
};