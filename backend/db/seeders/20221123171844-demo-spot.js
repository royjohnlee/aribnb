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
        lat: 420.69,
        lng: 69.42,
        name: "A-House",
        description: "AAAA description",
        price: 19.99
      },
      {
        ownerId: 2,
        address: 'BBBB Address',
        city: "BBBB city",
        state: "BBBB state",
        country: " BBBB USA",
        lat: 222420.69,
        lng: 22269.420,
        name: "B-House",
        description: "BBBB description",
        price: 22219.99
      },
      {
        ownerId: 3,
        address: 'CCC Address',
        city: "CCC city",
        state: "CCC state",
        country: "CCC USA",
        lat: 333420.69,
        lng: 33369.420,
        name: "C-House",
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
