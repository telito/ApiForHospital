import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

class OperatingRoom extends Model{
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            surgery_ward: DataTypes.STRING,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            tableName: 'operating_room'
        });

        this.addHook('beforeSave', async (model) => {
            if(!model.id) {
                model.id = uuidv4();
            }
        });
 
        return this;
    }

    static associate(models) {
        
        //this.belongsTo(models.Surgery_type, { foreignKey: 'surgery_type_id', as: 'surgery_type' });
        this.hasMany(models.Surgery, { foreignKey: 'operating_rooms_id', as: 'operatingroom_surgery' });
        //this.hasMany(models.Surgery, { foreignKey: 'room_id', as: 'room_surgeries' });
    }
}

export default OperatingRoom;