const mongoose = require('mongoose');
require('dotenv').config({path:'variables.env'});

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useFindAndModify: false,
            //useCreateIndex: true
        });
        console.log('DB Conectada');
    } catch (error) {
        console.log('Hubo un error',error);
        process.exit(1); // detener la app en caso de un eroor de conexion
    }
}

module.exports = conectarDB;

