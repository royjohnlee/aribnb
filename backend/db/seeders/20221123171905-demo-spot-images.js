'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "1aSpotImages.com",
        preview: true
      },
      {
        spotId: 2,
        url: "22222SpotImages.com",
        preview: true
      },
      {
        spotId: 3,
        url: "3aSpotImages.com",
        preview: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options, {})
  }
};
