import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import SidebarAdmin from '../components/SlidebarAdmin';
import AlumnoForm from '../components/AlumnosForm';
import AlumnosList from '../components/AlumnoList';
import AvisoPago from '../components/AvisoPago';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(API_URL);



const AlumnosPage = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [editingAlumno, setEditingAlumno] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/alumnos`)
            .then(res => res.json())
            .then(data => setAlumnos(data))
            .catch(err => console.error('Error al obtener alumnos:', err));

        socket.on('alumnos', (data) => {
            setAlumnos(data);
        });

        return () => {
            socket.off('alumnos');
        };
    }, []);

    const handleAgregarAlumno = (alumno) => {
    if (editingAlumno) {
        fetch(`${API_URL}/api/alumnos/${editingAlumno._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(alumno)
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al editar');
                return res.json();
            })
            .then(() => {
                toast.success(' Alumno actualizado correctamente');
                setEditingAlumno(null);
                setMostrarFormulario(false);
                fetch(`${API_URL}/api/alumnos`)
                    .then(res => res.json())
                    .then(data => setAlumnos(data));
            })
            .catch(err => {
                console.error('❌ Error al editar alumno:', err);
                toast.error('❌ No se pudo actualizar el alumno');
            });
    } else {
        socket.emit('nuevoAlumno', alumno);
        toast.success('✅ Alumno agregado correctamente');
        setMostrarFormulario(false);
    }
};


    const handleEditarAlumno = (alumno) => {
        setEditingAlumno(alumno);
        setMostrarFormulario(true);
    };

    const handleEliminarAlumno = (alumno) => {
        if (confirm(`¿Seguro que deseas eliminar a ${alumno.nombre}?`)) {
            socket.emit('eliminarAlumno', alumno._id);
            toast.error('Alumno eliminado');
        }
    };

    return (
        <div className="flex">
            <SidebarAdmin />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Alumnos</h1>
                <AvisoPago alumnos={alumnos} />

                <AlumnosList alumnos={alumnos} onEdit={handleEditarAlumno} onDelete={handleEliminarAlumno} />

                <button
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                >
                    {mostrarFormulario ? 'Cancelar' : 'Agregar Alumno'}
                </button>

                {mostrarFormulario && (
                    <AlumnoForm
                        onSubmit={handleAgregarAlumno}
                        editingAlumno={editingAlumno}
                    />
                )}
            </main>
        </div>
    );
};

export default AlumnosPage;
