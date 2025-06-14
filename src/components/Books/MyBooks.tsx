import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, AlertTriangle, RotateCcw, BookOpen } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { useAuth } from '../../contexts/AuthContext';

const MyBooks: React.FC = () => {
  const { books, getUserBorrowRecords, returnBook, renewBook } = useLibrary();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'borrowed' | 'history'>('borrowed');

  const userRecords = user ? getUserBorrowRecords(user.id) : [];
  const borrowedBooks = userRecords.filter(record => record.status === 'borrowed');
  const returnedBooks = userRecords.filter(record => record.status === 'returned');

  const handleReturn = (recordId: string) => {
    if (window.confirm('Are you sure you want to return this book?')) {
      returnBook(recordId);
    }
  };

  const handleRenew = (recordId: string) => {
    if (renewBook(recordId)) {
      alert('Book renewed successfully!');
    } else {
      alert('Unable to renew book. Maximum renewals reached or book is overdue.');
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    return Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
          <p className="text-gray-600 mt-1">Manage your borrowed books and view history</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Currently Borrowed</p>
          <p className="text-2xl font-bold text-blue-600">{borrowedBooks.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Overdue</p>
          <p className="text-2xl font-bold text-red-600">
            {borrowedBooks.filter(record => isOverdue(record.dueDate)).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Due Soon</p>
          <p className="text-2xl font-bold text-orange-600">
            {borrowedBooks.filter(record => {
              const days = getDaysUntilDue(record.dueDate);
              return days <= 3 && days >= 0;
            }).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Total Borrowed</p>
          <p className="text-2xl font-bold text-emerald-600">{userRecords.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('borrowed')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'borrowed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Currently Borrowed ({borrowedBooks.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              History ({returnedBooks.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'borrowed' ? (
            borrowedBooks.length > 0 ? (
              <div className="space-y-4">
                {borrowedBooks.map((record) => {
                  const book = books.find(b => b.id === record.bookId);
                  const daysUntilDue = getDaysUntilDue(record.dueDate);
                  const overdue = isOverdue(record.dueDate);
                  
                  return (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4">
                          <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            {book?.coverUrl && (
                              <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {book?.title || 'Unknown Book'}
                            </h3>
                            <p className="text-gray-600 mb-2">{book?.author}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Borrowed: {new Date(record.borrowDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span className={overdue ? 'text-red-600 font-medium' : daysUntilDue <= 3 ? 'text-orange-600 font-medium' : ''}>
                                  {overdue 
                                    ? `Overdue by ${Math.abs(daysUntilDue)} days`
                                    : daysUntilDue <= 0 
                                    ? 'Due today'
                                    : `Due in ${daysUntilDue} days`
                                  }
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <RotateCcw className="h-4 w-4" />
                                <span>Renewals: {record.renewalCount}/2</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {record.renewalCount < 2 && !overdue && (
                            <button
                              onClick={() => handleRenew(record.id)}
                              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                            >
                              Renew
                            </button>
                          )}
                          <button
                            onClick={() => handleReturn(record.id)}
                            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
                          >
                            Return
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No borrowed books</h3>
                <p className="text-gray-500">You haven't borrowed any books yet.</p>
              </div>
            )
          ) : (
            returnedBooks.length > 0 ? (
              <div className="space-y-4">
                {returnedBooks.map((record) => {
                  const book = books.find(b => b.id === record.bookId);
                  
                  return (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {book?.coverUrl && (
                            <img
                              src={book.coverUrl}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {book?.title || 'Unknown Book'}
                          </h3>
                          <p className="text-gray-600 mb-2">{book?.author}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Borrowed: {new Date(record.borrowDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span>Returned: {record.returnDate ? new Date(record.returnDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RotateCcw className="h-4 w-4" />
                              <span>Renewals: {record.renewalCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No history</h3>
                <p className="text-gray-500">You haven't returned any books yet.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBooks;