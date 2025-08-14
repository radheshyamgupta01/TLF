import { useState, useEffect } from 'react';

export const useProperties = (filters = {}, options = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...filters,
        ...options
      }).toString();

      const response = await fetch(`/api/properties?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      setProperties(data.properties);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (propertyData) => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add property');
      }

      const newProperty = await response.json();
      setProperties(prev => [newProperty, ...prev]);
      return newProperty;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProperty = async (id, updateData) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update property');
      }

      const updatedProperty = await response.json();
      setProperties(prev => 
        prev.map(p => p._id === id ? updatedProperty : p)
      );
      return updatedProperty;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProperty = async (id) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete property');
      }

      setProperties(prev => prev.filter(p => p._id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [JSON.stringify(filters), JSON.stringify(options)]);

  return {
    properties,
    loading,
    error,
    pagination,
    refetch: fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty
  };
};