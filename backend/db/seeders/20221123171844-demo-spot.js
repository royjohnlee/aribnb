'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '1748 circle drive',
        city: "TownsVille",
        state: "California",
        country: "USA",
        name: "A-House",
        lat: 420.69,
        lng: 69.42,
        description: "AAAA description",
        price: 19.99
      },
      {
        ownerId: 2,
        address: 'BBBB Address',
        city: "BBBB city",
        state: "BBBB state",
        country: " BBBB USA",
        name: "B-House",
        lat: 222420.69,
        lng: 22269.420,
        description: "BBBB description",
        price: 22219.99
      },
      {
        ownerId: 3,
        address: 'CCC Address',
        city: "CCC city",
        state: "CCC state",
        country: "CCC USA",
        name: "C-House",
        lat: 333420.69,
        lng: 33369.420,
        description: "CCCC description",
        price: 33319.99
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    // const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
