//Rutas sign in, sign out, todas las de login
const express = require('express');
const router = express.Router();
const passport = require('passport');

//Para menar ruta signup
//Para renderizar el formulario
router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

//Para recibir los datos del formulario
/*router.post('/signup', (req, res) => {
    passport.athenticate('local.signup', {//Se le tiene que dar justo el nombre de la autenticacion creada(en este caso está en /lib/passport.js -> passport.use)
        successRedirect: '/profile',//Para indicarle a donde lo debe enviar cuando todo esté correcto
        failureRedirect: '/signup',//Para indicarle a donde lo debe enviar cuando falle la autenticacion 
        failureFlash: true //Para enviarle mensajes con connect flash a passport
    });
    
    res.send('received');
});*/

//Otra forma más sencilla es pasar la info a traves del enrutador
router.post('/signup', passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup', 
        failureFlash: true
}));

router.get('/signin', (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin', 
        failureFlash: true
    })(req, res, next)
});

router.get('/profile', (req, res) => {
    res.send('This is your profile');
});
module.exports = router;