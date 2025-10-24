import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllCategories } from '../../api/apiMethods';

interface Category {
  _id: string;
  category_name: string;
  category_slug: string;
  meta_title: string;
  meta_description: string;
  status: number;
  category_image: string;
  totalviews: number;
  ratings: any | null;
  seo_content: string;
  updatedAt: string;
}

export interface CategoryContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  loading: boolean;
  error: string | null;
  refresh?: () => void;
}

interface ApiResponse {
  success: boolean;
  data: Category[];
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setError(null);
      const response = await getAllCategories() as ApiResponse;
      if (response?.success && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
      setError('Failed to load categories. Please try again later.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRefresh = () => {
    fetchCategories();
  };

  return (
    <CategoryContext.Provider value={{ categories, setCategories, loading, error, refresh: handleRefresh }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
};