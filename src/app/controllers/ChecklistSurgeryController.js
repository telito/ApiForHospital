import ChecklistSurgery from '../models/ChecklistSurgery';

class ChecklistSurgeryController {
    async index(req, res) {        
        
        try {
          const checklistsurgery = await ChecklistSurgery.findAll({
           
          });          
          
    
          return res.status(200).json({
            checklistsurgery,
            
          });
    
        } catch (error) {
          return res.status(500).json({ 
            error: 'Ocorreu um erro ao carregar os dados.', 
            stack: error,
            local: 'checklistsurgery.index',
          });
        }
    }

    async edit(req, res) {
      
        const { id } = req.params;
    
        try { 

          const ChecklistSurgery = await OperatingRoom.findAll({
                where:{surgery_id: id}
              });
          
          if(!ChecklistSurgery)
            return res.status(400).json({ error: 'Checklist para esta cirurgia não encontrada.' });
    
          return res.status(200).json({
            ChecklistSurgery,
          });
    
        } catch (error) {
          return res.status(500).json({ 
            error: 'Ocorreu um erro ao carregar os dados.', 
            stack: error,
            local: 'checklistsurgery.edit',
          });
        }
      }

}

export default new ChecklistSurgeryController;
