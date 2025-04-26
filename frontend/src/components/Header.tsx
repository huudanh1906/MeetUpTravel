import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

interface HeaderProps {
    onLogoClick?: () => void;
    onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const query = searchQuery.trim();
            if (onSearch) {
                onSearch(query);
            }
            navigate(`/?query=${encodeURIComponent(query)}`);
        }
    };

    return (
        <header className="bg-white shadow-sm py-4">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center" onClick={onLogoClick}>
                    <img
                        src="https://meetup.travel/assets/images/logo.png"
                        alt="Meetup Travel Logo"
                        className="h-10"
                    />
                </Link>

                {/* Search bar */}
                <div className="flex-1 max-w-lg mx-6">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        {FaSearch({ className: "absolute left-4 text-gray-400" })}
                        <input
                            type="text"
                            placeholder="Where do you want to go"
                            className="w-full py-2 pl-10 pr-10 border bg-gray-100 focus:outline-none rounded-xl focus:ring-1 focus:ring-primary text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-2 bg-teal-500 text-white p-1 rounded-lg hover:bg-teal-600 transition"
                        >
                            <FaSearch className="mx-1" />
                        </button>
                    </form>
                </div>

                {/* Navigation - For mobile this would be a menu button */}
                <nav className="hidden md:block">
                    <ul className="flex space-x-6">

                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header; 