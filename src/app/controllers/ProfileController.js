import * as Yup from 'yup';

import Profile from '../models/Profile';

class ProfileController {
  async index(req, res) {
    try {
      const profiles = await Profile.findAll({
        attributes: ['id', 'name'],
      });

      return res.status(200).json({
        profiles,
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'profile.index',
      });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required()
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação inválida.' });
    }
    
    const { name } = req.body;

    try {
      const { id } = await Profile.create({
        name,
      });
  
      return res.status(201).json({
        id, 
        name,
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao salvar os dados.', 
        stack: error,
        local: 'profile.store',
      });
    }
  }
    
  async edit(req, res) {
    try {
      const { id } = req.params;

      const profile = await Profile.findByPk(id, {
        attributes: ['id', 'name'],
      });

      return res.status(200).json({
        profile,
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'profile.edit',
      });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação inválida.' });
    }

    const { name } = req.body;
    const { id } = req.params;

    try {
      await Profile.update(
        { name },
        { where: { id } }
      )
  
      return res.status(200).json({
        id,
        name,
      });
      
    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao salvar os dados.', 
        stack: error,
        local: 'profile.update',
      });
    }
  }
}

export default new ProfileController;
