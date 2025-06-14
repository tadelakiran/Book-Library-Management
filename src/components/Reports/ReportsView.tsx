import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, BookOpen, Calendar, Download } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';

const ReportsView: React.FC = () => {
  const { books, users, borrowRecords, categories } = useLibrary();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Calculate statistics
  const totalBorrows = borrowRecords.length;
  const activeBorrows = borrowRecords.filter(r => r.status === 'borrowed').length;
  const overdueBooks = borrowRecords.filter(r => r.status === 'borrowed' && new Date(r.dueDate) < new Date()).length;
  const returnedBooks = borrowRecords.filter(r => r.status === 'returned').length;

  // Category statistics
  const categoryStats = categories.map(category => {
    const categoryBooks = books.filter(book => book.categoryId === category.id);
    const categoryBorrows = borrowRecords.filter(record => {
      const book = books.find(b => b.id === record.bookId);
      return book?.categoryId === category.id;
    });
    
    return {
      name: category.name,
      totalBooks: categoryBooks.length,
      totalBorrows: categoryBorrows.length,
      availableBooks: categoryBooks.reduce((sum, book) => sum + book.availableCopies, 0),
    };
  });

  // Most popular books
  const bookPopularity = books.map(book => {
    const borrowCount = borrowRecords.filter(record => record.bookId === book.id).length;
    return { ...book, borrowCount };
  }).sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 5);

  // User activity
  const userActivity = users.map(user => {
    const userBorrows = borrowRecords.filter(record => record.userId === user.id);
    const activeBooks = userBorrows.filter(record => record.status === 'borrowed').length;
    const overdueBooks = userBorrows.filter(record => 
      record.status === 'borrowed' && new Date(record.dueDate) < new Date()
    ).length;
    
    return {
      ...user,
      totalBorrows: userBorrows.length,
      activeBooks,
      overdueBooks,
    };
  }).sort((a, b) => b.totalBorrows - a.totalBorrows);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive library statistics and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Borrows</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalBorrows}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Borrows</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeBorrows}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-100">
              <BookOpen className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Books</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{overdueBooks}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Return Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalBorrows > 0 ? Math.round((returnedBooks / totalBorrows) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Statistics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Statistics</h2>
          <div className="space-y-4">
            {categoryStats.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.totalBooks} books • {category.availableBooks} available</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{category.totalBorrows}</p>
                  <p className="text-xs text-gray-500">borrows</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Books */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Popular Books</h2>
          <div className="space-y-4">
            {bookPopularity.map((book, index) => (
              <div key={book.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 truncate">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-600">{book.borrowCount}</p>
                  <p className="text-xs text-gray-500">borrows</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Total Borrows</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Active Books</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Overdue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userActivity.slice(0, 10).map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{user.totalBorrows}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{user.activeBooks}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${
                        user.overdueBooks > 0 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {user.overdueBooks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;