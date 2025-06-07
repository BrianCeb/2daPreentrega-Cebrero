import React, { useState, useEffect } from 'react';

const AlumnoForm = ({ onSubmit, editingAlumno }) => {
    const [alumno, setAlumno] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        fechaPago: '',
        fotoUrl: ''
    });

    useEffect(() => {
        if (editingAlumno) {
            setAlumno(editingAlumno);
        } else {
            setAlumno({
                nombre: '',
                apellido: '',
                dni: '',
                email: '',
                fechaPago: '',
                fotoUrl: ''
            });
        }
    }, [editingAlumno]);

    const handleChange = (e) => {
        setAlumno({ ...alumno, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(alumno);

    // Limpiar formulario 
    setAlumno({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        fechaPago: '',
        fotoUrl: ''
    });
};


    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mt-4">
            <h2 className="text-lg font-semibold mb-4">
                {editingAlumno ? 'Editar Alumno' : 'Alta de Alumno'}
            </h2>

            <div className="mb-2">
                <label className="block mb-1">Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    value={alumno.nombre}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div className="mb-2">
                <label className="block mb-1">Apellido:</label>
                <input
                    type="text"
                    name="apellido"
                    value={alumno.apellido}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div className="mb-2">
                <label className="block mb-1">DNI:</label>
                <input
                    type="text"
                    name="dni"
                    value={alumno.dni}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                    disabled={editingAlumno}
                />
            </div>

            <div className="mb-2">
                <label className="block mb-1">Email:</label>
                <input
                    type="email"
                    name="email"
                    value={alumno.email}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div className="mb-2">
                <label className="block mb-1">Fecha de Pago:</label>
                <input
                    type="date"
                    name="fechaPago"
                    value={alumno.fechaPago}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div className="mb-2">
                <label className="block mb-1">Foto (URL):</label>
                <input
                    type="url"
                    name="fotoUrl"
                    value={alumno.fotoUrl}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    placeholder="https://..."
                />
            </div>

            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded mt-2"
            >
                {editingAlumno ? 'Actualizar' : 'Guardar'}
            </button>
        </form>
    );
};

export default AlumnoForm;
