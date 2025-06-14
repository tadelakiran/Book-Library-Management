import React from 'react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Search,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { useAuth } from '../../contexts/AuthContext';

interface UserDashboardProps {
  onViewChange: (view: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onViewChange }) => {
  const { books, borrowRecords, getUserBorrowRecords } = useLibrary();
  const { user } = useAuth();
  
  const userRecords = user ? getUserBorrowRecords(user.id) : [];
  const activeBorrows = userRecords.filter(record => record.status === 'borrowed');
  const overdueBooks = activeBorrows.filter(record => new Date(record.dueDate) < new Date());
  const recentReturns = userRecords.filter(record => record.status === 'returned').slice(-3);

  const stats = [
    {
      title: 'Books Borrowed',
      value: activeBorrows.length,
      icon: BookOpen,
      color: 'blue',
      action: () => onViewChange('my-books'),
    },
    {
      title: 'Overdue Books',
      value: overdueBooks.length,
      icon: AlertTriangle,
      color: 'red',
      action: () => onViewChange('my-books'),
    },
    {
      title: 'Books Returned',
      value: recentReturns.length,
      icon: CheckCircle,
      color: 'emerald',
      action: () => onViewChange('my-books'),
    },
    {
      title: 'Available Books',
      value: books.filter(book => book.availableCopies > 0).length,
      icon: TrendingUp,
      color: 'purple',
      action: () => onViewChange('browse'),
    },
  ];

  const popularBooks = books
    .filter(book => book.availableCopies > 0)
    .slice(0, 4);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Discover your next great read.</p>
        </div>
        <button
          onClick={() => onViewChange('browse')}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Search className="h-4 w-4" />
          <span>Browse Books</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <button
              key={index}
              onClick={stat.action}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100 group-hover:bg-${stat.color}-200 transition-colors`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Overdue Alert */}
      {overdueBooks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-medium text-red-800">Overdue Books</h3>
              <p className="text-red-700 text-sm">
                You have {overdueBooks.length} overdue book{overdueBooks.length > 1 ? 's' : ''}. Please return them as soon as possible.
              </p>
            </div>
            <button
              onClick={() => onViewChange('my-books')}
              className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currently Borrowed */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Currently Borrowed</h2>
            <button
              onClick={() => onViewChange('my-books')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {activeBorrows.length > 0 ? (
              activeBorrows.slice(0, 3).map((record) => {
                const book = books.find(b => b.id === record.bookId);
                const isOverdue = new Date(record.dueDate) < new Date();
                const daysUntilDue = Math.ceil(
                  (new Date(record.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                
                return (
                  <div key={record.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                      {book?.coverUrl && (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {book?.title || 'Unknown Book'}
                      </h3>
                      <p className="text-sm text-gray-600">{book?.author}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={`text-sm ${
                          isOverdue ? 'text-red-600 font-medium' : 
                          daysUntilDue <= 3 ? 'text-orange-600 font-medium' : 
                          'text-gray-600'
                        }`}>
                          {isOverdue 
                            ? `Overdue by ${Math.abs(daysUntilDue)} days`
                            : daysUntilDue <= 0 
                            ? 'Due today'
                            : `Due in ${daysUntilDue} days`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No books currently borrowed</p>
                <button
                  onClick={() => onViewChange('browse')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                >
                  Browse available books
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Popular Books */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Popular Books</h2>
            <button
              onClick={() => onViewChange('browse')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Browse All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {popularBooks.map((book) => (
              <div key={book.id} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-3">
                  {book.coverUrl && (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                </div>
                <h3 className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600 truncate">{book.author}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-emerald-600 font-medium">
                    {book.availableCopies} available
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;