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

router.post('/', async (req, res) => {
    try {
        const { nombre, apellido, dni, telefono, email, estado } = req.body;

        const result = await pool.query(
            `INSERT INTO socios 
            (nombre, apellido, dni, telefono, email, estado)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [nombre, apellido, dni, telefono, email, estado]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        if (error.code === '23505') {
            return res.status(409).json({
                mensaje: 'Ya existe un socio con ese DNI'
            });
        }

        res.status(500).json({
            mensaje: 'Error al crear el socio'
        });
    }
});

router.patch('/:id/estado', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado || !['Activo', 'Inactivo'].includes(estado)) {
            return res.status(400).json({
                mensaje: 'Estado inválido'
            });
        }

        const result = await pool.query(
            `UPDATE socios
             SET estado = $1
             WHERE id = $2
             RETURNING *`,
            [estado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Socio no encontrado'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el estado del socio'
        });
    }
});

module.exports = router;