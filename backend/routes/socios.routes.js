const express = require('express');
const pool = require('../database/connection');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM socios');

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los socios'
        });
    }
});

module.exports = router;