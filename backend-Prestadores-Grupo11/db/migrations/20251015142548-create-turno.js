'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Turnos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fechaHora: {
        type: Sequelize.DATE,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('solicitado','confirmado','realizado','cancelado'),
        allowNull: false,
        defaultValue: 'solicitado'
      },
      notas: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      afiliadoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Afiliados', key: 'id' },
        onDelete: 'CASCADE'
      },
      integranteId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Integrantes', key: 'id' },
        onDelete: 'SET NULL'
      },
      prestadorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Prestadors', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Turnos');
  }
};