import React from 'react';

const AlumnosList = ({ alumnos, onEdit, onDelete }) => {
    const getSemaforoColor = (fechaVenc) => {
        const fv = fechaVenc ? new Date(fechaVenc) : null;
        if (!fv || isNaN(fv)) return 'bg-gray-400';
        const diff = (fv - new Date()) / (1000 * 60 * 60 * 24);
        if (diff <= 3 && diff >= 0) return 'bg-yellow-400';
        if (diff < 0) return 'bg-red-500';
        return 'bg-green-500';
    };

    return (
        <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Listado de Alumnos</h2>
            <ul className="space-y-2">
                {alumnos.map((alumno) => {
                    const fechaVenc = new Date(alumno.fechaVencimiento).toLocaleDateString();

                    return (
                        <li
                            key={alumno._id || alumno.dni}
                            className="bg-gray-100 p-3 rounded shadow flex justify-between items-center transition-all duration-300 animate-fade-in"
                        >

                            <div className="flex items-center space-x-3">
                                <img
                                    src={alumno.fotoUrl || 'https://via.placeholder.com/48'}
                                    alt="Foto"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-medium">{alumno.nombre} {alumno.apellido}</p>
                                    <p className="text-sm text-gray-600">Vence: {fechaVenc}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span
                                    className={`inline-block w-4 h-4 rounded-full ${getSemaforoColor(alumno.fechaVencimiento)}`}
                                    title="Estado de pago"
                                ></span>
                                <button
                                    onClick={() => onEdit(alumno)}
                                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(alumno)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AlumnosList;
