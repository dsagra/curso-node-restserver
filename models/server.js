const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            authRoutePath: '/api/auth',
            buscarRoutePath: '/api/buscar',
            usersRoutePath: '/api/users',
            categoriasRoutePath: '/api/categorias',
            productosRoutePath: '/api/productos',
        }


        //Connect to database
        this.connectToDatabase();

        //Middlewares
        this.middlewares();

        //Routes
        this.routes();
    }

    middlewares() {

        //CORS
        this.app.use(cors());

        //Parse and read body
        this.app.use(express.json());

        //Public directory
        this.app.use(express.static('public'));


    }

    async connectToDatabase() {
        await dbConnection();
    }

    routes() {

        this.app.use(this.paths.authRoutePath, require('../routes/auth'));
        this.app.use(this.paths.buscarRoutePath, require('../routes/buscar'));
        this.app.use(this.paths.usersRoutePath, require('../routes/user'));
        this.app.use(this.paths.categoriasRoutePath, require('../routes/categorias'));
        this.app.use(this.paths.productosRoutePath, require('../routes/productos'));

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        })
    }
}



module.exports = Server;