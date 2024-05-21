const express = require('express') 
const cors = require('cors'); 
const { dbConnection } = require('../database/config');

class Server{
    constructor(){
        this.app = express()
        this.port=process.env.PORT;

        this.usuariosPath= '/api/usuarios';
        this.authPath='/api/auth';

        //Conectar a DB
        this.conectarDB();

        //Middleware: funciones que añaden otra funcionalidad al web server 
        this.middlewares();
        //Rutas de mi aplicación
        this.routes();

    }
    //Conectar a DB
    async conectarDB() {
    
        await dbConnection();
    }        
    
    middlewares(){
        //CORS
        this.app.use(cors());
        //Lectura y parseo del body
        this.app.use(express.json());
        //Directorio público
        this.app.use(express.static('public')); //
    }


    routes (){
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        }

    listen (){
        this.app.listen(this.port,()=>{
            console.log('Servidor corriendo ', process.env.PORT);
        })
    }
}

module.exports=Server;