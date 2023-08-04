'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('message_board',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },    

        message: {
          type: Sequelize.TEXT,
          allowNull: false,
        },

        profile_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'profiles', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
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
     await queryInterface.dropTable('message_board');
  }
};
