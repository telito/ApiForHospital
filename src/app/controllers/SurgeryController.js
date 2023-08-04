import * as Yup from 'yup';
import Surgery from '../models/Surgery';
import Contamination from '../models/Contamination';
import OperatingRoom from '../models/OperatingRoom';
import User from '../models/User';
import ChecklistSurgery from '../models/ChecklistSurgery';
import dayjs from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import nodemailer from 'nodemailer';
import MessageBoard from '../models/MessageBoard';
import Profile from '../models/Profile';
const { Op } = require("sequelize");

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

class SurgeryController {  

  async list(req, res) {
    const surgeries = await Surgery.findAll({
     // where: { cleany_end: null, status: {[Op.not]: "canceled"} },
    });  
    try {

      surgeries.forEach((element, index) => {
      surgeries[index].likely_start = dayjs(element.likely_start).subtract(5, 'hour');
      surgeries[index].likely_end = dayjs(element.likely_end).subtract(3, 'hour');
      surgeries[index].start = dayjs(element.start).subtract(3, 'hour');
      surgeries[index].surgery_start = dayjs(element.surgery_start).subtract(3, 'hour');
      surgeries[index].end = dayjs(element.end).subtract(3, 'hour');
      surgeries[index].cleany_start = dayjs(element.cleany_start).subtract(3, 'hour');
      surgeries[index].cleany_end = dayjs(element.cleany_end).subtract(3, 'hour');     
    });
      
      
      return res.status(200).json({
        surgeries
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'surgery.list',
      });
    }
  }
  async listroom(req, res) {

    const { id } = req.params;
    try {

       
      const surgeries = await Surgery.findAll({
        where:{operating_rooms_id: id},        
      });
      
      return res.status(200).json({
        surgeries
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'surgery.list',
      });
    }
  }

  async availability(req, res) {

    const schema = Yup.object().shape({        
      ward: Yup.string(),  
      likely_start_time: Yup.string(),
      likely_end_time: Yup.string(), 
      date_start: Yup.string(),
      date_end: Yup.string(),     
    });    

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação inválida.' });
    }

