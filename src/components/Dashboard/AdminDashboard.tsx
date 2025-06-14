import React from 'react';
import { 
  BookOpen, 
  Users, 
  FolderOpen, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';

interface AdminDashboardProps {
  onViewChange: (view: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewChange }) => {
  const { stats, getOverdueRecords, books, borrowRecords } = useLibrary();
  const overdueRecords = getOverdueRecords();

  const statsCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: BookOpen,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'from-orange-50 to-amber-50',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      change: '+2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Borrowed Books',
      value: stats.totalBorrowedBooks,
      icon: TrendingUp,
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-50 to-teal-50',
      change: '-5%',
      changeType: 'negative' as const,
    },
  ];

  const quickActions = [
    {
      title: 'Add New Book',
      description: 'Add books to the library collection',
      icon: BookOpen,
      color: 'from-orange-500 to-amber-500',
      action: () => onViewChange('books'),
    },
    {
      title: 'Manage Categories',
      description: 'Organize books by categories',
      icon: FolderOpen,
      color: 'from-green-500 to-emerald-500',
      action: () => onViewChange('categories'),
    },
    {
      title: 'View Users',
      description: 'Manage library members',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      action: () => onViewChange('users'),
    },
    {
      title: 'Check Overdue',
      description: 'View overdue book returns',
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-500',
      action: () => onViewChange('overdue'),
    },
  ];

  const recentActivity = borrowRecords.slice(-5).reverse();

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-orange-50/30 to-green-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent flex items-center space-x-3">
            <span>Admin Dashboard</span>
            <Sparkles className="h-8 w-8 text-orange-500 animate-pulse" />
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Welcome back! Here's what's happening in your library.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => onViewChange('books')}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-green-500 text-white px-6 py-3 rounded-2xl hover:from-orange-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span className="font-semibold">Add Book</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className={`bg-gradient-to-br ${stat.bgColor} rounded-3xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {stat.changeType === 'positive' ? (
                    <ArrowUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-semibold ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600">vs last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      {overdueRecords.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-2xl">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-800 text-lg">Attention Required</h3>
              <p className="text-red-700">
                You have {overdueRecords.length} overdue book{overdueRecords.length > 1 ? 's' : ''} that need immediate attention.
              </p>
            </div>
            <button
              onClick={() => onViewChange('overdue')}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-2xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <span>Quick Actions</span>
            <Sparkles className="h-5 w-5 text-orange-500" />
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="p-6 text-left border-2 border-gray-200 rounded-2xl hover:border-orange-300 hover:shadow-lg transition-all duration-300 group transform hover:scale-105 bg-gradient-to-br from-white to-gray-50"
                >
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${action.color} w-fit mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{action.title}</h3>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <span>Recent Activity</span>
            <Clock className="h-5 w-5 text-green-500" />
          </h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((record, index) => {
                const book = books.find(b => b.id === record.bookId);
                const isOverdue = new Date(record.dueDate) < new Date() && record.status === 'borrowed';
                
                return (
                  <div 
                    key={record.id} 
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`p-3 rounded-2xl ${
                      record.status === 'returned' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : isOverdue 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                        : 'bg-gradient-to-r from-orange-500 to-amber-500'
                    } shadow-lg`}>
                      {record.status === 'returned' ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : isOverdue ? (
                        <AlertTriangle className="h-5 w-5 text-white" />
                      ) : (
                        <Clock className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {book?.title || 'Unknown Book'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {record.status === 'returned' ? 'Returned' : isOverdue ? 'Overdue' : 'Borrowed'} • 
                        {new Date(record.borrowDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 italic">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;