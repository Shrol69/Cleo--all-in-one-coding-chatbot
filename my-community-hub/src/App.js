import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import PostMessage from './components/PostMessage';
import Login from './components/Login';
import Signup from './components/Signup'; // Correct case
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, [auth]);

  useEffect(() => {
    // Only redirect if the user is authenticated or if the user isn't but isn't on signup
    if (user) {
      if (location.pathname !== '/messages') {
        navigate('/messages'); // Redirect authenticated users to /messages
      }
    } else if (location.pathname !== '/signup') {
      navigate('/'); // Redirect non-authenticated users to login, but not if they're on signup
    }
  }, [user, navigate, location]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      <header className="w-full bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-3xl font-bold text-center">My Chat Club</h1>
      </header>

      <main className="flex flex-col items-center w-full mt-8">
        <Routes>
          <Route path="/" element={<Login />} /> {/* Login route */}
          <Route path="/signup" element={<Signup />} /> {/* Signup route */}
          <Route
            path="/messages"
            element={
              user ? (
                <>
                  <PostMessage /> {/* Post message component */}
                </>
              ) : (
                <Login /> // Redirect to login if not logged in
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
