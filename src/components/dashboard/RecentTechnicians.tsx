// components/RecentTechnicians.tsx
import React, { useState, useEffect } from 'react';
import { RecentTechniciansResponse, TechnicianResponse } from '../../pages/Dashboard';
import { getRecentTechnicianDashboard } from '../../api/apiMethods';

const RecentTechnicians: React.FC = () => {
  const [recentTechnicians, setRecentTechnicians] = useState<TechnicianResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const techniciansResponse = await getRecentTechnicianDashboard({}) as RecentTechniciansResponse;
        if (techniciansResponse.success) {
          const formattedTechnicians: TechnicianResponse[] = techniciansResponse.result.techDetails.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentTechnicians(formattedTechnicians);
        } else {
          setError('Failed to fetch technicians');
        }
      } catch (error) {
        setError('Error fetching technicians');
        console.error('Error fetching technicians:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading technicians...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Recent Technicians</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Technician
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {recentTechnicians.map((technician) => (
              <tr key={technician.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {technician.profileImage ? (
                      <img src={technician.profileImage} alt={technician.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-sm font-medium text-white">{technician.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">{technician.name}</div>
                      <div className="text-sm text-slate-500">
                        {new Date(technician.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{technician.categoryName || technician.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      technician.status === 'registered'
                        ? 'bg-green-100 text-green-800'
                        : technician.status === 'requested'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {technician.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTechnicians;