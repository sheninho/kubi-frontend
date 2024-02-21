'use client'
import React, { useState } from 'react';

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newImages = [...images, ...selectedFiles];
      const newPreviews = newImages.map(file => URL.createObjectURL(file));

      setImages(newImages);
      setPreviews(newPreviews);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setImages(newImages);
    setPreviews(newPreviews);
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative">
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              &times;
            </button>
          </div>
        ))}
        <label className="w-32 h-32 flex justify-center items-center bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
          <input type='file' className="hidden" multiple onChange={handleImageChange} />
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"></path></svg>
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;
