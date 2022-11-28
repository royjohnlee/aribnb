'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotId: {
        allowNull: false,
        // references: { model: 'Spots' },
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        // references: { model: 'Users' },
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.DATEONLY,
        //  unique: true, ask TYLER
      },
      endDate: {
        type: Sequelize.DATEONLY,
        // unique: true, ask TYLER
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
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings"
    return queryInterface.dropTable(options);
  }
};
