import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Register: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login?tab=register', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};
