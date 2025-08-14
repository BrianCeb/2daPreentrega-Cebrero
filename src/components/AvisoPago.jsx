import React from 'react';

const AvisoPago = ({ alumnos }) => {
    const hoy = new Date();

    const getSemaforoColor = (fechaVenc) => {
        const fv = fechaVenc ? new Date(fechaVenc) : null;
        if (!fv || isNaN(fv)) return 'bg-gray-400';
        const diff = (fv - new Date()) / (1000 * 60 * 60 * 24);
        if (diff <= 3 && diff >= 0) return 'bg-yellow-400';
        if (diff < 0) return 'bg-red-500';
        return 'bg-green-500';
    };

    const alumnosConAviso = alumnos.filter((alumno) => {
        const fechaVencimiento = new Date(alumno.fechaVencimiento);
        const diffDias = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
        return diffDias >= 0 && diffDias <= 3;
    });

    if (alumnosConAviso.length === 0) return null;

    return (
        <div className="bg-yellow-100 p-4 rounded shadow-md mt-4">
            <h2 className="text-lg font-semibold mb-2 text-yellow-800">Pagos Próximos a Vencer</h2>
            <ul className="space-y-2">
                {alumnosConAviso.map((alumno, index) => {
                    const fechaVenc = new Date(alumno.fechaVencimiento).toLocaleDateString();
                    const diasRestantes = Math.ceil((new Date(alumno.fechaVencimiento) - hoy) / (1000 * 60 * 60 * 24));

                    return (
                        <li key={index} className="flex items-center space-x-3">
                            <span
                                className={`inline-block w-3 h-3 rounded-full ${getSemaforoColor(alumno.fechaVencimiento)}`}
                                title="Estado de pago"
                            ></span>
                            <span>
                                <span className="font-medium">{alumno.nombre} {alumno.apellido}</span> - vence el {fechaVenc} ({diasRestantes} día/s)
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AvisoPago;
