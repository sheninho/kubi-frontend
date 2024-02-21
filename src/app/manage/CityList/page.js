"use client"
// components/CitiesManagement.js
import React, { useState, useEffect } from 'react';
import axiosService from '../../services/axiosService';
import { API_URL } from '@/app/services/authService';
import { AiOutlineClose } from 'react-icons/ai'
import Sidebar from '../SideBar2';

export default function CitiesManagement() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cityName, setCityName] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = () => {
    setIsLoading(true);
    axiosService.get(`${API_URL}cities/`)
      .then(response => {
        setCities(response.data.results || []);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des villes', error);
        setErrorMessage('Erreur lors du chargement des villes');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddCity = () => {
    setIsModalOpen(true);
    setSelectedCity(null);
    setCityName('');
  };

  const handleEditCity = (city) => {
    setIsModalOpen(true);
    setSelectedCity(city);
    setCityName(city.name);
  };

  const handleDeleteCity = (cityId) => {
    axiosService.delete(`${API_URL}cities/${cityId}/`)
      .then(() => {
        fetchCities(); // Recharger les villes après la suppression
      })
      .catch(error => {
        console.error('Erreur lors de la suppression de la ville', error);
        setErrorMessage('Erreur lors de la suppression de la ville');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = selectedCity ? `${API_URL}cities/${selectedCity.id}/` : `${API_URL}cities/`;
    const method = selectedCity ? 'patch' : 'post';

    axiosService[method](url, { name: cityName })
      .then(() => {
        fetchCities(); // Recharger les villes après l'ajout/modification
        setIsModalOpen(false);
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout/modification de la ville', error);
        setErrorMessage('Erreur lors de l\'ajout/modification de la ville');
      });
  };

  return (
    <div className="p-4 mt-16">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Gestion des Villes</h1>
        <button onClick={handleAddCity} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Ajouter une ville
        </button>
      </div>
      <div>
        {cities.map(city => (
          <div key={city.id} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
            <span>{city.name}</span>
            <div>
              <button onClick={() => handleEditCity(city)} className="text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded mr-2">Modifier</button>
              <button onClick={() => handleDeleteCity(city.id)} className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-semibold">{selectedCity ? 'Modifier une ville' : 'Ajouter une ville'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={cityName} onChange={(e) => setCityName(e.target.value)} className="w-full p-2 border rounded" placeholder="Nom de la ville" />
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                {selectedCity ? 'Modifier' : 'Ajouter'}
              </button>
            </form>
            <button onClick={() => setIsModalOpen(false)} className=" button-border absolute top-0 right-0 p-2">
              <AiOutlineClose size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
