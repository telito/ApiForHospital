import User from '../models/User';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import * as Yup from 'yup';

class SessionController {
  async store(req,res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });
    
    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação inválida.' });
    }
    
    const {email, password} = req.body; 
      
    try {
      const user = await User.findOne({
        where: { email }, attributes: ['name', 'id', 'profile_id', 'password_hash'],
        include: { association: 'profile', attributes: ['name']},
      });
  
      if(!user){
        return res.status(400).json({ error:'Usuário não encontrado.'});
      }
      
      if(!(await user.checkPassword(password))){
        return res.status(400).json({ error: 'Senha ou e-mail incorretos.' });
      }
      
      const{ id, name } = user;
  
      const profile = user.profile.name;
  
      const token = jwt.sign({ id, profile }, authConfig.secret,{
        expiresIn: authConfig.expiresIn,
      });
      
      
  
      return res.json({
        user: { id, name, email, token}
      }); 
    } catch (error) {
      return res.status(500).json({ 
        error: 'Ocorreu um erro ao gerar autenticação.', 
        stack: JSON.stringify(error),
        local: 'session',
      });
    }
    
  }
}

export default new SessionController
