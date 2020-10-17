//Archivo de conexion a la base de datos
const mysql = require('mysql');
const { promisify } = require('util');//Para soportar promises, debido a que el modulo mysql solo soporta callbacks y no promises
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.log('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.log('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code === 'ECONREFUSED'){
            console.log('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if(connection){
        connection.release();//Con esto empieza la conexion
    }
    console.log('DB is Connected');
    return;
});

pool.query = promisify(pool.query);//Con esta linea cada que quiera hacer consultas puedo hacer promises.
module.exports = pool;//Exporto pool para comenzar a hacer las consultas