import MessageBoard from "../models/MessageBoard";
import Profile from "../models/Profile";

class MessageBoardController {
    
    async index(req, res) {    
          
    
        try {
          /*
          const Profiles = await Profile.findOne({
            where:{name: req.profile}
          }); */
          
          const MessagesBoard = await MessageBoard.findAll({
                //where:{profile_id: Profiles.id}
          });

          
          
          if(!MessagesBoard)
            return res.status(400).json({ error: 'Checklist para esta cirurgia não encontrada.' });
    
          return res.status(200).json({
            MessagesBoard,
          });
    
        } catch (error) {
          return res.status(500).json({ 
            error: 'Ocorreu um erro ao carregar os dados.', 
            stack: error,
            local: 'messageboard.index',
          });
        }
      }

}

export default new MessageBoardController;
