"use client";
import React, { useState, useEffect } from 'react';
import axiosService from '../../../services/axiosService'; // Update this path as needed
import { API_URL } from '@/app/services/authService'; // Update this path as needed
import { AiOutlineClose } from 'react-icons/ai';

const DateFieldsManagement = () => {
  const [dateFields, setDateFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState({
    label: '',
    field_name: '',
    minDate: '',
    maxDate: ''
  });

  useEffect(() => {
    fetchDateFields();
  }, []);

  const fetchDateFields = async () => {
    try {
      const response = await axiosService.get(`${API_URL}datefields/`);
      setDateFields(response.data.results || []);
    } catch (error) {
      console.error('Error loading DateFields', error);
    }
  };

  const handleModalOpen = (field = { label: '', field_name: '', minDate: '', maxDate: '' }) => {
    setCurrentField(field);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentField({ label: '', field_name: '', minDate: '', maxDate: '' });
  };

  const handleFormSubmit = async (fieldData) => {
    const url = currentField.id ? `${API_URL}datefields/${currentField.id}/` : `${API_URL}datefields/`;
    const method = currentField.id ? 'patch' : 'post';

    try {
      await axiosService[method](url, fieldData);
      fetchDateFields();
      handleModalClose();
    } catch (error) {
      console.error('Error submitting DateField', error);
    }
  };

  return (
    <div className="p-4">
      <button onClick={() => handleModalOpen()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add DateField
      </button>
      {dateFields.map((field) => (
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
        <DateFieldModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
          fieldData={currentField}
        />
      )}
    </div>
  );
};

const DateFieldModal = ({ isOpen, onClose, onSubmit, fieldData }) => {
  const [field_name, setFieldName] = useState('');
  const [label, setLabel] = useState('');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    if (fieldData) {
      setFieldName(fieldData.field_name || '');
      setLabel(fieldData.label || '');
      setMinDate(fieldData.minDate || '');
      setMaxDate(fieldData.maxDate || '');
    }
  }, [fieldData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      field_name,
      label,
      minDate,
      maxDate,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900">{fieldData ? 'Edit DateField' : 'Add DateField'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label>Field Name</label>
            <input
              type="text"
              value={field_name}
              onChange={(e) => setFieldName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mt-4">
            <label>Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mt-4">
            <label>Min Date</label>
            <input
              type="date"
              value={minDate}
              onChange={(e) => setMinDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-4">
            <label>Max Date</label>
            <input
              type="date"
              value={maxDate}
              onChange={(e) => setMaxDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Submit
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

export default DateFieldsManagement;
