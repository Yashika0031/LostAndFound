import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemList from './pages/ItemList';
import ItemDetail from './pages/ItemDetail';
import NewItem from './pages/NewItem';
import MyItems from './pages/MyItems';
import EditItem from './pages/EditItem';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/items" element={<ItemList />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route
                path="/items/new"
                element={
                  <PrivateRoute>
                    <NewItem />
                  </PrivateRoute>
                }
              />
              <Route
                path="/myitems"
                element={
                  <PrivateRoute>
                    <MyItems />
                  </PrivateRoute>
                }
              />
              <Route
                path="/items/:id/edit"
                element={
                  <PrivateRoute>
                    <EditItem />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;