// components/BookingsChart.tsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { MonthlyBookingsResponse, MonthlyData } from '../../pages/Dashboard';
import { getMonthlyBookingsDashboard } from '../../api/apiMethods';

const BookingsChart: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [bookingsGrowth, setBookingsGrowth] = useState<string>('0%');
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

          const bookingsGrowth = calculateGrowth(
            currentMonthData?.bookingCount || 0,
            previousMonthData?.bookingCount || 0
          );

          setMonthlyData(formattedMonthlyData);
          setBookingsGrowth(bookingsGrowth);
        } else {
          setError('Failed to fetch bookings data');
        }
      } catch (error) {
        setError('Error fetching bookings data');
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading bookings chart...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Monthly Bookings</h2>
        <div className="flex items-center text-blue-600 text-sm font-semibold">
          <TrendingUp className="h-4 w-4 mr-1" />
          {bookingsGrowth} growth
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
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
          <Bar dataKey="bookings" fill="url(#bookingsGradient)" radius={[8, 8, 0, 0]} />
          <defs>
            <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingsChart;