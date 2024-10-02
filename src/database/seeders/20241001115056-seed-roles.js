'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = ['ADMIN', 'TEACHER', 'STUDENT'].map(role => ({
      id: uuidv4(),
      name: role,
      created_at: new Date(),
      updated_at: new Date()
    }));

    await queryInterface.bulkInsert('roles', roles, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};