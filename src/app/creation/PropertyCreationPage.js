import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Assurez-vous que ce chemin est correct
import axiosService from '../services/axiosService';

const PropertyCreationPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const authContext = useContext(AuthContext);

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
        <div>
            <h1>Créer une Nouvelle Propriété</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre de la propriété"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="Sale">Vente</option>
                    <option value="Rent">Location</option>
                </select>
                <button type="submit">Créer</button>
            </form>
        </div>
    );
};

export default PropertyCreationPage;
