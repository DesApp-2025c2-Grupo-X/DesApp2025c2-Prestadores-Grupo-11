'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Consulta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Consulta.belongsTo(models.Turno, {
        foreignKey: 'turnoId',
        as: 'turno'
      });

      Consulta.belongsTo(models.Prestador, {
        foreignKey: 'prestadorId',
        as: 'prestador'
      });

      Consulta.belongsTo(models.Afiliado, {
        foreignKey: 'afiliadoId',
        as: 'afiliado'
      });

      Consulta.belongsTo(models.Integrante, {
        foreignKey: 'integranteId',
        as: 'integrante'
      });
    }
  }
  Consulta.init({
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    turnoId: { type: DataTypes.INTEGER, allowNull: false },
    prestadorId: { type: DataTypes.INTEGER, allowNull: false },
    afiliadoId: { type: DataTypes.INTEGER, allowNull: false },
    integranteId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize,
    modelName: 'Consulta',
  });
  return Consulta;
};