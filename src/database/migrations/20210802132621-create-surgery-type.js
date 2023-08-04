'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('surgery_type',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },      
        /*
        equipment_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'equipment', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },   */      

        name: {
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
     await queryInterface.dropTable('surgery_type');
  }
};
