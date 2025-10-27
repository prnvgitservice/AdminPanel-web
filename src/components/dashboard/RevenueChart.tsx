// components/RevenueChart.tsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { MonthlyBookingsResponse, MonthlyData } from '../../pages/Dashboard';
import { getMonthlyBookingsDashboard } from '../../api/apiMethods';

const RevenueChart: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [revenueGrowth, setRevenueGrowth] = useState<string>('0%');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const calculateGrowth = (current: number, previous: number): string => {
    if (previous === 0) {
      return current > 0 ? '∞%' : '0%';
    }
    const growth = ((current - previous) / previous) * 100;
    return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const year = new Date().getUTCFullYear();
        const monthlyResponse = await getMonthlyBookingsDashboard(year) as MonthlyBookingsResponse;
        if (monthlyResponse.success) {
          const formattedMonthlyData: MonthlyData[] = monthlyResponse.result.monthlyEarnings.map(
            (month) => ({
              month: month.monthName.slice(0, 3),
              users: 0,
              revenue: month.totalEarnings,
              bookings: month.bookingCount,
            })
          );

          const currentMonth = new Date().getMonth() + 1;
          const currentMonthData = monthlyResponse.result.monthlyEarnings.find(
            (month) => month.month === currentMonth
          );
          const previousMonthData = monthlyResponse.result.monthlyEarnings.find(
            (month) => month.month === currentMonth - 1
          );

          const revenueGrowth = calculateGrowth(
            currentMonthData?.totalEarnings || 0,
            previousMonthData?.totalEarnings || 0
          );

          setMonthlyData(formattedMonthlyData);
          setRevenueGrowth(revenueGrowth);
        } else {
          setError('Failed to fetch revenue data');
        }
      } catch (error) {
        setError('Error fetching revenue data');
        console.error('Error fetching revenue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading revenue chart...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Revenue Trend</h2>
        <div className="flex items-center text-emerald-600 text-sm font-semibold">
          <TrendingUp className="h-4 w-4 mr-1" />
          {revenueGrowth} this month
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="url(#revenueGradient)"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
          />
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;