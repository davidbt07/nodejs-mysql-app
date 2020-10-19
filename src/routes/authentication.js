//Rutas sign in, sign out, todas las de login
const express = require('express');
const router = express.Router();
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

//Para menar ruta signup
//Para renderizar el formulario
router.get('/signup', isNotLoggedIn, (req, res) => {
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
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup', 
        failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin', 
        failureFlash: true
    })(req, res, next)
});

router.get('/profile', isLoggedIn, (req, res) => {//Al intentar obtener esa ruta se ejecuta primero isLoggedIn y luego la función anónima
    res.render('profile');//Al no estar en ninguna carpeta se pone solo el nombre del archivo
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();//Es un metodo de passport
    res.redirect('/signin');
});
module.exports = router;