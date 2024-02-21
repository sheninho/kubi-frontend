"use client"// components/DistrictsManagement.js
import React, { useState, useEffect } from 'react';
import axiosService from '../../services/axiosService';
import { API_URL } from '@/app/services/authService';
import { AiOutlineClose } from 'react-icons/ai';
import Sidebar from '../SideBar2';


export default function DistrictsManagement() {
  const [districts, setDistricts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDistrict, setCurrentDistrict] = useState({ name: '', city: '' });
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCities();
    fetchDistricts();
  }, []);

  const fetchCities = () => {
    setIsLoading(true);
    axiosService.get(`${API_URL}cities/`)
      .then(response => {
        setCities(response.data.results || []);
        console.log(response.data.results)
      })
      .catch(error => {
        console.error('Erreur lors du chargement des villes', error);
        setErrorMessage('Erreur lors du chargement des villes');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchDistricts = () => {
    setIsLoading(true);
    axiosService.get(`${API_URL}districts/`)
      .then(response => {
        setDistricts(response.data.results || []);
        console.log(response.data.results)
      })
      .catch(error => {
        console.error('Erreur lors du chargement des districts', error);
        setErrorMessage('Erreur lors du chargement des districts');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleModalOpen = (district = { name: '', city: '' }) => {
    // Assurez-vous que district contient bien un cityId lors de la modification
    setCurrentDistrict({
      id: district.id || '',
      name: district.name || '',
      city: district.city || '' // Utilisez district.cityId ou une propriété similaire selon la structure de vos données
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const url = currentDistrict.id ? `${API_URL}districts/${currentDistrict.id}/` : `${API_URL}districts/`;
    const method = currentDistrict.id ? 'patch' : 'post';

    axiosService[method](url, {
      name: currentDistrict.name,
      city: currentDistrict.city // Assurez-vous que cette propriété correspond à celle attendue par votre backend
    })
      .then(() => {
        fetchDistricts(); // Recharger les districts après l'ajout/modification
        setIsModalOpen(false); // Fermer le modal uniquement en cas de succès
        setCurrentDistrict({ name: '', city: '' }); // Réinitialiser le district courant
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout/modification du district', error);
        // Ici, vous pouvez définir un état pour afficher le message d'erreur dans votre UI
        // setErrorMessage('Erreur lors de l\'ajout/modification du district');
      });
  };


  return (
    <div className="p-4 mt-16">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Gestion des district</h1>
        <button onClick={() => handleModalOpen()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Ajouter un district
        </button>
      </div>
      <div>
        {districts.map((district) => (
          <div key={district.id} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
            <div>
              <span>{district.name}</span>
              {/* Trouver le nom de la ville à partir de l'ID et l'afficher */}
              <span className="ml-2 text-gray-500">
                ({cities.find(city => city.id === district.city)?.name || 'Ville inconnue'})
              </span>
            </div>
            <button onClick={() => handleModalOpen(district)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded">
              Modifier
            </button>
          </div>
        ))}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium text-gray-900">Ajouter / Modifier un District</h3>
              <form onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  value={currentDistrict.name}
                  onChange={(e) => setCurrentDistrict({ ...currentDistrict, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Nom du district"
                  required
                />
                <select
                  value={currentDistrict.city}
                  onChange={(e) => setCurrentDistrict({ ...currentDistrict, city: e.target.value })}
                  className="w-full p-2 border rounded mt-2"
                  required
                >
                  <option value="">Sélectionnez une ville</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
                <div className="flex justify-center mt-4">
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r">
                    Soumettre
                  </button>
                </div>
              </form>
              <button onClick={handleModalClose} className=" button-border absolute top-0 right-0 p-2">
                <AiOutlineClose size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
