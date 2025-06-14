import React from 'react';
import { AlertTriangle, Calendar, User, Mail, Phone } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';

const OverdueBooks: React.FC = () => {
  const { books, users, getOverdueRecords } = useLibrary();
  const overdueRecords = getOverdueRecords();

  const getDaysOverdue = (dueDate: string) => {
    return Math.ceil((new Date().getTime() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overdue Books</h1>
          <p className="text-gray-600 mt-1">Track and manage overdue book returns</p>
        </div>
      </div>

      {/* Alert Summary */}
      {overdueRecords.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Attention Required</h3>
              <p className="text-red-700">
                There are {overdueRecords.length} overdue book{overdueRecords.length > 1 ? 's' : ''} that need immediate attention.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Total Overdue</p>
          <p className="text-2xl font-bold text-red-600">{overdueRecords.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Avg Days Overdue</p>
          <p className="text-2xl font-bold text-orange-600">
            {overdueRecords.length > 0 
              ? Math.round(overdueRecords.reduce((sum, record) => sum + getDaysOverdue(record.dueDate), 0) / overdueRecords.length)
              : 0
            }
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Unique Users</p>
          <p className="text-2xl font-bold text-purple-600">
            {new Set(overdueRecords.map(record => record.userId)).size}
          </p>
        </div>
      </div>

      {/* Overdue Books List */}
      {overdueRecords.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Book</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Borrower</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Days Overdue</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Renewals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {overdueRecords.map((record) => {
                  const book = books.find(b => b.id === record.bookId);
                  const user = users.find(u => u.id === record.userId);
                  const daysOverdue = getDaysOverdue(record.dueDate);
                  
                  return (
                    <tr key={record.id} className="hover:bg-red-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            {book?.coverUrl && (
                              <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{book?.title || 'Unknown Book'}</p>
                            <p className="text-sm text-gray-600">{book?.author}</p>
                            <p className="text-xs text-gray-500">ISBN: {book?.isbn}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-red-100 p-2 rounded-full">
                            <User className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user?.name || 'Unknown User'}</p>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              <span>{user?.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-900">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(record.dueDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          daysOverdue <= 7 
                            ? 'bg-orange-100 text-orange-800'
                            : daysOverdue <= 14
                            ? 'bg-red-100 text-red-800'
                            : 'bg-red-200 text-red-900'
                        }`}>
                          {daysOverdue} days
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{record.renewalCount}/2</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-emerald-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No overdue books</h3>
            <p className="text-gray-500">
              Great! All borrowed books are returned on time or still within the due date.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverdueBooks;