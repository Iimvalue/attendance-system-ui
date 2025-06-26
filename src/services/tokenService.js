import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token) => {
  try {
    if (!token) {
      console.warn('No token provided for decoding');
      return null;
    }

    const decoded = jwtDecode(token);
    
    if (decoded.type !== 'access') {
      console.warn('Invalid token type');
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};


export const getUserFromToken = (token) => {
  try {
    const decoded = decodeToken(token);
    
    if (!decoded || !decoded.user) {
      return null;
    }

    return {
      id: decoded.user._id,
      email: decoded.user.email,
      role: decoded.user.role
    };
  } catch (error) {
    console.error('Error extracting user from token:', error);
    return null;
  }
};



export const isTokenExpired = (token) => {
  try {
    if (!token) {
      return true;
    }

    const decoded = decodeToken(token);
    
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const validateToken = (token) => {
  try {
    const decoded = decodeToken(token);
    
    if (!decoded) {
      return false;
    }

    const hasValidType = decoded.type === 'access';
    const hasValidUser = decoded.user && 
                        decoded.user._id && 
                        decoded.user.email && 
                        decoded.user.role;

    return hasValidType && hasValidUser;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};


export const getValidToken = () => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('Token');
    
    if (!token) {
      return null;
    }

    if (validateToken(token)) {
      return token;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('Token');
    localStorage.removeItem('role');
    
    return null;
  } catch (error) {
    console.error('Error getting valid token:', error);
    return null;
  }
};


export const getCurrentUser = () => {
  try {
    const token = getValidToken();
    
    if (!token) {
      return null;
    }

    return getUserFromToken(token);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
