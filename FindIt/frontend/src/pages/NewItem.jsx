import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FormInput, FormSelect, FormTextArea, FormFileInput } from '../components/FormElements';
import useFileUpload from '../hooks/useFileUpload';

const NewItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { uploadFiles, isLoading: isUploading } = useFileUpload();
  
  // Get category from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const categoryFromUrl = searchParams.get('category');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: categoryFromUrl || 'Lost', // Use category from URL or default to 'Lost'
    itemCategory: 'Electronics', // Default to Electronics
    location: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Upload images first
      let imageUrls = [];
      if (files.length > 0) {
        imageUrls = await uploadFiles(files);
      }

      // Create item with image URLs
      const response = await axios.post('/api/items', {
        ...formData,
        images: imageUrls
      });

      navigate(`/items/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create item');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-navy mb-6">Post a New Item</h1>

      {error && (
        <div className="bg-red-50 text-red-800 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <FormInput
          label="Item Name"
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <FormTextArea
          label="Description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Provide detailed information about the item..."
        />

        <FormSelect
          label="Status"
          id="category"
          value={formData.category}
          onChange={handleChange}
          required
          options={[
            { value: 'Lost', label: 'Lost Item' },
            { value: 'Found', label: 'Found Item' }
          ]}
        />

        <FormSelect
          label="Item Category"
          id="itemCategory"
          value={formData.itemCategory}
          onChange={handleChange}
          required
          options={[
            { value: 'Electronics', label: 'Electronics' },
            { value: 'Clothing', label: 'Clothing' },
            { value: 'Accessories', label: 'Accessories' },
            { value: 'Documents', label: 'Documents' },
            { value: 'Keys', label: 'Keys' },
            { value: 'Bags', label: 'Bags' },
            { value: 'Others', label: 'Others' }
          ]}
        />

        <FormInput
          label="Location"
          type="text"
          id="location"
          value={formData.location}
          onChange={handleChange}
          required
          placeholder="Where was it lost/found?"
        />

        <FormInput
          label="Date"
          type="date"
          id="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <FormFileInput
          label="Images"
          id="images"
          onChange={handleFileChange}
          accept="image/*"
          multiple
          required
        />

        <button
          type="submit"
          className="btn-primary w-full mt-6"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting || isUploading ? 'Posting...' : 'Post Item'}
        </button>
      </form>
    </div>
  );
};

export default NewItem;