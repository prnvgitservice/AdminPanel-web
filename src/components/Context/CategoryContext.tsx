import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllCategories } from '../../api/apiMethods';

interface Category {
  _id: string;
  category_name: string;
  category_slug: string;
  meta_title: string,
  meta_description: string,
  status: number;
  category_image: string;
  createdAt: string;
}

interface CategoryContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  loading: boolean;
  error: string | null;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responce = await getAllCategories();
        setCategories(responce?.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, setCategories, loading, error }}>
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