'use client'
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext.js';
import axiosService from '../../services/axiosService';
import CircularProgress from '@mui/material/CircularProgress';
import { AiOutlineClose } from 'react-icons/ai';

const PropertyCreationPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const authContext = useContext(useAuth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosService.post('/properties/create/', {
                title,
                description,
                type
            });
            console.log(response.data);
            // Gérer la réponse, par exemple rediriger vers une autre page
        } catch (error) {
            console.error('Erreur lors de la création de la propriété', error);
        }
    };

    return (
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
                />
                <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
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
    );
};

export default PropertyCreationPage;
