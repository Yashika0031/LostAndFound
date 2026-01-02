import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch items when search term changes
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/api/items${searchTerm ? `?search=${searchTerm}` : ''}`);
        setItems(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch items');
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };

    // Add debounce to prevent too many API calls
    const timeoutId = setTimeout(() => {
      fetchItems();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-navy text-white rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Lost Something? Found Something?
        </h1>
        <p className="text-lg mb-6">
          Connect with people to find your lost items or help others find theirs.
        </p>
        <div className="flex gap-4">
          <Link to="/items?category=Lost" className="btn-primary">
            View Lost Items
          </Link>
          <Link to="/items?category=Found" className="btn-secondary">
            View Found Items
          </Link>
        </div>
      </div>

      {/* User Dashboard Section - Only shown when logged in */}
      {user && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                <span className="text-xl text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy">Welcome back, {user.name}!</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/myitems" className="btn-secondary text-sm flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Items
              </Link>
              <Link to="/items/new" className="btn-primary text-sm flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Post New Item
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for items..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card bg-deepBlue text-white">
          <h3 className="text-xl font-semibold mb-2">Lost an Item?</h3>
          <p className="mb-4">Post details of your lost item and find it quickly.</p>
          <Link to="/items/new?category=Lost" className="btn-primary">
            Report Lost Item
          </Link>
        </div>
        <div className="card bg-navy text-white">
          <h3 className="text-xl font-semibold mb-2">Found Something?</h3>
          <p className="mb-4">Help others by posting items you've found.</p>
          <Link to="/items/new?category=Found" className="btn-primary">
            Report Found Item
          </Link>
        </div>
        <div className="card bg-midnight text-white">
          <h3 className="text-xl font-semibold mb-2">Browse Listings</h3>
          <p className="mb-4">View all lost and found items in your area.</p>
          <Link to="/items" className="btn-primary">
            View All Items
          </Link>
        </div>
      </div>

      {/* Items List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy mb-4">
          {searchTerm ? `Search Results for "${searchTerm}"` : 'Recent Listings'}
        </h2>
        
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.length > 0 ? (
              items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-4">
                {searchTerm ? 'No items found matching your search' : 'No items available'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;