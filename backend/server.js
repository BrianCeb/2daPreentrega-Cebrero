
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import alumnosRouter from './src/routes/alumnos.router.js';
import Alumno from './src/models/Alumno.js';
import ingresosRouter from './src/routes/ingresos.router.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
    'http://localhost:5173',
    'https://gimnasio-frontend.vercel.app'
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST']
    }
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log(' Conectado a MongoDB'))
    .catch(err => console.error(' Error al conectar a MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

app.use('/api/alumnos', alumnosRouter);
app.use('/api/ingresos', ingresosRouter);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/alumnos', async (req, res) => {
    const { limit = 5, page = 1, sort, nombre } = req.query;
    const query = nombre ? { nombre: { $regex: nombre, $options: 'i' } } : {};
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort ? { nombre: sort === 'asc' ? 1 : -1 } : {}
    };

    try {
        const result = await Alumno.paginate(query, options);
        res.render('alumnosPaginados', {
            alumnos: result.docs,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            totalPages: result.totalPages
        });
    } catch (error) {
        res.status(500).send('Error al cargar alumnos');
    }
});

app.get('/realtimealumnos', (req, res) => {
    res.render('alumnos');
});

io.on('connection', async socket => {
    console.log(' Cliente conectado');

    const alumnos = await Alumno.find();
    socket.emit('alumnos', alumnos);

    socket.on('nuevoAlumno', async alumnoData => {
        try {
            const existente = await Alumno.findOne({ dni: alumnoData.dni });
            if (existente) {
                console.log(' DNI duplicado');
                return;
            }

            const fechaPago = new Date(alumnoData.fechaPago);
            const fechaVencimiento = new Date(fechaPago);
            fechaVencimiento.setDate(fechaPago.getDate() + 30);

            const nuevoAlumno = new Alumno({
                nombre: alumnoData.nombre,
                apellido: alumnoData.apellido,
                dni: alumnoData.dni,
                email: alumnoData.email,
                fechaPago,
                fechaVencimiento,
                fotoUrl: alumnoData.fotoUrl || ''
            });

            await nuevoAlumno.save();
            const actualizados = await Alumno.find();
            io.emit('alumnos', actualizados);
        } catch (err) {
            console.error('Error al guardar alumno desde socket:', err);
        }
    });

    socket.on('eliminarAlumno', async id => {
        await Alumno.findByIdAndDelete(id);
        const actualizados = await Alumno.find();
        io.emit('alumnos', actualizados);
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(` Servidor corriendo en http://0.0.0.0:${PORT}`);
});
