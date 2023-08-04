import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

class Surgery extends Model{
    static init(sequelize){
        super.init({            
            likely_start: DataTypes.DATE,
            likely_end: DataTypes.DATE,
            start: DataTypes.DATE,
            surgery_start: DataTypes.DATE,
            end: DataTypes.DATE,
            cleany_start: DataTypes.DATE,
            cleany_end: DataTypes.DATE,
            description: DataTypes.STRING,
            status: DataTypes.STRING,
            reason: DataTypes.TEXT,
            doctor_name: DataTypes.TEXT,
            anesthetist_name: DataTypes.TEXT,
            surgery_type: DataTypes.TEXT, 
            patient: DataTypes.TEXT,    
        },
        {
            sequelize,
            tableName : 'surgeries'
        });

        this.addHook('beforeSave', async (model) => {
            if(!model.id) {
                model.id = uuidv4();
            }
        });
    }

    static associate(models) {

        
        this.belongsTo(models.User, { foreignKey: 'doctor', as: 'surgery_doctor' });
        this.belongsTo(models.User, { foreignKey: 'anesthetist', as: 'surgery_anesthetist' });
       // this.belongsTo(models.User, { foreignKey: 'doctor_name', as: 'surgery_doctor_name' });
        //this.belongsTo(models.User, { foreignKey: 'anesthetist_name', as: 'surgery_anesthetist_name' });
        this.belongsTo(models.User, { foreignKey: 'start_id', as: 'surgery_begin' });
        this.belongsTo(models.User, { foreignKey: 'surgery_start_id', as: 'surgery_started' });
        this.belongsTo(models.User, { foreignKey: 'end_id', as: 'surgery_ended' });
        this.belongsTo(models.User, { foreignKey: 'cleany_start_id', as: 'cleany_started' });
        this.belongsTo(models.User, { foreignKey: 'cleany_end_id', as: 'cleany_ended' });

        this.belongsTo(models.OperatingRoom, { foreignKey: 'operating_rooms_id', as: 'operatingroom_surgery' });

       // this.belongsTo(models.Surgery_type, { foreignKey: 'surgery_type_id', as: 'surgery_type' });

        this.hasOne(models.ChecklistSurgery, { foreignKey: 'surgery_id', as: 'checklist_surgery' });        

        this.hasMany(models.Contamination, { foreignKey: 'contamination_id', as: 'contamination' });
    }
}



export default Surgery;