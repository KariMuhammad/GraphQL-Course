import { verifyToken, getTokenFromHeader } from './auth.js';
import UserDataSource from '../DataSources/UserDataSource.js';
import TodoDataSource from '../DataSources/TodoDataSource.js';

// Instantiate DataSources
const userDataSources = {
  users: new UserDataSource(),
  todos: new TodoDataSource()
};


// Create context with authentication
const createContext = async ({ req }) => {
  let user = null;
  let isAuthenticated = false;

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = getTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        user = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role
        };
        isAuthenticated = true;
      }
    }
  } catch (error) {
    console.error('Context error:', error.message);
  }

  return {
    user,
    isAuthenticated,
    req,
    dataSources: userDataSources
  };
};

// Authorization helper - check if user is authenticated
const requireAuth = (context) => {
  if (!context.isAuthenticated || !context.user) {
    throw new Error('Authentication required');
  }
  return context.user;
};

// Authorization helper - check if user has specific role
const requireRole = (context, requiredRole) => {
  const user = requireAuth(context);
  
  if (user.role !== requiredRole && user.role !== 'admin') {
    throw new Error(`User role must be ${requiredRole}`);
  }
  
  return user;
};

export {
  createContext,
  requireAuth,
  requireRole
};
