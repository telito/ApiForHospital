import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid'; 

class Profile extends Model{
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
        },
        {
            sequelize,
            tableName: 'profiles',
        });

        this.addHook('beforeSave', async (model) => {
            if(!model.id) {
                model.id = uuidv4();
            }
        });
 
        return this;
    }
    
    static associate(models) {
        this.hasMany(models.User, { foreignKey: 'profile_id', as: 'users' });
    }
}

export default Profile;