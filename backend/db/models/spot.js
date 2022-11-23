'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, { foreignKey: "ownerId" }); // user

      Spot.hasMany(models.Booking, { foreignKey: "spotId", onDelete: 'CASCADE' }); // booking

      Spot.hasMany(models.Review, { foreignKey: "spotId", onDelete: 'CASCADE' }); // review

      Spot.hasMany(models.SpotImage, { foreignKey: "spotId", onDelete: 'CASCADE' }); // spot image

    }
  }
  Spot.init({
    ownerId: { type: DataTypes.INTEGER },
    address: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING, },
    state: { type: DataTypes.STRING, },
    country: { type: DataTypes.STRING, },
    lat: { type: DataTypes.DECIMAL },
    lng: { type: DataTypes.DECIMAL },
    name: { type: DataTypes.STRING, },
    description: { type: DataTypes.STRING, },
    price: { type: DataTypes.DECIMAL }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
