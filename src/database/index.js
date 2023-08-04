import Sequelize from 'sequelize';

import ChecklistSurgery from '../app/models/ChecklistSurgery.js';
import Equipment from '../app/models/Equipment.js';
import Surgery_type from '../app/models/Surgery_type';
import Contamination from '../app/models/Contamination.js';
import PharmaceuticalEvolution from '../app/models/PharmaceuticalEvolution.js';
import OperatingRoom from '../app/models/OperatingRoom.js';
import Profile from '../app/models/Profile.js';
import Surgery from '../app/models/Surgery.js';
import User from '../app/models/User.js';

import databaseConfig from '../config/database.js';
import { up } from './migrations/20201114191725-create-surgery.js';
import MessageBoard from '../app/models/MessageBoard.js';
import WaitingList from '../app/models/WaitingList.js';

const models = [
    ChecklistSurgery,
    PharmaceuticalEvolution,    
    OperatingRoom, 
    Profile, 
    Surgery,
    Surgery_type,
    Equipment,
    User,
    Contamination,
    MessageBoard,
    WaitingList
];

class Database{
    constructor(){
        this.init();
    }

    init(){
        this.connection = new Sequelize(databaseConfig);    
        models.map(model => model.init(this.connection));
        models.map(model => model.associate(this.connection.models));
    }
}

export default new Database;