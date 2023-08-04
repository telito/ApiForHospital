import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

class User extends Model{
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.VIRTUAL,
            password_hash: DataTypes.STRING,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            tableName: 'users'
        });
 
        this.addHook('beforeSave', async (model) => {
            if(!model.id) {
                model.id = uuidv4();
            }
            if(model.password) {
                model.password_hash = await bcrypt.hash(model.password, 8);
            }
        });

        return this;
    }

    static associate(models) {

        this.hasMany(models.Surgery, { foreignKey: 'doctor', as: 'surgery_doctor' });
        this.hasMany(models.WaitingList, { foreignKey: 'doctor', as: 'waiting_list_doctor' });
        this.hasMany(models.Surgery, { foreignKey: 'anesthetist', as: 'anesthetist' });
        //this.hasMany(models.Surgery, { foreignKey: 'doctor_name', as: 'surgery_doctor_name' });
        //this.hasMany(models.Surgery, { foreignKey: 'anesthetist_name', as: 'anesthetist_name' });
        this.hasMany(models.Surgery, { foreignKey: 'start_id', as: 'surgery_begin' });
        this.hasMany(models.Surgery, { foreignKey: 'surgery_start_id', as: 'surgery_started' });
        this.hasMany(models.Surgery, { foreignKey: 'end_id', as: 'surgery_ended' });
        this.hasMany(models.Surgery, { foreignKey: 'cleany_start_id', as: 'cleany_started' });
        this.hasMany(models.Surgery, { foreignKey: 'cleany_end_id', as: 'cleany_ended' });
        /*
        this.hasMany(models.ChecklistSurgery, { foreignKey: 'before_user_id', as: 'user_checklist_before' });
        this.hasMany(models.ChecklistSurgery, { foreignKey: 'during_user_id', as: 'user_checklist_during' });
        this.hasMany(models.ChecklistSurgery, { foreignKey: 'after_user_id', as: 'user_checklist_after' });  
        */
        this.hasMany(models.PharmaceuticalEvolution, { foreignKey: 'user_id', as: 'evolution_user' });

        this.belongsTo(models.Profile, { foreignKey: 'profile_id', as: 'profile' });
                      

        
    }
    
    checkPassword(password){
        return bcrypt.compare(password, this.password_hash)
    }
}

export default User;