import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/SlidebarAdmin';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;

const RealTimePage = () => {
    const [ingresosPorDia, setIngresosPorDia] = useState([]);
    const [estadoPagos, setEstadoPagos] = useState({ alDia: 0, porVencer: 0, vencido: 0 });

    useEffect(() => {
        axios.get(`${API_URL}/api/ingresos`)
            .then(res => {
                const agrupados = agruparPorDia(res.data);
                setIngresosPorDia(agrupados);
            });

        axios.get(`${API_URL}/api/alumnos`)
            .then(res => {
                const estados = { alDia: 0, porVencer: 0, vencido: 0 };
                const hoy = new Date();

                res.data.forEach(alumno => {
                    const vto = new Date(alumno.fechaVencimiento);
                    const diff = (vto - hoy) / (1000 * 60 * 60 * 24);
                    if (diff < 0) estados.vencido++;
                    else if (diff <= 5) estados.porVencer++;
                    else estados.alDia++;
                });

                setEstadoPagos(estados);
            });
    }, []);

    const agruparPorDia = (ingresos) => {
        const map = {};
        ingresos.forEach(i => {
            const dia = new Date(i.fecha).toLocaleDateString();
            map[dia] = (map[dia] || 0) + 1;
        });
        return Object.entries(map).map(([fecha, cantidad]) => ({ fecha, cantidad }));
    };

    const colores = ['#22c55e', '#facc15', '#ef4444'];

    return (
        <div className="flex min-h-screen">
            <SidebarAdmin />
            <main className="flex-1 p-8">
                <h2 className="text-2xl font-bold mb-6">Estadísticas en Tiempo Real</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-4">Ingresos por Día (últimos días)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={ingresosPorDia}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="fecha" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="cantidad" stroke="#3b82f6" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-4">Estado de Pagos</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Al día', value: estadoPagos.alDia },
                                        { name: 'Por vencer', value: estadoPagos.porVencer },
                                        { name: 'Vencidos', value: estadoPagos.vencido },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                    dataKey="value"
                                >
                                    {['alDia', 'porVencer', 'vencido'].map((k, i) => (
                                        <Cell key={`cell-${i}`} fill={colores[i]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RealTimePage;
