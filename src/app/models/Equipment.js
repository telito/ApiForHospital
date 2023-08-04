import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

class Equipment extends Model{
    static init(sequelize){
        super.init({            
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            total: DataTypes.INTEGER,
            available: DataTypes.INTEGER,               
        },
        {
            sequelize,
            tableName : 'equipment'
        });

        this.addHook('beforeSave', async (model) => {
            if(!model.id) {
                model.id = uuidv4();
            }
        });
    }

    static associate(models) {                
        
        //this.belongsTo(models.Surgery_type, { foreignKey: 'equipment_id', as: 'equipment_necessary' });    

    }
}



export default Equipment;