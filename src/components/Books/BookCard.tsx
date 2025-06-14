import React from 'react';
import { Book as BookType } from '../../types';
import { BookOpen, User, Calendar, CheckCircle } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { useAuth } from '../../contexts/AuthContext';

interface BookCardProps {
  book: BookType;
  onEdit?: (book: BookType) => void;
  onDelete?: (bookId: string) => void;
  onBorrow?: (bookId: string) => void;
  showActions?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onEdit, 
  onDelete, 
  onBorrow, 
  showActions = true 
}) => {
  const { categories } = useLibrary();
  const { user } = useAuth();
  
  const category = categories.find(c => c.id === book.categoryId);
  const canBorrow = book.availableCopies > 0 && user?.role === 'user';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
      <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <BookOpen className="h-16 w-16 text-blue-300" />
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            book.availableCopies > 0
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {book.availableCopies > 0 ? 'Available' : 'Not Available'}
          </span>
        </div>

        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {category.name}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{book.author}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <BookOpen className="h-4 w-4" />
            <span>ISBN: {book.isbn}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4" />
            <span>{book.availableCopies} of {book.totalCopies} available</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Added {new Date(book.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {book.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {book.description}
          </p>
        )}

        {showActions && (
          <div className="flex space-x-2">
            {canBorrow && onBorrow && (
              <button
                onClick={() => onBorrow(book.id)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Borrow Book
              </button>
            )}
            
            {isAdmin && (
              <>
                {onEdit && (
                  <button
                    onClick={() => onEdit(book)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(book.id)}
                    className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;