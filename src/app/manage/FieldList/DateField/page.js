"use client"
import React, { useState, useEffect } from 'react';
import axiosService from '../../../services/axiosService'; // Update this path as needed
import { API_URL } from '@/app/services/authService'; // Update this path as needed
import { AiOutlineClose } from 'react-icons/ai';

const IntegerFieldsManagement = () => {
  const [integerFields, setIntegerFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState({
    label: '',
    field_name: '',
    minValue: '',
    maxValue: ''
  });

  useEffect(() => {
    fetchIntegerFields();
  }, []);

  const fetchIntegerFields = async () => {
    try {
      const response = await axiosService.get(`${API_URL}integerfields/`);
      setIntegerFields(response.data.results || []);
    } catch (error) {
      console.error('Error loading IntegerFields', error);
    }
  };

  const handleModalOpen = (field = { label: '', field_name: '', minValue: '', maxValue: '' }) => {
    setCurrentField(field);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentField({ label: '', field_name: '', minValue: '', maxValue: '' });
  };

  const handleFormSubmit = async (fieldData) => {
    const url = currentField.id ? `${API_URL}integerfields/${currentField.id}/` : `${API_URL}integerfields/`;
    const method = currentField.id ? 'patch' : 'post';

    try {
      await axiosService[method](url, fieldData);
      fetchIntegerFields();
      handleModalClose();
    } catch (error) {
      console.error('Error submitting IntegerField', error);
    }
  };

  return (
    <div className="p-4">
      <button onClick={() => handleModalOpen()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add IntegerField
      </button>
      {integerFields.map((field) => (
        <div key={field.id} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
          <span>{field.label}</span>
          <div>
            <button onClick={() => handleModalOpen(field)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2">
              Edit
            </button>
            {/* Implement delete functionality as needed */}
          </div>
        </div>
      ))}
      {isModalOpen && (
        <IntegerFieldModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
          fieldData={currentField}
        />
      )}
    </div>
  );
};

const IntegerFieldModal = ({ isOpen, onClose, onSubmit, fieldData }) => {
  const [field_name, setFieldName] = useState('');
  const [label, setLabel] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');

  useEffect(() => {
    if (fieldData) {
      setFieldName(fieldData.field_name || '');
      setLabel(fieldData.label || '');
      setMinValue(fieldData.minValue || '');
      setMaxValue(fieldData.maxValue || '');
    }
  }, [fieldData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      field_name,
      label,
      minValue,
      maxValue,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900">{fieldData ? 'Edit IntegerField' : 'Add IntegerField'}</h3>
        <form onSubmit={handleSubmit}>
          {/* Form fields for field_name, label, minValue, maxValue */}
          <button onClick={onClose} className=" button-border absolute top-0 right-0 p-2">
            <AiOutlineClose size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default IntegerFieldsManagement;
