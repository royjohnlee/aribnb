'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Bookings"
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: '2022-11-28',
        endDate: '2022-11-29',
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2022-11-28',
        endDate: '2022-11-29',
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2022-11-30',
        endDate: '2022-12-20',
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings'
    return queryInterface.bulkDelete(options, {})

  }
};
