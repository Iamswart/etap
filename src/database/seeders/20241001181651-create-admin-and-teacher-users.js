'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch existing roles
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'ADMIN'`
    );
    const [teacherRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'TEACHER'`
    );

    if (!adminRole[0] || !teacherRole[0]) {
      throw new Error('Admin or Teacher role not found. Please ensure roles are created first.');
    }

    const salt = await bcrypt.genSalt(10);
    const users = [
      {
        id: uuidv4(),
        email: 'swartjide1@gmail.com',
        name: 'Admin User',
        password: await bcrypt.hash('Admin4password@', salt),
        role_id: adminRole[0].id,  
        created_at: new Date(),  
        updated_at: new Date()   
      },
      {
        id: uuidv4(),
        email: 'abdurrazaqakanji@gmail.com',
        name: 'Teacher User',
        password: await bcrypt.hash('Teacher4password@', salt),
        role_id: teacherRole[0].id, 
        created_at: new Date(), 
        updated_at: new Date()   
      }
    ];

    for (const user of users) {
      const [existingUser] = await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = ?`,
        {
          replacements: [user.email],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      if (!existingUser) {
        await queryInterface.bulkInsert('users', [user], {});
        console.log(`User ${user.email} created successfully.`);
      } else {
        console.log(`User ${user.email} already exists. Skipping.`);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: ['swartjide1@gmail.com', 'abdurrazaqakanji@gmail.com']
    });
  }
};