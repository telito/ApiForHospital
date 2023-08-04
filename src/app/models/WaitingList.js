import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

class WaitingList extends Model{
    static init(sequelize){
        super.init({
            order: DataTypes.INTEGER,
            status: DataTypes.STRING,
            reason: DataTypes.TEXT,
            doctor_name: DataTypes.TEXT,            
            surgery_type: DataTypes.TEXT, 
            patient: DataTypes.TEXT,
            priority: DataTypes.TEXT,  
            exam_validation: DataTypes.DATE,      
        },
        {
            sequelize,
            tableName : 'waiting_list'
        });

        this.addHook('beforeSave', async (model) => {
            if(!model.id) {
                model.id = uuidv4();
            }
        });
        
    }

    static associate(models) {
        
        this.belongsTo(models.User, { foreignKey: 'doctor', as: 'waiting_list_doctor' });
        
    }
}



export default WaitingList;