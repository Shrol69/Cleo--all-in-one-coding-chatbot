import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';
import PostMessage from './components/PostMessage';
import Login from './components/Login';
import Signup from './components/Signup';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/" />;
};

function App() {
  const [user, setUser] = useState(undefined); // Start with undefined to prevent early redirects
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  useEffect(() => {
    if (user === undefined) return; // Prevents early redirect
    if (user && location.pathname !== '/messages') {
      navigate('/messages');
    } else if (!user && location.pathname !== '/signup') {
      navigate('/');
    }
  }, [user, navigate, location]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      <header className="w-full bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-3xl font-bold text-center">My Chat Club</h1>
      </header>

      <main className="flex flex-col items-center w-full mt-8">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/messages"
            element={
              <ProtectedRoute user={user}>
                <PostMessage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
