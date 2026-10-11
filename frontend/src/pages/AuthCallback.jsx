import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/endpoints';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthCallback = () => {
  const [params] = useSearchParams();
  const { handleOAuthCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const token = params.get('token');
      const refresh = params.get('refresh');

      if (token) {
        try {
          localStorage.setItem('accessToken', token);
          if (refresh) localStorage.setItem('refreshToken', refresh);

          const { data } = await authAPI.getMe();
          handleOAuthCallback(data.data, token, refresh);
          navigate(data.data.role === 'admin' ? '/dashboard' : '/pos', { replace: true });
        } catch {
          navigate('/login', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    };
    init();
  }, [params, handleOAuthCallback, navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
};

export default AuthCallback;
