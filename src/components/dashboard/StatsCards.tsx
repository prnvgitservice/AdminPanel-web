// components/StatsCards.tsx
import React, { useState, useEffect } from 'react';
import { Users, UserCog, Wrench, CreditCard, Building2 } from 'lucide-react';
import { getStatsDashboard } from '../../api/apiMethods';
import { Stat, StatsResponse } from '../../pages/Dashboard';

export const toKFormat = (number: number) => {
  if (typeof number !== 'number' || isNaN(number)) return 'Invalid input';
  if (Math.abs(number) < 1000) return number.toString();
  return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
};

const StatsCards: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsResponse = await getStatsDashboard({}) as StatsResponse;
        if (statsResponse.success) {
          const enrichedStats: Stat[] = statsResponse.result.map((stat) => ({
            ...stat,
            icon:
              stat.label === 'Total Categories'
                ? Wrench
                : stat.label === 'Total Technicians'
                ? UserCog
                : stat.label === 'Total Users'
                ? Users
                : stat.label === 'Total Franchise'
                ? Building2
                : CreditCard,
            color:
              stat.label === 'Total Categories'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                : stat.label === 'Total Technicians'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                : stat.label === 'Total Users'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                : stat.label === 'Total Franchise'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                : 'bg-gradient-to-r from-amber-500 to-amber-600',
          }));
          setStats(enrichedStats);
        } else {
          setError('Failed to fetch stats');
        }
      } catch (error) {
        setError('Error fetching stats');
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading stats...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 px-2 py-4 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`${stat.color} p-2 rounded-xl shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                  {stat.label === 'Revenue' ? `₹${toKFormat(stat.value)}` : ` ${toKFormat(stat.value)}`}
                </p>
                <p className="text-md text-slate-600">{stat.label}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;