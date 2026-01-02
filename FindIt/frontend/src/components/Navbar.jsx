import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatNotification from './ChatNotification';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-navy shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-golden text-xl font-bold">
              FindIt
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-white hover:text-golden px-3 py-2 rounded-md">
                Home
              </Link>
              <Link to="/items?category=Lost" className="text-white hover:text-golden px-3 py-2 rounded-md">
                Lost Items
              </Link>
              <Link to="/items?category=Found" className="text-white hover:text-golden px-3 py-2 rounded-md">
                Found Items
              </Link>
              {user ? (
                <>
                  <Link to="/items/new" className="text-white hover:text-golden px-3 py-2 rounded-md">
                    Post an Item
                  </Link>
                  <Link to="/myitems" className="text-white hover:text-golden px-3 py-2 rounded-md">
                    My Listings
                  </Link>
                  <ChatNotification />
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-golden px-3 py-2 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white hover:text-golden px-3 py-2 rounded-md">
                    Login
                  </Link>
                  <Link to="/register" className="text-white hover:text-golden px-3 py-2 rounded-md">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
              aria-label="Main menu"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-white hover:text-golden block px-3 py-2 rounded-md">
              Home
            </Link>
            <Link to="/items?category=Lost" className="text-white hover:text-golden block px-3 py-2 rounded-md">
              Lost Items
            </Link>
            <Link to="/items?category=Found" className="text-white hover:text-golden block px-3 py-2 rounded-md">
              Found Items
            </Link>
            {user ? (
              <>
                <Link to="/items/new" className="text-white hover:text-golden block px-3 py-2 rounded-md">
                  Post an Item
                </Link>
                <div className="flex items-center gap-2 px-3 py-2">
                  <Link to="/myitems" className="text-white hover:text-golden">
                    My Listings
                  </Link>
                  <ChatNotification />
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-golden block w-full text-left px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-golden block px-3 py-2 rounded-md">
                  Login
                </Link>
                <Link to="/register" className="text-white hover:text-golden block px-3 py-2 rounded-md">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;