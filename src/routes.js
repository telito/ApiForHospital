import { Router } from 'express'

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ChecklistSurgeryController from './app/controllers/ChecklistSurgeryController';
import ProfileController from './app/controllers/ProfileController';
import OperatingRoomController from './app/controllers/OperatingRoomController';
import PharmaceuticalEvolutionController from './app/controllers/PharmaceuticalEvolutionController';
import SurgeryController from './app/controllers/SurgeryController';
import ContaminationController from './app/controllers/ContaminationController';
import authMiddleware from './app/middlewares/auth';
import MessageBoardController from './app/controllers/MessageBoardController';
import adminAuthMiddleware from './app/middlewares/adminAuth';
import WaitingListController from './app/controllers/WaitingListController';

const routes = new Router();

routes.post('/session', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);
routes.get('/users/testetoken',UserController.testetoken)
routes.get('/users/:id', UserController.edit);
routes.put('/users/:id', UserController.update);

routes.get('/messageboard', MessageBoardController.index);

routes.post('/surgeries', SurgeryController.store);
routes.post('/surgeries/check', SurgeryController.availability);
routes.put('/surgeries/:id', SurgeryController.update);
routes.post('/surgeries/:id', SurgeryController.changeSurgery);
routes.get('/surgeries', SurgeryController.list);
routes.get('/surgeries/rooms/:id', SurgeryController.listroom);

routes.get('/checklistsurgery', ChecklistSurgeryController.index);
routes.get('/checklistsurgery/:id', ChecklistSurgeryController.edit);

routes.post('/pharma', PharmaceuticalEvolutionController.store);
routes.put('/pharma/:id', PharmaceuticalEvolutionController.update);
routes.delete('/pharma/:id', PharmaceuticalEvolutionController.delete);

routes.get('/waitinglist', WaitingListController.list);
routes.get('/waitinglist/pending', WaitingListController.listpending);
routes.get('/waitinglist/surgery', WaitingListController.listsurgery);
routes.post('/waitinglist', WaitingListController.store);
routes.put('/waitinglist/:id', WaitingListController.update);

//routes.use(adminAuthMiddleware);
routes.get('/users', UserController.index);

routes.get('/profiles', ProfileController.index);
routes.get('/profiles/:id' , ProfileController.edit);
routes.post('/profiles', ProfileController.store);
routes.put('/profiles/:id', ProfileController.update);

routes.get('/rooms', OperatingRoomController.index);
routes.get('/rooms/:id', OperatingRoomController.edit);
routes.post('/rooms', OperatingRoomController.store);
routes.put('/rooms/:id', OperatingRoomController.update);

routes.get('/contaminations', ContaminationController.index);

export default routes;