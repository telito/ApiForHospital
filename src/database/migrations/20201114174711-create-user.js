'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users',  {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },

        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },

        password_hash: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        
        profile_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'profiles', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },

        status: {
          type: Sequelize.STRING,
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
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
