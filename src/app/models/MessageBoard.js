import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

class MessageBoard extends Model {
  static init(sequelize) {
    super.init({      
      message: DataTypes.TEXT,      
    },
    {
      sequelize,
      tableName: 'message_board',
    });
    this.addHook('beforeSave', async (model) => {
      if(!model.id) {
        model.id = uuidv4();
      }
    });
    return this;
  }
  static associate(models) {
    
    this.belongsTo(models.Profile, { foreignKey: 'profile_id', as: 'profile' });
  }
}

export default MessageBoard;