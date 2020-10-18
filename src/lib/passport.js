const passport = require('passport');//Así puedo utilizar el tipo de autenticación que quiero
//Passport permite hacer autenticaciones a traves de medios sociales tipo, twitter, google, facebook,etc y local

const localStrategy = require('passport-local').Strategy;
const pool = require('../database');

const helpers = require('../lib/helpers');

passport.use('local.signup', new localStrategy({
    usernameField: 'username',//Voy a recibir un usernamefield a traves de un input con nombre "username"
    passwordField: "password",
    passReqToCallback: true //Necesario para recibir más campos a parte del username y la contraseña
}, async(req, username, password, done) => {//Esto es un callback, done es un callback, done se va a ejecutar cuando se ha terminado el proceso de autenticacion
    const { fullname } = req.body;
    const newUser = {
        username, //Esto es lo mismo que decir username: username
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password);//Se cifra la contraseña
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id= result.insertId;
    return done(null, newUser);
}));//Gracias al use puedo definir mi autenticación

//Middlewares para serializar y desserializar al usuario
passport.serializeUser((user, done) => {
    done(null, user.id);//Cuando serializo estoy guardando el id del usuario
});

passport.deserializeUser(async(id, done) => {//Cuando deserializo estoy tomando el id almacenado para volver a obtener los datos 
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});
