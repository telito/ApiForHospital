import * as Yup from 'yup';

import PharmaceuticalEvolution from '../models/PharmaceuticalEvolution';

class PharmaceuticalEvolutionController {
  async store(req, res) {
    const schema = Yup.object().shape({
        description: Yup.string().required().min(10),
        user_id: Yup.string().required(),
    });
  
    if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validação inválida.' });
    }
    
    const { description, user_id } = req.body;

    try {
      const { id } = await PharmaceuticalEvolution.create({
        description,
        user_id,
      });
  
      return res.status(201).json({
        id, 
        description,
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao salvar os dados.', 
        stack: error,
        local: 'pharmaceuticalEvolution.store',
      });
    }
  }
    
  async update(req, res) {
    const schema = Yup.object().shape({
        description: Yup.string().required().min(10),
    });
  
    if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validação inválida.' });
    }

    const { description } = req.body;
    const { id } = req.params;

    try {

      const pharmaEvolution = await PharmaceuticalEvolution.findByPk(id);

      if(!pharmaEvolution) {
        return res.status(400).json({ error: 'Evolução farmacêutica não encontrada.' });
      }

      await PharmaceuticalEvolution.update(
        { description },
        { where: { id } }
      )
  
      return res.status(200).json({
        id,
        description,
      });
      
    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao salvar os dados.', 
        stack: error,
        local: 'pharmaceuticalEvolution.update',
      });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {

      const pharmaEvolution = await PharmaceuticalEvolution.findByPk(id);

      if(!pharmaEvolution) {
        return res.status(400).json({ error: 'Evolução farmacêutica não encontrada.' });
      }

      await PharmaceuticalEvolution.update(
        { status: false },
        { where: { id } }
      )
  
      return res.status(200).json({
        id,
      });
      
    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao salvar os dados.', 
        stack: error,
        local: 'pharmaceuticalEvolution.delete',
      });
    }
  }
}

export default new PharmaceuticalEvolutionController;
