import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    HomeIcon,
    GlobeAltIcon,
    CalendarIcon,
    UsersIcon,
    Bars3Icon,
    XMarkIcon,
    TagIcon,
    ShoppingBagIcon
} from '@heroicons/react/24/outline';

function Layout() {
    const { currentUser, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: HomeIcon },
        { name: 'Tours', href: '/tours', icon: GlobeAltIcon },
        { name: 'Categories', href: '/categories', icon: TagIcon },
        { name: 'Bookings', href: '/bookings', icon: CalendarIcon },
        { name: 'Users', href: '/users', icon: UsersIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? 'visible' : 'invisible'}`} role="dialog" aria-modal="true">
                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-in-out duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                    aria-hidden="true"
                    onClick={() => setSidebarOpen(false)}
                ></div>

                {/* Sidebar panel */}
                <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transition ease-in-out duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="sr-only">Close sidebar</span>
                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                        <div className="flex-shrink-0 flex items-center px-4">
                            <h1 className="text-2xl font-bold text-primary-600">Meetup Travel</h1>
                        </div>
                        <nav className="mt-5 px-2 space-y-1">
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) =>
                                        `group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive
                                            ? 'bg-primary-100 text-primary-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <item.icon
                                        className={`mr-4 flex-shrink-0 h-6 w-6 text-primary-500`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <h1 className="text-2xl font-bold text-primary-600">Meetup Travel</h1>
                        </div>
                        <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) =>
                                        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                                            ? 'bg-primary-100 text-primary-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <item.icon
                                        className="mr-3 flex-shrink-0 h-6 w-6 text-primary-500"
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="md:pl-64 flex flex-col flex-1">
                <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white">
                    <button
                        type="button"
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout; 