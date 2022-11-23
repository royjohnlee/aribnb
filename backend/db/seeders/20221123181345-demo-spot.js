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
        address: '1748 circle drive',
        city: "TownsVille",
        state: "California",
        country: "USA",
        ownerId: 1,
        name: "A-House",
        lat: 420.69,
        lng: 69.42,
        description: "big booty mama",
        price: 19.99
      },
      {
        address: 'BBBB Address',
        city: "BBBB city",
        state: "BBBB state",
        country: " BBBB USA",
        ownerId: 2,
        name: "B-House",
        lat: 222420.69,
        lng: 22269.420,
        description: "BBBB big booty mama",
        price: 22219.99
      },
      {
        address: 'CCC Address',
        city: "CCC city",
        state: "CCC state",
        country: "CCC USA",
        ownerId: 3,
        name: "C-House",
        lat: 333420.69,
        lng: 33369.420,
        description: "CCC big booty mama",
        price: 33319.99
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
