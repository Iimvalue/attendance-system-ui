import { useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated } from '../services/authService';
import { useNavigate } from 'react-router-dom';


export const useAuth = (requiredRole = null) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuth = isAuthenticated();
        setAuthenticated(isAuth);

        if (isAuth) {
          const currentUser = getCurrentUser();
          
          if (currentUser) {
            setUser(currentUser);
            
            if (requiredRole && currentUser.role !== requiredRole) {
              navigate('/unauthorized');
              return;
            }
          } else {
            setAuthenticated(false);
            setUser(null);
            navigate('/');
            return;
          }
        } else {
          setUser(null);
          if (requiredRole) {
            navigate('/');
            return;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthenticated(false);
        setUser(null);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole, navigate]);

  return {
    user,
    authenticated,
    loading,
    isAdmin: user?.role === 'admin',
    isTeacher: user?.role === 'teacher',
    isPrinciple: user?.role === 'principle',
    isStudent: user?.role === 'student',
  };
};


export const withAuth = (Component, requiredRole = null) => {
  return function AuthenticatedComponent(props) {
    const { user, authenticated, loading } = useAuth(requiredRole);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!authenticated) {
      return null; 
    }

    return <Component {...props} user={user} />;
  };
};
