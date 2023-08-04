import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

class Surgery_type extends Model{
    static init(sequelize){
        super.init({            
            name: DataTypes.STRING,            
        },
        {
            sequelize,
            tableName : 'surgery_type'
        });

        this.addHook('beforeSave', async (model) => {
            if(!model.id) {
                model.id = uuidv4();
            }
        });
    }

    static associate(models) {   

       // this.hasOne(models.Equipment, { foreignKey: 'equipment_id', as: 'equipment_necessary' });           

        //this.belongsTo(models.Surgery, { foreignKey: 'surgery_type_id', as: 'surgery_type' });

    }
}



export default Surgery_type;