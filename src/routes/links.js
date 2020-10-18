//Rutas para almacenar enlaces, eliminarnos o actualizarlos
const express = require('express');
const router = express.Router();

const pool = require('../database');//Este pool hace referencia a la conexion de la base de datos
//Manejar ruta add
router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    console.log(req.body);//Mostrar lo que se obtiene del formulario
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    }
    console.log('newLink', newLink);
    //Sigue guardar esta info en la BD
    await pool.query('INSERT INTO links set ?', [newLink]);//El signo de interrogacion dice que va a pasar el dato luego, en este caso en un arreglo
    //await dice que la peticion va a tomar tiempo, entonces cuando termine va a seguir la siguiente linea, requiere que la funcion principal tenga "async"
    res.redirect('/links');
});
//Manejar ruta links
router.get('/', async (req, res) => {
    const links = await pool.query('SELECT * FROM links');
    console.log(links);
    res.render('links/list', {links});

});//Por el prefijo links queda /links
module.exports = router;