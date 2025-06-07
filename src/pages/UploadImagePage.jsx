import React, { useState } from 'react';
import SidebarAdmin from '../components/SlidebarAdmin';

const UploadImagePage = () => {
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex min-h-screen">
            <SidebarAdmin />
            <main className="flex-1 p-10 bg-gray-50">
                <h2 className="text-2xl font-bold mb-4">Subir Foto de Alumno</h2>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-6"
                />

                {preview && (
                    <div>
                        <p className="mb-2">Vista previa:</p>
                        <img src={preview} alt="preview" className="w-40 h-40 object-cover rounded border" />
                    </div>
                )}
            </main>
        </div>
    );
};

export default UploadImagePage;
