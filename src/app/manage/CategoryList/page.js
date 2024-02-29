"use client";
import React, { useState, useEffect } from 'react';
import { API_URL } from '@/app/services/authService';
import { AiOutlineClose, AiOutlinePlusCircle } from 'react-icons/ai';
import axiosService from '@/app/services/axiosService';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allFields, setAllFields] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchAllFields();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosService.get(`${API_URL}categories/`);
      setCategories(response.data.results || []);
    } catch (error) {
      console.error('Error loading categories', error);
    }
  };

  const fetchAllFields = async () => {
    try {
      const response = await axiosService.get(`${API_URL}fields/`);
      setAllFields(response.data.results || []);
    } catch (error) {
      console.error('Error loading fields', error);
    }
  };

  const handleModalOpen = (category = null) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveCategory = async (categoryData) => {
    console.log(categoryData)
    const url = selectedCategory ? `${API_URL}categories/${selectedCategory.id}/` : `${API_URL}categories/`;
    const method = selectedCategory ? 'patch' : 'post';

    try {
      await axiosService[method](url, categoryData);
      fetchCategories();
      handleModalClose();
    } catch (error) {
      console.error('Error submitting category', error);
    }
  };

  return (
    <div className='mt-16'>
      <button onClick={() => handleModalOpen()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Category
      </button>
      {categories.map((category) => (
        <div key={category.id} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
          <span>{category.name}</span>
          <button onClick={() => handleModalOpen(category)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded">
            Edit
          </button>
        </div>
      ))}
      {isModalOpen && (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleSaveCategory}
          category={selectedCategory}
          allFields={allFields}
        />
      )}
    </div>
  );
};

const CategoryModal = ({ isOpen, onClose, onSave, category = null, allFields }) => {
  const [name, setName] = useState('');
  const [application_type, setApplicationType] = useState('');
  const [category_fields, setCategoryFields] = useState([]);

  useEffect(() => {
    if (category) {
      console.log(category.category_fields);
      setName(category.name);
      setApplicationType(category.application_type);
      setCategoryFields(category.category_fields);
    } else {
      setName('');
      setApplicationType('sale');
      setCategoryFields([]);
    }
  }, [category]);

  const handleAddField = () => {
    console.log(category_fields)
    setCategoryFields([...category_fields, { field: '', is_required: false }]);
  };

  const handleRemoveField = (index) => {
    const newFields = category_fields.filter((_, i) => i !== index);
    setCategoryFields(newFields);
  };

  const handleFieldChange = (index, value) => {
    const newFields = category_fields.map((field, i) => {
      if (i === index) {
        return { ...field, field: value };
      }
      return field;
    });
    setCategoryFields(newFields);
  };

  const handleRequiredChange = (index, value) => {
    const newFields = category_fields.map((field, i) => {
      if (i === index) {
        return { ...field, is_required: value };
      }
      return field;
    });
    setCategoryFields(newFields);
  };


  const getAvailableFields = (currentFieldId) => {
    // Convertit les identifiants en chaînes pour une comparaison cohérente, si nécessaire
    const selectedFieldIds = category_fields.map(field => String(field.field));
    const currentFieldIdStr = String(currentFieldId);
  
    // Filtre allFields pour exclure ceux déjà sélectionnés, sauf le champ actuel
    return allFields.filter(field =>
      !selectedFieldIds.includes(String(field.id)) || currentFieldIdStr === String(field.id)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      application_type,
      category_fields,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900">{category ? 'Edit Category' : 'Add Category'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mt-4">
            <label>Type</label>
            <select
              value={application_type}
              onChange={(e) => setApplicationType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="mt-4">
            <label>Fields</label>
            {category_fields.map((field,index) => (
              <div key={index} className="flex items-center mt-2">
                <select
                  value={field.field}
                  onChange={(e
                  ) => handleFieldChange(index, e.target.value)}
                  className="p-2 border rounded flex-1 mr-2"
                  required
                >
                  <option value="">Select a field</option>
                  {getAvailableFields(field.field).map((f) => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
                <input
                  type="checkbox"
                  checked={field.is_required}
                  onChange={(e) => handleRequiredChange(index, e.target.checked)}
                  className="mr-2"
                /> Required
                <button type="button" onClick={() => handleRemoveField(index)} className="text-red-500">
                  <AiOutlineClose size={20} />
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddField} className="mt-2 flex items-center text-blue-500">
              <AiOutlinePlusCircle size={20} className="mr-1" /> Add Field
            </button>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Save
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

export default CategoriesManagement;