'use strict';
const uuid =  require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('profiles', 
    [
      { 
        id: uuid.v4(),
        name: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      { 
        id: uuid.v4(),
        name: 'doctor',
        created_at: new Date(),
        updated_at: new Date(),
      },
      { 
        id: uuid.v4(),
        name: 'resident',
        created_at: new Date(),
        updated_at: new Date(),
      },
      { 
        id: uuid.v4(),
        name: 'anesthetist',
        created_at: new Date(),
        updated_at: new Date(),
      },
      { 
        id: uuid.v4(),
        name: 'circulating',
        created_at: new Date(),
        updated_at: new Date(),
      },
      { 
        id: uuid.v4(),
        name: 'user',
        created_at: new Date(),
        updated_at: new Date(), 
      },
      { 
        id: uuid.v4(),
        name: 'cleaner',
        created_at: new Date(),
        updated_at: new Date(), 
      },
      { 
        id: uuid.v4(),
        name: 'manager',
        created_at: new Date(),
        updated_at: new Date(), 
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('profiles', null, {});
  }
};
