import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Navbar on Login, Register and Verify pages for an immersive experience
  if (['/login', '/register', '/verify'].includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white shadow-md">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-extrabold text-2xl tracking-wider text-teal-400">
          LumenAi
        </Link>
        {isAuthenticated && (
          <div className="flex gap-4 items-center ml-4">
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
            <Link to="/library" className="text-gray-300 hover:text-white transition-colors">Library</Link>
            <Link to="/tutor" className="text-gray-300 hover:text-white transition-colors">Tutor</Link>
            <Link to="/flashcards" className="text-gray-300 hover:text-white transition-colors">Flashcards</Link>
            <Link to="/quiz" className="text-gray-300 hover:text-white transition-colors">Quiz</Link>
            <Link to="/books" className="text-gray-300 hover:text-white transition-colors">Books</Link>
          </div>
        )}
      </div>
      <div className="flex gap-4 items-center">
        {isAuthenticated ? (
          <>
            <span className="text-gray-300 text-sm hidden md:inline">
              Welcome, <span className="font-semibold text-teal-300">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-all shadow-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white font-medium">Login</Link>
            <Link to="/register" className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-4 py-2 rounded-md transition-all shadow-sm">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
