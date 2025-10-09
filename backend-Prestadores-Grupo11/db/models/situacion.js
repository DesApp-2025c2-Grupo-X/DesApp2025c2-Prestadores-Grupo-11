'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Situacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Situacion.belongsTo(models.Integrante, {
        foreignKey: 'integranteId',
        as: 'integrante'
      });
    }
  }
  Situacion.init({
    titulo: {type: DataTypes.STRING, allowNull: false},
    estado: {type: DataTypes.STRING, allowNull: false},
    integranteId: {type: DataTypes.INTEGER}
  }, {
    sequelize,
    modelName: 'Situacion',
  });
  return Situacion;
};