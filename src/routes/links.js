//Rutas para almacenar enlaces, eliminarnos o actualizarlos
const express = require('express');
const router = express.Router();

const pool = require('../database');//Este pool hace referencia a la conexion de la base de datos

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', (req, res) => {
    res.send('Received');
});

module.exports = router;