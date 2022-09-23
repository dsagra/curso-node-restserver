const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersRoutePath = '/api/users';

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

        this.app.use(this.usersRoutePath, require('../routes/user'));

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        })
    }
}



module.exports = Server;