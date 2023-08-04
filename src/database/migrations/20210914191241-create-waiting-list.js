'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('waiting_list',
      { 
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        
        order: {
          type: Sequelize.INTEGER,          
          autoIncrement: true,
          allowNull: false,
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

        status: {
          type: Sequelize.TEXT,
          allowNull: false,
        },

        reason: {
          type: Sequelize.TEXT,
          allowNull: true,
        },

        priority: {
          type: Sequelize.TEXT,
          allowNull: true,
        },

        patient: {
          type: Sequelize.TEXT,
          allowNull: false,
        },        
        
        exam_validation: {
          type: Sequelize.DATE,
          allowNull: true,
        },
       
        /*
        surgery_type_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'surgery_type', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }, 
        */  

        //temporario

        surgery_type:{
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
     await queryInterface.dropTable('waiting_list');
  }
};
