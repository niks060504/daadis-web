import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { googleAuth } from '../../redux1/authSlice';
import { toast } from 'sonner';
import type { AppDispatch } from '../../redux1/store';

const GoogleCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      toast.error('Google sign-in failed');
      navigate('/');
      return;
    }
    if (!code) {
      toast.error('No code returned from Google');
      navigate('/');
      return;
    }

    dispatch(googleAuth({ code }))
      .unwrap()
      .then(() => {
        toast.success('Logged in successfully');
        navigate('/', { replace: true });
      })
      .catch(() => {
        toast.error('Google login failed');
        navigate('/');
      });
  }, [location.search, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6">
        {/* Animated Google Logo */}
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-4 animate-bounce">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
          
          {/* Pulsing ring */}
          <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-4 border-blue-200 animate-ping opacity-75"></div>
        </div>

        {/* Loading text with typing animation */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            Signing in with Google
            <span className="inline-block w-1 h-6 bg-blue-500 ml-1 animate-pulse"></span>
          </h2>
          <p className="text-gray-600">Please wait while we authenticate your account...</p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;