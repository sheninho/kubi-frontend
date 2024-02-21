// components/CategoryFieldsForm.js
'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosService from '../../services/axiosService';
import { API_URL } from '@/app/services/authService'; // Assurez-vous que ce chemin est correct
import CircularProgress from '@mui/material/CircularProgress';

export function CategoryFieldsForm() {
    const [fields, setFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const propertyId = localStorage.getItem('currentPropertyId');
        if (!propertyId) {
            setErrorMessage('ID de propriété non trouvé.');
            return;
        }

        setIsLoading(true);
        axiosService.get(`${API_URL}properties/${propertyId}/fields/`)
            .then(response => {
                console.log(response)
                if (response.data && Array.isArray(response.data)) {
                    setFields(response.data);
                } else {
                    console.error('La réponse pour les champs n\'est pas dans le format attendu');
                }
            })
            .catch(error => {
                setErrorMessage('Erreur lors du chargement des champs');
                console.error('Erreur lors du chargement des champs', error);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const renderField = (field) => {
        switch (field.field_type) { // Assurez-vous que `field_type` correspond à la clé renvoyée par votre API
            case 'text_long':
            case 'text_short':
                return <input type="text" placeholder={field.placeholder || 'Texte'} />;
            case 'integer':
                return <input type="number" placeholder="Nombre" />;
            case 'boolean':
                return <input type="checkbox" />;
            case 'select':
                return (
                    <select>
                        {field.options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            // Ajoutez d'autres cas ici selon les types de champs que vous avez
            default:
                return null;
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <h1 className="text-2xl font-semibold text-center mb-4">Champs de la Propriété</h1>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <form className="space-y-4">
                    {fields.map(field => (
                        <div key={field.id}>
                            <label>{field.label}</label>
                            {renderField(field)}
                        </div>
                    ))}
                    {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}
                    <button className="primary" type="submit">Soumettre</button>
                </form>
            )}
        </div>
    );
}

export default CategoryFieldsForm;
