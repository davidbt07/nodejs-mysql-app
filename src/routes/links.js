//Rutas para almacenar enlaces, eliminarnos o actualizarlos
const express = require('express');
const router = express.Router();

const pool = require('../database');//Este pool hace referencia a la conexion de la base de datos

const{ isLoggedIn } = require('../lib/auth');

//Manejar ruta add
router.get('/add', isLoggedIn,(req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    console.log(req.body);//Mostrar lo que se obtiene del formulario
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    }
    console.log('newLink', newLink);
    //Sigue guardar esta info en la BD
    await pool.query('INSERT INTO links set ?', [newLink]);//El signo de interrogacion dice que va a pasar el dato luego, en este caso en un arreglo
    //await dice que la peticion va a tomar tiempo, entonces cuando termine va a seguir la siguiente linea, requiere que la funcion principal tenga "async"
    //Usando flash
    req.flash('success', 'Link saved succesfully');//Parametros(nombre como va a guardar el mensaje, valor del mensaje)
    res.redirect('/links');
});
//Manejar ruta links
router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    console.log(links);
    res.render('links/list', {links});

});//Por el prefijo links queda /links

//Ruta para eliminar
router.get('/delete/:id', isLoggedIn, async(req, res) => {
    console.log(req.params.id);
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('success', 'Links removed succesfully');
    res.redirect('/links');
});

//Ruta para editar
router.get('/edit/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    console.log(id);
    const link = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(link[0]);
    res.render('links/edit',{link: link[0]});
});

router.post('/edit/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params; 
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description, 
        url
    };
    console.log(newLink);
    await pool.query('UPDATE links set ? WHERE id = ?',[newLink, id]);
    req.flash('success', 'Links updated succesfully');
    res.redirect('/links');
});
module.exports = router;