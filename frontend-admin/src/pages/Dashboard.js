import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { toursApi, bookingsApi, usersApi } from '../services/api';

// Register Chart.js components
Chart.register(...registerables);

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`rounded-md p-3 ${color}`}>
                            {icon}
                        </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd>
                                <div className="text-lg font-medium text-gray-900">{value}</div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Dashboard() {
    const currentYear = new Date().getFullYear();
    const [stats, setStats] = useState({
        totalTours: 0,
        totalBookings: 0,
        totalUsers: 0,
        totalRevenue: 0,
        monthlyBookings: {
            labels: [],
            data: []
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingRealData, setUsingRealData] = useState(false);
    const [year, setYear] = useState(currentYear);

    // Generate list of years for dropdown (current year and 3 years back)
    const availableYears = [];
    for (let i = 0; i < 4; i++) {
        availableYears.push(currentYear - i);
    }

    // Generate mock data for monthly bookings as fallback
    const generateMonthlyBookingData = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Generate random booking counts for demonstration
        const data = months.map(() => Math.floor(Math.random() * 20) + 1);

        return {
            labels: months,
            data: data
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch basic stats
                const [toursData, bookingsData, usersData] = await Promise.all([
                    toursApi.getAll(0, 100),
                    bookingsApi.getAll(0, 100),
                    usersApi.getAll(0, 100)
                ]);

                // Try to get real monthly booking stats
                let monthlyBookings;
                let totalRevenue = 0;
                try {
                    const monthlyStats = await bookingsApi.getYearlyStats(year);
                    // If we get a response with data and labels, use it
                    if (monthlyStats && monthlyStats.labels && monthlyStats.data) {
                        monthlyBookings = {
                            labels: monthlyStats.labels,
                            data: monthlyStats.data
                        };
                        totalRevenue = monthlyStats.totalRevenue || 0;
                        setUsingRealData(true);
                    } else {
                        // Fall back to generated data
                        monthlyBookings = generateMonthlyBookingData();
                        setUsingRealData(false);
                    }
                } catch (statsError) {
                    console.error('Error fetching monthly stats:', statsError);
                    // Fall back to generated data
                    monthlyBookings = generateMonthlyBookingData();
                    setUsingRealData(false);
                }

                setStats({
                    totalTours: toursData.totalElements || toursData.content?.length || 0,
                    totalBookings: bookingsData.totalElements || bookingsData.content?.length || 0,
                    totalUsers: usersData.totalElements || usersData.content?.length || 0,
                    totalRevenue,
                    monthlyBookings
                });
            } catch (err) {
                console.error('Error fetching dashboard data', err);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [year]);

    // Chart data for monthly bookings
    const chartData = {
        labels: stats.monthlyBookings.labels,
        datasets: [
            {
                label: 'Bookings',
                data: stats.monthlyBookings.data,
                backgroundColor: 'rgba(14, 165, 233, 0.5)',
                borderColor: 'rgb(14, 165, 233)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0, // Only show whole numbers
                    stepSize: 1
                }
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Monthly Bookings (${year})`,
                font: {
                    size: 16
                }
            },
        },
    };

    const handleYearChange = (e) => {
        setYear(parseInt(e.target.value, 10));
    };

    if (loading) {
        return (
            <div className="py-6">
                <div className="text-center">Loading dashboard data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-6">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div>
            <div className="py-6">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>

            {/* Stats Grid */}
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-3">
                <StatCard
                    title="Total Tours"
                    value={stats.totalTours}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>}
                    color="bg-primary-600"
                />
                <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>}
                    color="bg-green-600"
                />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>}
                    color="bg-purple-600"
                />
            </div>

            {/* Monthly Bookings Chart */}
            <div className="mt-10">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Yearly Statistics</h2>
                        <div className="flex items-center">
                            <label htmlFor="year" className="mr-2 text-sm font-medium text-gray-700">Year:</label>
                            <select
                                id="year"
                                value={year}
                                onChange={handleYearChange}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            >
                                {availableYears.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Yearly Revenue Card */}
                    <div className="mb-6">
                        <StatCard
                            title={`Total Revenue (${year})`}
                            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.totalRevenue)}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>}
                            color="bg-yellow-600"
                        />
                    </div>

                    <Bar data={chartData} options={chartOptions} />

                    <div className="mt-4 text-center text-sm text-gray-500">
                        {!usingRealData && "* Demo data for illustration purposes"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard; 