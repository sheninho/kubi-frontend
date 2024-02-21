"use client";
// components/ShortTextFieldsManagement.js
import React, { useState, useEffect } from 'react';
import axiosService from '../../../services/axiosService'; // Assurez-vous que ce chemin est correct
import { API_URL } from '@/app/services/authService'; // Assurez-vous que ce chemin est correct
import { AiOutlineClose } from 'react-icons/ai';
import Sidebar from '../../SideBar2';

const ShortTextFieldsManagement = () => {
  const [shortTextFields, setShortTextFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState({
    field_name: '',
    label: '',
    max_length: '',
    placeholder: '',
    default_value: '',
    regex_pattern: '',
  });

  useEffect(() => {
    fetchShortTextFields();
  }, []);

  const fetchShortTextFields = async () => {
    try {
      const response = await axiosService.get(`${API_URL}shorttextfields/`);
      setShortTextFields(response.data.results || []);
      console.log(response.data.results)
    } catch (error) {
      console.error('Erreur lors du chargement des ShortTextField', error);
    }
  };

  const handleModalOpen = (field = { max_length: '', placeholder: '', default_value: '', regex_pattern: '' }) => {
    setCurrentField(field);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentField({ max_length: '', placeholder: '', default_value: '', regex_pattern: '' });
  };

  const handleFormSubmit = async (fieldData) => {
    const url = currentField.id ? `${API_URL}shorttextfields/${currentField.id}/` : `${API_URL}shorttextfields/`;
    const method = currentField.id ? 'patch' : 'post';

    try {
      await axiosService[method](url, fieldData);
      fetchShortTextFields();
      handleModalClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout/modification du ShortTextField', error);
    }
  };

  const handleDelete = async (fieldId) => {
    try {
      await axiosService.delete(`${API_URL}shorttextfields/${fieldId}/`);
      fetchShortTextFields();
    } catch (error) {
      console.error('Erreur lors de la suppression du ShortTextField', error);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="p-4">
        <button onClick={() => handleModalOpen()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Ajouter un ShortTextField
        </button>
        {shortTextFields.map((field) => (
          <div key={field.id} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
            <span>{field.placeholder}</span>
            <div>
              <button onClick={() => handleModalOpen(field)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2">
                Modifier
              </button>
              <button onClick={() => handleDelete(field.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {isModalOpen && (
          <ShortTextFieldModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSubmit={handleFormSubmit}
            fieldData={currentField}
          />
        )}
      </div>
    </div>
  );
};

// Assurez-vous de mettre à jour ShortTextFieldModal pour inclure les champs de formulaire et gérer correctement les entrées de l'utilisateur.


// ShortTextFieldModal.js

const ShortTextFieldModal = ({ isOpen, onClose, onSubmit, fieldData }) => {
  const [field_name, setFieldName] = useState('');
  const [label, setLabel] = useState('');
  const [max_length, setMaxLength] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [default_value, setDefaultValue] = useState('');
  const [regex_pattern, setRegexPattern] = useState('');

  useEffect(() => {
    if (fieldData) {
      setFieldName(fieldData.field_name || '');
      setLabel(fieldData.label || '');
      setMaxLength(fieldData.max_length || '');
      setPlaceholder(fieldData.placeholder || '');
      setDefaultValue(fieldData.default_value || '');
      setRegexPattern(fieldData.regex_pattern || '');
    }
  }, [fieldData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      field_name,
      label,
      max_length,
      placeholder,
      default_value,
      regex_pattern,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900">{fieldData ? 'Modifier' : 'Ajouter'} un ShortTextField</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block">Field Name</label>
            <input
              type="text"
              value={field_name}
              onChange={(e) => setFieldName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block">Max Length</label>
            <input
              type="number"
              value={max_length}
              onChange={(e) => setMaxLength(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block">Placeholder</label>
            <input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block">Default Value</label>
            <input
              type="text"
              value={default_value}
              onChange={(e) => setDefaultValue(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-4">
            <label className="block">Regex Pattern</label>
            <input
              type="text"
              value={regex_pattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Soumettre
            </button>
          </div>
        </form>
        <button onClick={onClose} className=" button-border absolute top-0 right-0 p-2">
          <AiOutlineClose size={24} />
        </button>
      </div>
    </div>
  );
};


export default ShortTextFieldsManagement;
