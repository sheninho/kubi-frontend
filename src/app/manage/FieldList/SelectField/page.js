"use client";
// components/SelectFieldsManagement.js
import React, { useState, useEffect } from 'react';
import axiosService from '../../../services/axiosService'; // Assurez-vous que ce chemin est correct
import { API_URL } from '@/app/services/authService'; // Assurez-vous que ce chemin est correct
import { AiOutlineClose, AiOutlinePlusCircle } from 'react-icons/ai';
import Sidebar from '../../SideBar2';

const SelectFieldsManagement = () => {
  const [selectFields, setSelectFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState({
    label: '',
    field_name: '', // Assuming this is the correct property name
    options: []
  });

  useEffect(() => {
    fetchSelectFields();
  }, []);

  const fetchSelectFields = async () => {
    try {
      const response = await axiosService.get(`${API_URL}selectfields/`);
      setSelectFields(response.data.results || []);
      console.log(response.data.results)
    } catch (error) {
      console.error('Erreur lors du chargement des SelectField', error);
    }
  };

  const handleModalOpen = (field = { label: '',field_name: '', options: [] }) => {
    setCurrentField(field);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentField({ label: '',field_name: '', options: [] });
  };

  const handleFormSubmit = async (fieldData) => {
    console.log(fieldData)
    const url = currentField.id ? `${API_URL}selectfields/${currentField.id}/` : `${API_URL}selectfields/`;
    const method = currentField.id ? 'patch' : 'post';

    try {
      await axiosService[method](url, fieldData);
      fetchSelectFields();
      handleModalClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout/modification du SelectField', error);
    }
  };

  const handleDelete = async (fieldId) => {
    try {
      await axiosService.delete(`${API_URL}selectfields/${fieldId}/`);
      fetchSelectFields();
    } catch (error) {
      console.error('Erreur lors de la suppression du SelectField', error);
    }
  };

  return (
      <div className="p-4">
        <button onClick={() => handleModalOpen()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Ajouter un SelectField
        </button>
        {selectFields.map((field) => (
          <div key={field.id} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
            <span>{field.label}</span>
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
          <SelectFieldModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSubmit={handleFormSubmit}
            fieldData={currentField}
          />
        )}
      </div>
  );
};

const SelectFieldModal = ({ isOpen, onClose, onSubmit, fieldData }) => {
  const [field_name, setFieldName] = useState('');
  const [label, setLabel] = useState('');
  const [options, setOptions] = useState([{option_value: '', label: '' }]);

  useEffect(() => {
    if (fieldData) {
      setLabel(fieldData.label || '');
      setOptions(fieldData.options.length ? fieldData.options : [{ value: '', label: '' }]);
    }
  }, [fieldData]);

  const handleOptionChange = (index, key, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][key] = value;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, { value: '', label: '' }]);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      label,
      field_name, // Ensure this is included
      options: options.filter(option => option.label ||
        option.value),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900">{fieldData ? 'Modifier' : 'Ajouter'} un SelectField</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block">Field Name</label>
            <input
              type="text"
              value={field_name} // Make sure this state variable is defined and managed
              onChange={(e) => setFieldName(e.target.value)} // Implement setFieldName
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
            <label className="block">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center mt-2">
                <input
                  type="text"
                  placeholder="Label"
                  value={option.label}
                  onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                  className="p-2 border rounded flex-1 mr-2"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={option.value}
                  onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                  className="p-2 border rounded flex-1"
                />
                <button type="button" onClick={() => handleRemoveOption(index)} className="ml-2 text-red-500">
                  <AiOutlineClose size={20} />
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddOption} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
            <AiOutlinePlusCircle size={20} className="mr-1" />Ajouter Option
            </button>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Soumettre
            </button>
          </div>
        </form>
        <button onClick={onClose} className="button-border absolute top-0 right-0 p-2">
          <AiOutlineClose size={24} />
        </button>
      </div>
    </div>
  );
};


export default SelectFieldsManagement;
