'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/app/services/authService';
import CircularProgress from '@mui/material/CircularProgress';
import { AiOutlineClose } from 'react-icons/ai';

export function CategoryDistrictSelectionForm({ onClose }) {
    const [categories, setCategories] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setIsLoading(true);
        // Charger les catégories
        axios.get(`${API_URL}categories/`)
        .then(response => {
            if (response.data && Array.isArray(response.data.results)) {
                setCategories(response.data.results);
            } else {
                console.error('La réponse pour les catégories n\'est pas dans le format attendu');
            }
        })
        .catch(error => {
            setErrorMessage('Erreur lors du chargement des catégories');
            console.error('Erreur lors du chargement des catégories', error);
        })
        .finally(() => {
            setIsLoading(false);
        });

        // Charger les districts
        axios.get(`${API_URL}districts/`)
        .then(response => {
            if (response.data && Array.isArray(response.data.results)) {
                setDistricts(response.data.results);
            } else {
                console.error('La réponse pour les districts n\'est pas dans le format attendu');
            }
        })
        .catch(error => {
            setErrorMessage('Erreur lors du chargement des districts');
            console.error('Erreur lors du chargement des districts', error);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Logique de soumission du formulaire
        // Ici, vous pouvez envoyer les données sélectionnées à votre API ou passer à l'étape suivante
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            {/* <button className="text-gray-600 hover:text-gray-900" onClick={onClose}>
                <AiOutlineClose size={25} />
            </button> */}
            {/* <h1 className="text-2xl font-semibold text-center mb-4">{title}</h1> */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={isLoading}
                >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={isLoading}
                >
                    <option value="">Sélectionner un district</option>
                    {districts.map(district => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                    ))}
                </select>
                {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}
                <button
                    className="primary"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> : "Continuer"}
                </button>
            </form>
        </div>
    );
}

export default CategoryDistrictSelectionForm;
