import * as Yup from 'yup';


import User from '../models/User';
import OperatingRoom from '../models/OperatingRoom';

class OperatingRoomController {
  async index(req, res) {
    
    try {
      const rooms = await OperatingRoom.findAll({
        attributes: ['id', 'name', 'surgery_ward', 'status'],
      });

      return res.status(200).json({
        rooms,
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'rooms.index',
      });
    }
  }

  async edit(req, res) {
      
    const { id } = req.params;

    try {

      const room = await OperatingRoom.findByPk(id);
      if(!room)
        return res.status(400).json({ error: 'Sala operatória não encontrada.' });

      return res.status(200).json({
        room,
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'rooms.edit',
      });
    }
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      surgery_ward: Yup.string().required(),      
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação inválida.' });
    }
    
    const { name, surgery_ward } = req.body;
    let status = "active";
    try {  
      const { id } = await OperatingRoom.create({
        name,
        surgery_ward, 
        status,       
      });
  
      return res.status(201).json({
        id, 
        name,
        status
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao salvar os dados.', 
        stack: error,
        local: 'room.store',
      });
    }
  } 

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      surgery_ward: Yup.string(),
      status: Yup.string(),
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação inválida.' });
    }
    
    const { name, surgery_ward, status } = req.body;
    const { id } = req.params;

    try {

      const room = await OperatingRoom.findByPk(id);
      if(!room)
        return res.status(400).json({ error: 'Sala operatória não encontrada.' });
      

      await OperatingRoom.update({
        name,
        surgery_ward,
        status,
        
      }, {
        where: { id }
      });
  
      return res.status(201).json({
        id, 
        name,
        surgery_ward,
        status
      });
      
    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao salvar os dados.', 
        stack: error,
        local: 'room.update',
      });
    }
  }
}

export default new OperatingRoomController;
