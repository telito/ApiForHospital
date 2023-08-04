import User from '../models/User';
import PharmaceuticalEvolution from '../models/PharmaceuticalEvolution';
import Profile from '../models/Profile';
import bcrypt from 'bcryptjs';
import * as Yup from 'yup';

class UserController{
  async index(req, res) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'status', 'profile_id'],
      });

      return res.status(200).json({
        users,
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'users.index',
      });
    }
  }
  async testetoken(req, res) {
    try {
      return res.status(200).json({
        msg: "True",
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'False', 
        stack: error,
        local: 'users.testetoken',
      });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      profile_id: Yup.string().required(),
    });

    const { 
      name, 
      email, 
      password, 
      profile_id,       
    } = req.body;

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação inválida.' });
    }
    const status = "active";
    
    try {
      
      const userExists = await User.findOne({
        where: { email },
        attributes: ['email']
      });

      if(userExists){
        return res.status(400).json({ error: 'E-mail já está em uso.' });
      }
      
      const user = await User.create({
        name,
        email, 
        password,
        status: status,
        profile_id,
      });
      
      return res.status(201).json({
        id: user.id,
        name,
        email,
        status,        
        message: "ok"
      }); 

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao salvar os dados.', 
        stack: error,
        local: 'user.store',
      });
    }
  }

  async edit(req, res) {
    const { id } = req.params;

    try {
      let user = await User.findByPk(id, {
        attributes: ['id', 'name', 'email','status' ,'password','profile_id']
      });
      
      if(!user) {
        return res.status(400).json({ error: 'Usuário não encontrado.' });
      }
      /*
      const pharmaceuticalEvolution = await PharmaceuticalEvolution.findAll({
        where: { user_id: id, status: true },
        attributes: ['id', 'description'],
      });      

      const profiles = await Profile.findAll({
        attributes: ['id', 'name'],
      });*/

      return res.json({
        user,
        //pharmaceuticalEvolution,        
        //profiles,
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao carregar os dados.', 
        stack: error,
        local: 'user.edit',
      });
    }
  }

  async update(req,res){
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      status: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).
        when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
      profile_id: Yup.string(),
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação inválida.' });
    }

    const { 
      name, 
      email, 
      password, 
      profile_id, 
      oldPassword,
      status      
    } = req.body;
    
    const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if(email && user.email !== email) {
      const userExists = await User.findOne({
        where: { email },
      });
        
      if(userExists){
        return res.status(400).json({ error: 'E-mail já está em uso.' });
      }
    }

    if(oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senhas inválida' });
    }

    await User.update({
      name,
      email,
      status, 
      password_hash: password && await bcrypt.hash(password, 8),
      profile_id,
    }, {
      where: { id },
    });
    

    return res.status(200).json({
      id,
      name,
      email,
      status,
    });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao salvar os dados.', 
        stack: error,
        local: 'user.update',
      });
    }
  }
}

export default new UserController;
