import React from 'react';
import { LogOut, Bell, User, BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLibrary } from '../../contexts/LibraryContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { getOverdueRecords } = useLibrary();
  
  const overdueCount = getOverdueRecords().length;

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-orange-200/50 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-orange-500 to-green-500 p-3 rounded-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-12">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              Library Management
            </h1>
            <p className="text-sm text-gray-600 flex items-center space-x-1">
              <Sparkles className="h-3 w-3 text-orange-500" />
              <span>Digital Book Management System</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user?.role === 'admin' && overdueCount > 0 && (
            <div className="relative transform transition-all duration-300 hover:scale-110">
              <Bell className="h-6 w-6 text-gray-600 hover:text-orange-600 cursor-pointer transition-colors duration-300" />
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {overdueCount}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-3 bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl px-4 py-3 border border-orange-200/50 transform transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-r from-orange-500 to-green-500 p-2 rounded-xl">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-gray-600 capitalize flex items-center space-x-1">
                <span>{user?.role}</span>
                {user?.role === 'admin' && <Sparkles className="h-3 w-3 text-orange-500" />}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-red-200/50 hover:border-red-300"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;