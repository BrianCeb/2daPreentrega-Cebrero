// PRIMER ARCHIVO A MODIFICAR:
// src/pages/Ingresospage.jsx

import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../components/SlidebarAdmin';
import RegistroIngreso from '../components/RegistroIngreso';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

const IngresosPage = () => {
    const [ingresos, setIngresos] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [colapsados, setColapsados] = useState({});

    useEffect(() => {
        fetch(`${API_URL}/api/ingresos`)
            .then(res => res.json())
            .then(data => setIngresos(data))
            .catch(err => console.error('Error al obtener ingresos:', err));

        fetch(`${API_URL}/api/alumnos`)
            .then(res => res.json())
            .then(data => setAlumnos(data))
            .catch(err => console.error('Error al obtener alumnos:', err));
    }, []);

    const handleRegistrarIngreso = (nuevoIngreso) => {
        const yaIngresoHoy = ingresos.some(ingreso => {
            const mismaFecha = new Date(ingreso.fecha).toDateString() === new Date().toDateString();
            return ingreso.dni === nuevoIngreso.dni && mismaFecha;
        });

        if (yaIngresoHoy) {
            toast.info('⚠️ Este alumno ya registró ingreso hoy');
            return;
        }

        fetch(`${API_URL}/api/ingresos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoIngreso)
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al registrar ingreso');
                return res.json();
            })
            .then((data) => {
                const alumno = alumnos.find(a => a.dni === nuevoIngreso.dni);
                if (!alumno) {
                    toast.error('⚠️ Ingreso registrado pero alumno no encontrado');
                } else {
                    const vencido = new Date(alumno.fechaVencimiento) < new Date();
                    if (vencido) {
                        toast.warn(`⚠️ ${alumno.nombre} tiene el pago vencido`);
                    } else {
                        toast.success(`✅ Ingreso registrado para ${alumno.nombre}`);
                    }
                }
                setIngresos(prev => [data, ...prev]);
            })
            .catch(err => {
                console.error(err);
                toast.error('❌ Error al registrar ingreso');
            });
    };

    const getSemaforoColor = (fechaVenc) => {
        const diff = (new Date(fechaVenc) - new Date()) / (1000 * 60 * 60 * 24);
        if (diff <= 3 && diff >= 0) return 'bg-yellow-400';
        if (diff < 0) return 'bg-red-500';
        return 'bg-green-500';
    };

    const buscarAlumno = (dni) => alumnos.find(a => a.dni === dni);

    const ingresosAgrupados = ingresos.reduce((acc, ingreso) => {
        const fecha = ingreso.fecha ? new Date(ingreso.fecha).toLocaleDateString() : 'Fecha inválida';
        if (!acc[fecha]) acc[fecha] = [];
        acc[fecha].push(ingreso);
        return acc;
    }, {});

    const toggleColapsado = (fecha) => {
        setColapsados(prev => ({ ...prev, [fecha]: !prev[fecha] }));
    };

    return (
        <div className="flex min-h-screen">
            <SidebarAdmin />
            <main className="flex-1 p-6 flex flex-col items-center">
                <div className="max-w-3xl w-full">
                    <h1 className="text-3xl font-bold mb-6 text-center">Registro de Ingresos</h1>
                    <p className="text-gray-600 text-center mb-8">
                        Aquí podrás registrar y controlar el ingreso diario de los alumnos al gimnasio.
                    </p>
                    <div className="flex justify-center mb-8">
                        <RegistroIngreso onRegistrarIngreso={handleRegistrarIngreso} />
                    </div>

                    <div className="mt-10">
                        <h2 className="text-xl font-semibold mb-4 text-center">Historial de Ingresos</h2>
                        {Object.entries(ingresosAgrupados).map(([fecha, listaIngresos]) => (
                            <div key={fecha} className="mb-6">
                                <button
                                    className="w-full text-left font-semibold bg-gray-200 p-2 rounded hover:bg-gray-300"
                                    onClick={() => toggleColapsado(fecha)}
                                >
                                    {fecha} ({listaIngresos.length} ingresos)
                                </button>
                                {!colapsados[fecha] && (
                                    <ul className="space-y-2 mt-2">
                                        {listaIngresos.map((ingreso, index) => {
                                            const alumno = buscarAlumno(ingreso.dni);
                                            const semaforo = alumno ? getSemaforoColor(alumno.fechaVencimiento) : 'bg-gray-300';
                                            const foto = alumno?.fotoUrl || 'https://via.placeholder.com/40';
                                            const nombre = alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Alumno desconocido';

                                            return (
                                                <li key={index} className="bg-gray-100 p-3 rounded shadow flex items-center space-x-4">
                                                    <img
                                                        src={foto}
                                                        alt="Foto"
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                    <span className={`inline-block w-4 h-4 rounded-full ${semaforo}`} title="Estado de pago"></span>
                                                    <span className="font-medium">{nombre}</span>
                                                    <span className="text-sm text-gray-600">
                                                        {ingreso.fecha ? new Date(ingreso.fecha).toLocaleTimeString() : 'Sin hora'}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default IngresosPage;
