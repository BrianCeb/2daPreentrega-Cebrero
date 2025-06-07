import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/SlidebarAdmin';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const PagosPage = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [filtro, setFiltro] = useState('todos');

    useEffect(() => {
        axios.get(`${API_URL}/api/alumnos`)
            .then(res => setAlumnos(res.data))
            .catch(err => console.error(err));
    }, []);

    const actualizarPago = async (id) => {
        try {
            const hoy = new Date();
            await axios.put(`${API_URL}/api/alumnos/${id}`, {
                fechaPago: hoy.toISOString()
            });
            toast.success('Pago actualizado');
            const res = await axios.get(`${API_URL}/api/alumnos`);
            setAlumnos(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Error al actualizar pago');
        }
    };

    const obtenerEstado = (vencimiento) => {
        const hoy = new Date();
        const fechaVencimiento = new Date(vencimiento);
        const diferencia = (fechaVencimiento - hoy) / (1000 * 60 * 60 * 24);
        if (diferencia < 0) return 'vencido';
        if (diferencia <= 5) return 'porVencer';
        return 'alDia';
    };

    const filtrarAlumnos = alumnos.filter(alumno => {
        const estado = obtenerEstado(alumno.fechaVencimiento);
        return filtro === 'todos' || estado === filtro;
    });

    return (
        <div className="flex min-h-screen">
            <SidebarAdmin />
            <main className="flex-1 p-8">
                <h2 className="text-2xl font-bold mb-4">Control de Pagos</h2>

                <div className="mb-6 space-x-3">
                    <button onClick={() => setFiltro('todos')} className="px-4 py-2 bg-gray-300 rounded">Todos</button>
                    <button onClick={() => setFiltro('alDia')} className="px-4 py-2 bg-green-300 rounded">Al día</button>
                    <button onClick={() => setFiltro('porVencer')} className="px-4 py-2 bg-yellow-300 rounded">Por vencer</button>
                    <button onClick={() => setFiltro('vencido')} className="px-4 py-2 bg-red-300 rounded">Vencidos</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtrarAlumnos.map(alumno => (
                        <div key={alumno._id} className="bg-white p-4 shadow rounded">
                            <h3 className="text-lg font-bold">{alumno.nombre} {alumno.apellido}</h3>
                            <p className="text-sm">DNI: {alumno.dni}</p>
                            <p className="text-sm">Pago: {new Date(alumno.fechaPago).toLocaleDateString()}</p>
                            <p className="text-sm">Vence: {new Date(alumno.fechaVencimiento).toLocaleDateString()}</p>
                            <div className="flex items-center mt-2">
                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${obtenerEstado(alumno.fechaVencimiento) === 'alDia' ? 'bg-green-500' :
                                        obtenerEstado(alumno.fechaVencimiento) === 'porVencer' ? 'bg-yellow-500' :
                                            'bg-red-500'
                                    }`} />
                                <span className="text-sm">
                                    {obtenerEstado(alumno.fechaVencimiento) === 'alDia' ? 'Al día' :
                                        obtenerEstado(alumno.fechaVencimiento) === 'porVencer' ? 'Por vencer' :
                                            'Vencido'}
                                </span>
                            </div>
                            <button onClick={() => actualizarPago(alumno._id)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                                Registrar Pago
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default PagosPage;
