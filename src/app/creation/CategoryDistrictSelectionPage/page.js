'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosService from '../../services/axiosService';
import { API_URL } from '@/app/services/authService';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation'

export function CategoryDistrictSelectionForm({ onClose }) {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [propertyType, setPropertyType] = useState('sale');
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        // Charger les catégories
        axiosService.get(`${API_URL}categories-by-property-type/`, {
            params: { property_type: propertyType }
        })
            .then(response => {
                setCategories(response.data || []);
            })
            .catch(error => {
                setErrorMessage('Erreur lors du chargement des catégories');
            });

        // Charger les villes et leurs districts
        axiosService.get(`${API_URL}cities-with-districts/`)
            .then(response => {
                setCities(response.data || []);
                console.log(response.data)
            })
            .catch(error => {
                setErrorMessage('Erreur lors du chargement des villes et districts');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [propertyType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const propertyId = localStorage.getItem('currentPropertyId');
        if (!propertyId) {
            setErrorMessage('ID de la propriété non trouvé.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axiosService.patch(`${API_URL}properties/update/${propertyId}/`, {
                category: selectedCategory,
                district: selectedDistrict
            }, {
                headers: {
                    // Assurez-vous d'inclure le token d'authentification si nécessaire
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            console.log('Mise à jour réussie:', response.data);
            setIsLoading(false);
            // Rediriger vers une autre page après la mise à jour
            router.push('/creation/CategoryFieldsPage'); // Remplacez '/path-vers-nouvelle-page' par votre chemin
        } catch (error) {
            console.log(localStorage.getItem('accessToken'));
            console.error('Erreur lors de la mise à jour de la propriété:', error);
            setErrorMessage('Erreur lors de la mise à jour de la propriété.');
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4">
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
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={isLoading}
                >
                    <option value="">Sélectionner une ville</option>
                    {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                </select>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={isLoading}
                >
                    <option value="">Sélectionner un district</option>
                    {cities.find(city => city.id === parseInt(selectedCity))?.districts.map(district => (
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
