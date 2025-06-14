import React, { useState } from 'react';
import { Eye, EyeOff, BookOpen, Mail, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  const fillDemoCredentials = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setEmail('admin@library.com');
    } else {
      setEmail('john@email.com');
    }
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full opacity-10 animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20 transform transition-all duration-500 hover:scale-105">
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-green-500 p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-green-600/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl transform transition-all duration-300 hover:rotate-12">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <Sparkles className="h-6 w-6 text-white/80 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-white text-center mb-2">Welcome Back</h2>
            <p className="text-white/90 text-center">Sign in to your library account</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="transform transition-all duration-300 hover:scale-105">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="transform transition-all duration-300 hover:scale-105">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-shake">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:transform-none relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? 'Signing In...' : 'Sign In'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4 font-medium">Demo Accounts</p>
            <div className="flex space-x-3">
              <button
                onClick={() => fillDemoCredentials('admin')}
                className="flex-1 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 py-3 px-4 rounded-xl text-sm font-semibold hover:from-emerald-100 hover:to-green-100 transition-all duration-300 transform hover:scale-105 border border-emerald-200"
              >
                Admin Demo
              </button>
              <button
                onClick={() => fillDemoCredentials('user')}
                className="flex-1 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 py-3 px-4 rounded-xl text-sm font-semibold hover:from-orange-100 hover:to-amber-100 transition-all duration-300 transform hover:scale-105 border border-orange-200"
              >
                User Demo
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                onClick={onToggleForm}
                className="text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-all duration-300"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;