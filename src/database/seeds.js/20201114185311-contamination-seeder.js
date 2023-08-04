'use strict';
const uuid =  require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('contaminations', 
    [
      { 
        id: uuid.v4(),
        name: 'Baixo',
        description: 'Risco baixo de contaminação',
        created_at: new Date(),
        updated_at: new Date(),
      },
      { 
        id: uuid.v4(),
        name: 'Médio',
        description: 'Risco moderado de contaminação',
        created_at: new Date(),
        updated_at: new Date(),
      },
      { 
        id: uuid.v4(),
        name: 'Alto',
        description: 'Risto elevado de contaminação',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('contaminations', null, {});
  }
};
