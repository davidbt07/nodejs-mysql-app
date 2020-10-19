const passport = require('passport');//Así puedo utilizar el tipo de autenticación que quiero
//Passport permite hacer autenticaciones a traves de medios sociales tipo, twitter, google, facebook,etc y local

const localStrategy = require('passport-local').Strategy;
const pool = require('../database');

const helpers = require('../lib/helpers');

passport.use('local.signup', new localStrategy({//Gracias al use puedo definir mi autenticación o registro
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
}));

passport.use('local.signin', new localStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, async(req, username, password, done) => {
   const rows =  await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success','Welcome ' + user.username));
        }else {
            done(null, false, req.flash('message','Incorrect Password'));
        }
    }else {
        return done(null, false, req.flash('message','The username does not exists'));
    }
}));

//Middlewares para serializar y desserializar al usuario
passport.serializeUser((user, done) => {
    done(null, user.id);//Cuando serializo estoy guardando el id del usuario
});

passport.deserializeUser(async(id, done) => {//Cuando deserializo estoy tomando el id almacenado para volver a obtener los datos 
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});
