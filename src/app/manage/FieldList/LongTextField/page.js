"use client"
import React, { useState, useEffect } from 'react';
import axiosService from '../../../services/axiosService'; // Update this path as needed
import { API_URL } from '@/app/services/authService'; // Update this path as needed
import { AiOutlineClose } from 'react-icons/ai';

const LongTextFieldsManagement = () => {
  const [longTextFields, setLongTextFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState({
    label: '',
    field_name: '',
    placeholder: '',
    rows: '',
    cols: '',
    maxLength: '',
    spellCheck: false,
  });

  useEffect(() => {
    fetchLongTextFields();
  }, []);

  const fetchLongTextFields = async () => {
    try {
      const response = await axiosService.get(`${API_URL}longtextfields/`);
      setLongTextFields(response.data.results || []);
    } catch (error) {
      console.error('Error loading LongTextFields', error);
    }
  };

  const handleModalOpen = (field = { label: '', field_name: '', placeholder: '', rows: '', cols: '', maxLength: '', spellCheck: false }) => {
    setCurrentField(field);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentField({ label: '', field_name: '', placeholder: '', rows: '', cols: '', maxLength: '', spellCheck: false });
  };

  const handleFormSubmit = async (fieldData) => {
    const url = currentField.id ? `${API_URL}longtextfields/${currentField.id}/` : `${API_URL}longtextfields/`;
    const method = currentField.id ? 'patch' : 'post';

    try {
      await axiosService[method](url, fieldData);
      fetchLongTextFields();
      handleModalClose();
    } catch (error) {
      console.error('Error submitting LongTextField', error);
    }
  };

  return (
    <div className="p-4">
      <button onClick={() => handleModalOpen()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add LongTextField
      </button>
      {longTextFields.map((field) => (
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
        <LongTextFieldModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
          fieldData={currentField}
        />
      )}
    </div>
  );
};

const LongTextFieldModal = ({ isOpen, onClose, onSubmit, fieldData }) => {
  const [label, setLabel] = useState('');
  const [field_name, setFieldName] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [rows, setRows] = useState('');
  const [cols, setCols] = useState('');
  const [maxLength, setMaxLength] = useState('');
  const [spellCheck, setSpellCheck] = useState(false);

  // Initialize form state with fieldData when the modal is opened
  useEffect(() => {
    if (fieldData) {
      setLabel(fieldData.label || '');
      setFieldName(fieldData.field_name || '');
      setPlaceholder(fieldData.placeholder || '');
      setRows(fieldData.rows || '');
      setCols(fieldData.cols || '');
      setMaxLength(fieldData.maxLength || '');
      setSpellCheck(fieldData.spellCheck || false);
    }
  }, [fieldData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare data from state and call onSubmit
    onSubmit({
      label,
      field_name,
      placeholder,
      rows: Number(rows), // Ensure rows and cols are submitted as numbers
      cols: Number(cols),
      maxLength: maxLength ? Number(maxLength) : null, // Submit maxLength as number if it's not empty
      spellCheck,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900">{fieldData ? 'Edit LongTextField' : 'Add LongTextField'}</h3>
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
            <label className="block">Placeholder</label>
            <input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-4">
            <label className="block">Rows</label>
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-4">
            <label className="block">Cols</label>
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-4">
            <label className="block">Max Length</label>
            <input
              type="number"
              value={maxLength}
              onChange={(e) => setMaxLength(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-4">
            <label className="block">
              <input
                type="checkbox"
                checked={spellCheck}
                onChange={(e) => setSpellCheck(e.target.checked)}
              />
              Spell Check
            </label>
          </div>
          <div className="flex justify-end mt-4">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
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


export default LongTextFieldsManagement;
