'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('surgeries',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },

        doctor: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        
        doctor_name: {
          type: Sequelize.TEXT,
          allowNull: false,          
        },
        
        anesthetist: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },

        anesthetist_name: {
          type: Sequelize.TEXT,
          allowNull: false,          
        },

        operating_rooms_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'operating_room', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },           

        status: {
          type: Sequelize.TEXT,
          allowNull: false,
        },

        reason: {
          type: Sequelize.TEXT,
          allowNull: true,
        },

        patient: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        
        likely_start: {
          type: Sequelize.DATE,
          allowNull: false,
        },

        likely_end: {
          type: Sequelize.DATE,
          allowNull: false,
        },

        start: {
          type: Sequelize.DATE,
          allowNull: true,
        },

        start_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }, 
        confirm_surgery:{
          type: Sequelize.DATE,
          allowNull: true,
        },
        surgery_start: {
          type: Sequelize.DATE,
          allowNull: true,
        },

        surgery_start_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }, 
        

        end: {
          type: Sequelize.DATE,
          allowNull: true,
        },

        end_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }, 

        cleany_start: {
          type: Sequelize.DATE,
          allowNull: true,
        },

        cleany_start_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }, 

        cleany_end: {
          type: Sequelize.DATE,
          allowNull: true,
        },

        cleany_end_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }, 
/*
        surgery_type_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'surgery_type', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }, */

        //temporario
        surgery_type:{
          type: Sequelize.TEXT,
          allowNull: false,
        },

        contamination_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'contaminations', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },

        description:{
          type: Sequelize.TEXT,
          allowNull: true,
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
     await queryInterface.dropTable('surgeries');
  }
};
