'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        review: "This was an 5 spot!",
        stars: 5,
      },
      {
        spotId: 1,
        userId: 3,
        review: "This was an 4 spot!",
        stars: 4,
      },

      {
        spotId: 2,
        userId: 1,
        review: "This was a 3 spot!",
        stars: 3,
      },
      {
        spotId: 2,
        userId: 3,
        review: "This was a 1 spot!",
        stars: 1,
      },

      {
        spotId: 3,
        userId: 1,
        review: "This was a 2 spot!",
        stars: 3,
      },
      {
        spotId: 3,
        userId: 2,
        review: "This was a 2 spot!",
        stars: 3,
      },

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options, {})
  }
};
