'use client'
import React, { useState, useContext } from 'react';
import axiosService from '../services/axiosService';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation'

const CreationModal = ({onNext}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Sale');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axiosService.post(`properties/create/`, {
                title,
                description,
                type
            });
            console.log(response.data);

            // Supposons que l'ID de la propriété est retourné dans response.data.id
            const propertyId = response.data.id;
            console.log(propertyId)

            // Enregistrer l'ID de la propriété dans le localStorage
            localStorage.setItem('currentPropertyId', propertyId);

            // Gérer la réponse, par exemple rediriger vers une autre page
            // Par exemple, rediriger vers la page de détail de la propriété ou vers l'étape suivante de la création
            // window.location.href = `/properties/details/${propertyId}`;

            onNext()

            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setErrorMessage('Une erreur est survenue lors de la création de la propriété.');
            setIsLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="max-w-lg mx-auto p-4">
                    {/* <button className="text-gray-600 hover:text-gray-900" onClick={onClose}>
                <AiOutlineClose size={25} />
            </button> */}
                    {/* <h1 className="text-2xl font-semibold text-center mb-4">{title}</h1> */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            type="text"
                            placeholder="Titre de la propriété"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="Sale">Vente</option>
                            <option value="Rent">Location</option>
                        </select>
                        {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}
                        <button
                            className=" primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress /> : "Créer"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreationModal;
