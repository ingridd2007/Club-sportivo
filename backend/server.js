const pool = require('./database/connection');

const express = require('express');
const cors = require('cors');

const sociosRoutes = require('./routes/socios.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/socios', sociosRoutes);

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Servidor del CSyC funcionando');
});

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            mensaje: 'Conexión con PostgreSQL exitosa',
            fecha: result.rows[0].now
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al conectar con PostgreSQL'
        });
    }
});

app.get('/socios', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});