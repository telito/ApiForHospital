import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

class PharmaceuticalEvolution extends Model {
  static init(sequelize){
    super.init({
      description: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: 'pharmaceutical_evolution',
    });

    this.addHook('beforeSave', async (model) => {
      if(!model.id) {
          model.id = uuidv4();
      }
    });

    return this;
  }
  
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'evolution_user' });
  }
}

export default PharmaceuticalEvolution;