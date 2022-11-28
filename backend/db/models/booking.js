'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: "userId" });
      Booking.belongsTo(models.Spot, { foreignKey: "spotId" });
    }
  }
  Booking.init({
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        valid(val) {
          const currentDate = Date();
          const valDate = new Date(val)
          if (valDate <= currentDate) {
            throw new Error("endDate cannot be on or before StartDate")
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
