import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

class ChecklistSurgery extends Model {
  static init(sequelize) {
    super.init({      
      before: DataTypes.BOOLEAN,
      during: DataTypes.BOOLEAN,
      after: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: 'checklist_surgeries',
    });
    this.addHook('beforeSave', async (model) => {
      if(!model.id) {
        model.id = uuidv4();
      }
    });
    return this;
  }
  static associate(models) {
    //this.belongsTo(models.User, { foreignKey: 'before_user_id', as: 'user_checklist_before' });
    //this.belongsTo(models.User, { foreignKey: 'during_user_id', as: 'user_checklist_during' });
    //this.belongsTo(models.User, { foreignKey: 'after_user_id', as: 'user_checklist_after' });
    this.belongsTo(models.Surgery, { foreignKey: 'surgery_id', as: 'surgery_checklist' });
  }
}

export default ChecklistSurgery;