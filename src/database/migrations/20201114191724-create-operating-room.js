'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('operating_room', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      surgery_ward: {
        type: Sequelize.TEXT,
        allowNull: false,
      }, 
      
      status: {
        type: Sequelize.TEXT,
        allowNull: false,
      },    
     
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

    });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.dropTable('operating_room');
  }
};
