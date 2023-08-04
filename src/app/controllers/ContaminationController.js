//import * as Yup from 'yup';


import Contamination from '../models/Contamination';

class ContaminationController {
    async index(req, res) {
        try {
          const contaminations = await Contamination.findAll({
            attributes: ['id', 'name', 'description'],
          });
    
          return res.status(200).json({
            contaminations,
          });
    
        } catch (error) {
          return res.status(500).json({ 
            error: 'Ocorreu um erro ao carregar os dados.', 
            stack: error,
            local: 'contaminations.index',
          });
        }
      }
}

export default new ContaminationController;