    const {
      ward,    
      likely_start_time, 
      likely_end_time, 
      date_start,
      date_end,     
    } = req.body; 
    try {    
      const emergency_rooms_quantity = 1;
      let available = []; 
      let current_date = dayjs(date_start);
      const last_date = dayjs(date_end);
      
      const rooms = await OperatingRoom.findAll({
        where:{surgery_ward: ward, status:'active'},
        attributes: ['id', 'name'],
      });
      
      const current_surgeries = await Surgery.findAll({
        where: { cleany_end: null, status: {[Op.not]: "canceled"} },
        attributes: ['doctor', 'anesthetist', 'operating_rooms_id','likely_start', 'likely_end', 'start', 'end', 'description'],
      }); 
      
      
    
    while(!current_date.isSame(last_date, 'day')){
        let operating_rooms = [];      
        let flag = 0;
        let likely_date_start = dayjs(current_date.format("YYYY-MM-DD") + " " + likely_start_time);
        let likely_date_end;        
        if(likely_end_time <= likely_start_time ){ 
           likely_date_end =  dayjs(current_date.add(1, 'day').format("YYYY-MM-DD") + " " + likely_end_time);          
        }else{          
           likely_date_end =  dayjs(current_date.format("YYYY-MM-DD") + " " + likely_end_time);
        }      
        for( let j in rooms){
          for(let i in current_surgeries){              
            if(current_surgeries[i].operating_rooms_id == rooms[j].id){
              let date_surgery_start = dayjs(current_surgeries[i].likely_start);
              let date_surgery_end = dayjs(current_surgeries[i].likely_end);

                //3 possibles intersection of times
                                
                if(likely_date_start.isSameOrAfter(date_surgery_start) && likely_date_start.isSameOrBefore(date_surgery_end)){                    
                  flag = 1;
                }
                if(likely_date_end.isSameOrAfter(date_surgery_start) && likely_date_end.isSameOrBefore(date_surgery_end)){
                  flag = 1;
                }                
                if(likely_date_start.isSameOrBefore(date_surgery_start) && likely_date_end.isSameOrAfter(date_surgery_end)){                   
                  flag = 1;
                } 

            }   
          }
                  
          if(flag==0){              
            operating_rooms.push(rooms[j].id);              
          }else{
            flag=0;
          }
        }
          
        //at least one emergence room 
        if(operating_rooms.length>emergency_rooms_quantity){         
         let aux_available = {
          likely_start: likely_date_start.format("YYYY-MM-DD HH:mm:ss"),
          likely_end: likely_date_end.format("YYYY-MM-DD HH:mm:ss"),
          operatingRoom_id:operating_rooms
        }          
         available.push(aux_available) ;
        }        
        current_date = current_date.add(1, 'day');
      }

      if(available.length==0){        
        return res.status(400).json({ error: 'Não há salas de cirurgias disponiveis neste intervalo de tempo' });
      }     
     
      return res.status(200).json({
        available,
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'surgery.list',
      });
    }
  }  
  
  async store(req, res) {

    const schema = Yup.object().shape({
      doctor: Yup.array(Yup.string().min(32)).required(),
      anesthetist: Yup.array(Yup.string().min(32)),         
      description: Yup.string(),  
      likely_start: Yup.string(),
      likely_end: Yup.string(),
      ward: Yup.string(),
      contamination_id: Yup.string().required(),
      patient: Yup.string().required(), 
      surgery_type: Yup.string().required(), 
    });
    

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação inválida.' });
    }
    
    const {
      doctor,
      anesthetist,       
      description,               
      likely_start, 
      likely_end,   
      contamination_id,
      ward,
      patient,
      surgery_type      
    } = req.body;

     
    

    try {      

      const emergency_rooms_quantity = 1;
      let current_date = dayjs(dayjs(likely_start).format('YYYY-MM-DD'));
      const likely_start_time = dayjs(likely_start).format('HH:mm:ss');
      const likely_end_time = dayjs(likely_end).format('HH:mm:ss');
      const status = "scheduled";
      let available = [];
     
      const rooms = await OperatingRoom.findAll({
        where:{surgery_ward: ward, status:'active'},
        attributes: ['id', 'name'],
      }); 
      
      const current_surgeries = await Surgery.findAll({
        where: { cleany_end: null, status: {[Op.not]: "canceled"} },
        attributes: ['doctor','anesthetist', 'operating_rooms_id','likely_start', 'likely_end', 'start', 'end', 'description'],
      });       
      
      const users_doctors = await User.findAll({
        where: { id: doctor }
      });
      const users_anesthetist = await User.findAll({
        where: { id: anesthetist }
      });
      
      if(dayjs(likely_start).isBefore(dayjs()) || dayjs(likely_end).isSameOrBefore(dayjs(likely_start)))
      return res.status(400).json({ error: 'Data invalída.' });
  
      while(available.length==0){                            
        let flag = 0;
        let operating_rooms = []; 
        let likely_date_start = dayjs(current_date.format("YYYY-MM-DD") + " " + likely_start_time);
        let likely_date_end;
        if(likely_end_time <= likely_start_time ){ 
          likely_date_end =  dayjs(current_date.add(1, 'day').format("YYYY-MM-DD") + " " + likely_end_time);          
        }else{          
          likely_date_end =  dayjs(current_date.format("YYYY-MM-DD") + " " + likely_end_time);
        }      
        for( let j in rooms){
          for(let i in current_surgeries){              
            if(current_surgeries[i].operating_rooms_id == rooms[j].id){
              let date_surgery_start = dayjs(current_surgeries[i].likely_start);
              let date_surgery_end = dayjs(current_surgeries[i].likely_end);          
              
                //3 possibles intersection of times                              
                if(likely_date_start.isSameOrAfter(date_surgery_start) && likely_date_start.isSameOrBefore(date_surgery_end)){                        
                  flag = 1;
                }
                if(likely_date_end.isSameOrAfter(date_surgery_start) && likely_date_end.isSameOrBefore(date_surgery_end)){
                  flag = 1;               
                }                
                if(likely_date_start.isSameOrBefore(date_surgery_start) && likely_date_end.isSameOrAfter(date_surgery_end)){                   
                  flag = 1;                
                }
            }   
          }
                 
          if(flag==0){                       
            operating_rooms.push(rooms[j].id);              
          }else{
            flag=0;
          }
  
        }         
        //at least one emergence room 
        if(operating_rooms.length>emergency_rooms_quantity){         
        available.push(operating_rooms[0], likely_date_start.format('YYYY-MM-DD HH:mm:ss'), likely_date_end.format('YYYY-MM-DD HH:mm:ss'));
        }        
        current_date = current_date.add(1, 'day');
      }
      
      const surgery = await Surgery.create({     
        doctor: users_doctors[0].id,
        anesthetist: users_anesthetist[0].id,
        doctor_name: users_doctors[0].name,
        anesthetist_name: users_anesthetist[0].name,        
        operating_rooms_id: available[0],    
        description,  
        likely_start: available[1],
        likely_end: available[2], 
        contamination_id,     
        status,
        patient,
        surgery_type
      });
     
      await ChecklistSurgery.create({        
        surgery_id: surgery.id            
      });    
      
      
      
     
      return res.status(201).json({
        message: 'Cirurgia marcada com sucesso.',
      });

    } catch (error) {
      return res.status(500).json({         
        error: 'Ocorreu um erro ao salvar os dados.', 
        stack: error,
        local: 'surgery.store',        
      });
    }
    
  } 
 

  async update(req, res) {
    const schema = Yup.object().shape({
      operating_rooms_id: Yup.string(),
      doctor: Yup.array(Yup.string().min(32)),
      anesthetist: Yup.array(Yup.string().min(32)),
      description: Yup.string(),      
      likely_start: Yup.string(),
      likely_end: Yup.string(),
      status:  Yup.string(),
      patient:  Yup.string(),
      surgery_type:  Yup.string(), 
      reason:  Yup.string().required(),        
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação inválida.' });
    }
    
    const { 
      operating_rooms_id, 
      doctor,
      anesthetist,      
      likely_start, 
      likely_end,       
      description,
      status,
      reason,
      patient,
      surgery_type           
    } = req.body;
    
    
    const { id } = req.params;
      
    
    
    try {
      let users_doctors;
      let users_anesthetists;
      const surgery = await Surgery.findByPk(id);    
      
      if(!surgery)
        return res.status(400).json({ error: 'Cirurgia não encontrada.' });

      if(surgery.start)
        return res.status(400).json({ error: 'A cirurgia já começou.' }); 

      if(status){      
      surgery.status = status;
      if(status!="canceled")
        return res.status(400).json({ error: 'Status invalido.' });
      }      

      if(doctor){  
         
        users_doctors = await User.findAll({
          where: { id: doctor },
          attributes: ['id', 'name'],
        });
        surgery.doctor = users_doctors[0].id;
        surgery.doctor_name = users_doctors[0].name;     
        if(!users_doctors)
          return res.status(400).json({ error: 'Este(s) Médico(s) não existem' });        
      }
      if(anesthetist){

        users_anesthetists = await User.findAll({
          where: { id: anesthetist },
          attributes: ['id', 'name'],
        });
        surgery.anesthetist = users_anesthetists[0].id;
        surgery.anesthetist_name = users_anesthetists[0].name;       
        if(!users_anesthetists)
          return res.status(400).json({ error: 'Este(s) Anestesista(s) não existem' });        
      }     

      if(operating_rooms_id){
        surgery.operating_rooms_id = operating_rooms_id;
        const room = await OperatingRoom.findByPk(operating_rooms_id);
        if(!room)
          return res.status(400).json({ error: 'Sala operatória não encontrada.' });
      }
      
      if(description)
        surgery.description = description;
      if(likely_start)        
        surgery.likely_start = likely_start;
      if(likely_end)
        surgery.likely_end = likely_end;
      if(patient)          
        surgery.patient = patient;
      if(surgery_type)
        surgery.surgery_type = surgery_type;

        surgery.reason = reason;          
      
      await Surgery.update({
        description: surgery.description,
        doctor: surgery.doctor,
        anesthetist: surgery.anesthetist,
        doctor_name: surgery.doctor_name,
        anesthetist_name: surgery.anesthetist_name,
        operating_rooms_id: surgery.operating_rooms_id,
        likely_start: surgery.likely_start,
        likely_end: surgery.likely_end,        
        status: surgery.status,
        patient:surgery.patient,
        surgery_type:surgery.surgery_type, 
        reason: surgery.reason,       
      }, {
          where: { id }
      });   
             

      return res.status(200).json({
        surgery,
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'surgery.update',
      });
    }
  }

  async changeSurgery(req, res) {
    

  
    const { id } = req.params;

    const surgery = await Surgery.findByPk(id,
      {
        include: { association: 'operatingroom_surgery', attributes: ['name']},
      });
      
    let before;
    let during;
    let after;
    let message;
    
    if(!surgery)
      return res.status(400).json({ error: 'Cirurgia não encontrada;' });

    try {

      const changeDate = dayjs().format('YYYY-MM-DD HH:mm:ss');

    if(surgery.status=="schedule") {   
     
      surgery.start = changeDate;
      before = true;
      message='Cirurgia '+ id +' na '+ surgery.operatingroom_surgery.name +' começou anestesia';
      surgery.status ="ongoing anesthesia";
      surgery.start_id = req.userId; 
    }
    else if(surgery.status == "ongoing anesthesia") { 
   
      
      surgery.confirm_start = changeDate;      
      message='Cirurgia '+ id +' na '+ surgery.operatingroom_surgery.name +' confirmou inicio cirurgia';
      surgery.status ="confirmed surgery";
    }
    
    else if(surgery.status == "confirmed surgery") {
      surgery.surgery_start = changeDate;
      during = true;
      surgery.status ="ongoing surgery";
      message='Cirurgia '+ id +' na '+ surgery.operatingroom_surgery.name +' começou incisão';
      surgery.surgery_start_id = req.userId; 
    }
    
    else if(surgery.status == "ongoing surgery") {

    
      surgery.end = changeDate;
      after = true;
      surgery.status ="finished surgery";
        message='Cirurgia '+ id +' na '+ surgery.operatingroom_surgery.name +' finalizada';
        surgery.end_id = req.userId;
    }      

    else if(surgery.status == "finished surgery")  {     
      
     
      surgery.cleany_start = changeDate;
      surgery.status ="ongoing cleaning";
      message='Cirurgia '+ id +' na '+ surgery.operatingroom_surgery.name +' começou limpeza';
      surgery.cleany_start_id = req.userId; 
    }

    else if(surgery.status == "ongoing cleaning") {        
      surgery.cleany_end = changeDate;
      surgery.status ="finished cleaning";
      message='Cirurgia '+ id +' na '+ surgery.operatingroom_surgery.name +' finalizou limpeza';
      surgery.cleany_end_id = req.userId; 
    }

    else {
      return res.status(400).json({ error: 'Não é possível alterar o status da cirurgia.' });
    }
    
    
    await Surgery.update({
      start: surgery.start,
      start_id: surgery.start_id,
      confirm_surgery: surgery.confirm_surgery, 
      surgery_start: surgery.surgery_start,
      surgery_start_id: surgery.surgery_start_id,  
      end: surgery.end,
      end_id: surgery.end_id,
      likely_start: surgery.likely_start,
      likely_end: surgery.likely_end,
      cleany_start: surgery.cleany_start,
      cleany_start_id: surgery.cleany_start_id,
      cleany_end: surgery.cleany_end,
      cleany_end_id: surgery.cleany_end_id,
      status: surgery.status,
    }, { 
      where: { 
        id 
      }
    });

    
    await ChecklistSurgery.update({
      before: before,
      during: during, 
      after: after,        
    }, { 
      where: { 
        surgery_id: id
      }
    });

    //if(profile_name){
   //   Profiles = await Profile.findOne({
    //    where:{name: profile_name}
    //  });    
  
      await MessageBoard.create({     
        message: message,
       // profile_id: Profiles.id,
      });
   // }
      
      

      return res.status(200).json({
        surgery,
        changeDate
      });
    
    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'surgery.changesurgery',
      });
    }
  }
}

export default new SurgeryController;
