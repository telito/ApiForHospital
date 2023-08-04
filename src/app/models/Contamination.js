import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

class Contamination extends Model {
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING,
        },
        {
            sequelize,
            tableName: 'contaminations'
        });

        this.addHook('beforeSave', async (model) => {
            if(!model.id) {
                model.id = uuidv4();
            }
        });
 
        return this;
    }
    
    static associate(models) {
        
        this.belongsTo(models.Surgery, { foreignKey: 'contamination_id', as: 'contamination_type' });
    }
}

export default Contamination;