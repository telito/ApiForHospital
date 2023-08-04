'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('checklist_surgeries',
      {

        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },        

        before: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        during: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        after: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        /*
        before_user_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },

        during_user_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },

        after_user_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }, */

        surgery_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'surgeries', key: 'id' },
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
    await queryInterface.dropTable('checklist_surgeries');
  }
};
