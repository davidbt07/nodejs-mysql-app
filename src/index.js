const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

const flash = require('connect-flash');
const session = require('express-session');//Las sesiones almacenan los datos en una memoria del servidor, aunque también se pueden guardar en la BD
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');

const passport = require('passport');//No para definir autenticaciones sino para usar sus metodos principales

//Initialization
const app = express();
require('./lib/passport')

//Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));//Para decirle a node donde está la carpeta views
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');
//Middlewares-Funciones que se ejecutan cuando un usuario envia una peticion al servidor
app.use(session({
    secret: 'yeimysqlnosesession',//Se puede cualquier mensaje
    resave: false, //Para que no se empiece a renovar la sesion
    saveUninitialized: false, //Para que no se vuelva a establecer la sesion
    store: new MySQLStore(database)//Lugar donde se guardará la sesion, en este caso en la base de datos
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}))//Aceptar desde formularios los datos que envie el usuario
app.use(express.json());
app.use(passport.initialize());//Así inicia
app.use(passport.session());//Requiere una sesion para obtener los datos

//Global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');//Así se hace el mensaje success disponsible para todas las vistas
    app.locals.message = req.flash('message');
    next();
});

//Routes
app.use(require('./routes/'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

//Public
app.use(express.static(path.join(__dirname, 'public')));
//Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
