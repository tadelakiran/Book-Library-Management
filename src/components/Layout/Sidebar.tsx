import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FolderOpen, 
  History, 
  Settings,
  TrendingUp,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { user } = useAuth();

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-orange-500 to-amber-500' },
    { id: 'books', label: 'Books', icon: BookOpen, color: 'from-green-500 to-emerald-500' },
    { id: 'categories', label: 'Categories', icon: FolderOpen, color: 'from-orange-500 to-red-500' },
    { id: 'users', label: 'Users', icon: Users, color: 'from-green-500 to-teal-500' },
    { id: 'reports', label: 'Reports', icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
    { id: 'overdue', label: 'Overdue Books', icon: AlertCircle, color: 'from-red-500 to-pink-500' },
  ];

  const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-orange-500 to-amber-500' },
    { id: 'browse', label: 'Browse Books', icon: BookOpen, color: 'from-green-500 to-emerald-500' },
    { id: 'my-books', label: 'My Books', icon: History, color: 'from-orange-500 to-red-500' },
    { id: 'profile', label: 'Profile', icon: Settings, color: 'from-green-500 to-teal-500' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <aside className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white w-72 min-h-screen p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-orange-500 to-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-green-500 to-orange-500 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-green-500 p-4 rounded-2xl w-fit mx-auto mb-4 transform transition-all duration-300 hover:scale-110 hover:rotate-12">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
            Library System
          </h2>
          <div className="flex items-center justify-center space-x-1 mt-2">
            <Sparkles className="h-3 w-3 text-orange-400" />
            <span className="text-xs text-gray-400">Digital Management</span>
            <Sparkles className="h-3 w-3 text-green-400" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500/20 to-green-500/20 text-white shadow-lg border border-orange-500/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-green-500 rounded-r-full"></div>
                )}
                
                {/* Icon with gradient background */}
                <div className={`p-2 rounded-xl bg-gradient-to-r ${item.color} ${isActive ? 'shadow-lg' : 'opacity-70 group-hover:opacity-100'} transition-all duration-300`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                
                <span className="font-semibold flex-1">{item.label}</span>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </button>
            );
          })}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-green-500 p-2 rounded-xl">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize flex items-center space-x-1">
                  <span>{user?.role}</span>
                  {user?.role === 'admin' && <Sparkles className="h-3 w-3 text-orange-400" />}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;