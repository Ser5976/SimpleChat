import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

const RequireAuth: React.FC<any> = ({ children }) => {
  const { isAuth } = useAppSelector((state) => state.authReducer);

  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default RequireAuth;
