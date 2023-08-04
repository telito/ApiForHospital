import cors from 'cors'
import express from 'express';
import routes from './routes';


import './database';

class App{
    constructor(){
       this.server = express();
       
       this.middlewares();
       this.routes();
    }

    middlewares(){
        this.server.use(cors(),express.json());
    }

    routes(){
        this.server.use(cors(),routes);
    }
}

export default new App().server;

//server = app