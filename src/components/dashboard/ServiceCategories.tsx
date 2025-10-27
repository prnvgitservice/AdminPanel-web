// components/ServiceCategories.tsx
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getCategorydetailsDashboard } from '../../api/apiMethods';
import { Category, CategoryDetailsResponse } from '../../pages/Dashboard';

const ServiceCategories: React.FC = () => {
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await getCategorydetailsDashboard({}) as CategoryDetailsResponse;
        if (categoryResponse.success) {
          const totalServices = categoryResponse.result.categoriesDetails.reduce(
            (sum, cat) => sum + cat.noOfServices,
            0
          );
          const topCategories = categoryResponse.result.categoriesDetails
            .filter((cat) => cat.noOfServices > 0)
            .sort((a, b) => b.noOfServices - a.noOfServices)
            .slice(0, 4);
          const otherServices = categoryResponse.result.categoriesDetails
            .filter((cat) => cat.noOfServices > 0)
            .slice(4)
            .reduce((sum, cat) => sum + cat.noOfServices, 0);
          const formattedCategories: Category[] = [
            ...topCategories.map((cat, index) => ({
              name: cat.categoryName,
              value: totalServices > 0 ? Number(((cat.noOfServices / totalServices) * 100).toFixed(1)) : 0,
              color: COLORS[index % COLORS.length],
            })),
            ...(otherServices > 0
              ? [
                  {
                    name: 'Others',
                    value: totalServices > 0 ? Number((otherServices / totalServices * 100).toFixed(1)) : 0,
                    color: COLORS[4],
                  },
                ]
              : []),
          ];
          setCategoryData(formattedCategories);
        } else {
          setError('Failed to fetch category data');
        }
      } catch (error) {
        setError('Error fetching category data');
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Service Categories</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {categoryData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-slate-600">{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-slate-800">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCategories;