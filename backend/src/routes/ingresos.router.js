import express from 'express';
import Ingreso from '../models/Ingreso.js';
import Alumno from '../models/Alumno.js';

const router = express.Router();

// nuevo ingreso por DNI
router.post('/', async (req, res) => {
    try {
        const { dni } = req.body;
        const alumno = await Alumno.findOne({ dni });

        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        const nuevo = new Ingreso({
            dni: req.body.dni,
            fecha: new Date()
        });

        await nuevo.save();
        res.status(201).json(nuevo);
    } catch (error) {
        console.error(' Error al guardar ingreso:', error);
        res.status(500).json({ error: 'Error al registrar ingreso' });
    }
});

// todos los ingresos
router.get('/', async (req, res) => {
    try {
        const ingresos = await Ingreso.find().sort({ fecha: -1 });
        res.json(ingresos);
    } catch (error) {
        console.error(' Error al obtener ingresos:', error);
        res.status(500).json({ error: 'Error al obtener ingresos' });
    }
});

export default router;
