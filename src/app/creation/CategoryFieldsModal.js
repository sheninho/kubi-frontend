import React, { useState, useEffect } from 'react';
import axiosService from '../services/axiosService';
import { API_URL } from '@/app/services/authService'; // Assurez-vous que ce chemin est correct
import CircularProgress from '@mui/material/CircularProgress';

export function CategoryFieldsModal({ onNext }) {
    const [fields, setFields] = useState([]);
    const [fieldValues, setFieldValues] = useState({}); // État local pour stocker les valeurs des champs
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
                    // Initialisez les valeurs des champs à partir des données de l'API
                    const initialValues = {};
                    response.data.forEach(field => {
                        initialValues[field.id] = ''; // Vous pouvez également utiliser la valeur par défaut du champ ici
                    });
                    setFieldValues(initialValues);
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

    // Gérer les changements de valeur des champs
    const handleFieldChange = (event, fieldId) => {
        const value = event.target.value;
        setFieldValues(prevValues => ({
            ...prevValues,
            [fieldId]: value
        }));
    };

    const renderField = (field) => {
        switch (field.field_type) {
            case 'text_short':
                return (
                    <input
                        type="text"
                        placeholder={field.details.placeholder || 'Texte court'}
                        value={fieldValues[field.id]} // Utilisez la valeur de l'état local pour les champs contrôlés
                        maxLength={field.details.max_length || undefined}
                        onChange={(event) => handleFieldChange(event, field.id)} // Gérer les changements de valeur
                    />
                );
            case 'text_long':
                return (
                    <textarea
                        placeholder={field.details.placeholder || 'Texte long'}
                        value={fieldValues[field.id]}
                        rows={field.details.rows || 4}
                        cols={field.details.cols || 50}
                        maxLength={field.details.maxLength || undefined}
                        spellCheck={field.details.spellCheck || false}
                        onChange={(event) => handleFieldChange(event, field.id)}
                    />
                );
            case 'integer':
                return (
                    <input
                        type="number"
                        placeholder="Nombre"
                        value={fieldValues[field.id]}
                        min={field.details.minValue || undefined}
                        max={field.details.maxValue || undefined}
                        onChange={(event) => handleFieldChange(event, field.id)}
                    />
                );
            case 'select':
                return (
                    <select
                        value={fieldValues[field.id]}
                        onChange={(event) => handleFieldChange(event, field.id)}
                    >
                        {field.details.options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            case 'date':
                return (
                    <input
                        type="date"
                        value={fieldValues[field.id]}
                        min={field.details.minDate || undefined}
                        max={field.details.maxDate || undefined}
                        onChange={(event) => handleFieldChange(event, field.id)}
                    />
                );
            default:
                return <p>Type de champ non supporté : {field.field_type}</p>;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const propertyId = localStorage.getItem('currentPropertyId');
        const propertyValues = fields.map(field => ({
            field_id: field.id,
            value: fieldValues[field.field_name],
        }));
        console.log(fieldValues);

        axiosService.patch(`${API_URL}properties/update/${propertyId}/`, fieldValues)
            .then(response => {
                console.log('Propriété mise à jour avec succès !');
                onNext()
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour de la propriété', error);
            });
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="max-w-lg mx-auto p-4">
                    <h1 className="text-2xl font-semibold text-center mb-4">Champs de la Propriété</h1>
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <form className="space-y-4" onSubmit={handleSubmit}>
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
            </div>
        </div>
    );
}

export default CategoryFieldsModal;
