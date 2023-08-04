import * as Yup from 'yup';
import Surgery from '../models/Surgery';
import OperatingRoom from '../models/OperatingRoom';
import User from '../models/User';
import dayjs from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import WaitingList from '../models/WaitingList';
const { Op } = require("sequelize");

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

class WaitingListController {

  async list(req, res) {    

    const waitinglist = await WaitingList.findAll({});  
    try {

      return res.status(200).json({
        waitinglist
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'waitinglist.listall',
      });
    }
  }  

  async listpending(req, res) {    

    const waitinglist = await WaitingList.findAll({
        where: { [Op.not]:[
            {
                status : ['canceled','finished']
            },
        ] },        
        order: [            
            ['order', 'ASC'],                        
        ],
      });  
    try {

      return res.status(200).json({
        waitinglist
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'waitinglist.list',
      });
    }
  }
  async listsurgery(req, res) {    

    const waitinglist = await WaitingList.findAll({
        where: { [Op.not]:[
            {
                status : ['canceled','finished']
            },
            { 
                exam_validation: null
            },
        ] },
        order: [
            ['priority', 'ASC'],
            ['order', 'ASC'],                        
        ],
    });  
    try {

      return res.status(200).json({
        waitinglist
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'waitinglist.listall',
      });
    }
  }

  

  async store(req, res) {

    const schema = Yup.object().shape({
      doctor: Yup.array(Yup.string().min(32)).required(),      
      patient: Yup.string().required(), 
      surgery_type: Yup.string().required(),
      priority: Yup.string().required(),
    });
    

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação inválida.' });
    }
    
    const {
      doctor,                
      patient,
      surgery_type,
      priority      
    } = req.body;
     
    

    try {   

       const user = await User.findOne({
                where:{ id: doctor}
       });      
      
       const status="waiting exam"
      
      await WaitingList.create({     
        doctor: user.id,        
        doctor_name: user.name,           
        status,
        patient,
        surgery_type,
        priority
      }); 
      
     return res.status(201).json({
        message: 'Paciente inserido na lista de espera com sucesso.',
      });

    } catch (error) {
      return res.status(500).json({         
        error: 'Ocorreu um erro ao salvar os dados.', 
        stack: error,
        local: 'waitinglist.store',        
      });
    }
    
  } 
 

  async update(req, res) {
    const schema = Yup.object().shape({

      status:  Yup.string(),
      patient:  Yup.string(),      
      exam_validation: Yup.string(),
      reason:  Yup.string(),
      priority: Yup.string(),

    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação inválida.' });
    }
    
    const {
      status,
      reason,
      patient,      
      exam_validation,
      priority           
    } = req.body;
    
    
    const { id } = req.params;
      
    /*const waitl  = await WaitingList.findAll({});  
    let ids = [];
    for(let i in waitl){
      
      ids.push(waitl[i].id);
    }*/

    
    
    try {
      
      const waitinglist = await WaitingList.findByPk(id);
       
      
      if(!waitinglist)
        return res.status(400).json({ error: 'Paciente na lista de espera não encontrado.' });
      

      if(status){      
      waitinglist.status = status;
      if(status!="canceled" && status!="waiting surgery" && status!="finished" && status!="waiting exam")
        return res.status(400).json({ error: 'Status invalido.' });
      } 

      if(priority)
        waitinglist.priority = priority;      
      if(patient)          
        waitinglist.patient = patient;
      if(reason)
        waitinglist.reason = reason;
      if(exam_validation)
        waitinglist.exam_validation = exam_validation;
        
        
       await WaitingList.update({      
        exam_validation: waitinglist.exam_validation,                  
        status: waitinglist.status,
        patient:waitinglist.patient,        
        reason: waitinglist.reason, 
        priority: waitinglist.priority      
      }, {
          where: { id }
      });   
             

      return res.status(200).json({
        waitinglist,
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'waitinglist.update',
      });
    }
  }
  
}

export default new WaitingListController;
