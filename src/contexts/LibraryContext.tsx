import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, Category, BorrowRecord, LibraryState, LibraryStats } from '../types';
import { getStoredData, setStoredData } from '../utils/storage';
import { initializeSampleData } from '../utils/sampleData';

interface LibraryContextType extends LibraryState {
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  borrowBook: (bookId: string, userId: string) => boolean;
  returnBook: (recordId: string) => void;
  renewBook: (recordId: string) => boolean;
  getUserBorrowRecords: (userId: string) => BorrowRecord[];
  getOverdueRecords: () => BorrowRecord[];
  refreshStats: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

interface LibraryProviderProps {
  children: ReactNode;
}

export const LibraryProvider: React.FC<LibraryProviderProps> = ({ children }) => {
  const [state, setState] = useState<LibraryState>({
    books: [],
    categories: [],
    users: [],
    borrowRecords: [],
    stats: {
      totalBooks: 0,
      totalCategories: 0,
      totalUsers: 0,
      totalBorrowedBooks: 0,
      overdueBooks: 0,
      availableBooks: 0,
    },
  });

  useEffect(() => {
    initializeSampleData();
    loadData();
  }, []);

  const loadData = () => {
    const books = getStoredData<Book[]>('books') || [];
    const categories = getStoredData<Category[]>('categories') || [];
    const users = getStoredData('users') || [];
    const borrowRecords = getStoredData<BorrowRecord[]>('borrowRecords') || [];

    setState({
      books,
      categories,
      users,
      borrowRecords,
      stats: calculateStats(books, categories, users, borrowRecords),
    });
  };

  const calculateStats = (books: Book[], categories: Category[], users: any[], borrowRecords: BorrowRecord[]): LibraryStats => {
    const activeBorrows = borrowRecords.filter(r => r.status === 'borrowed');
    const overdue = borrowRecords.filter(r => r.status === 'overdue' || (r.status === 'borrowed' && new Date(r.dueDate) < new Date()));
    
    return {
      totalBooks: books.reduce((sum, book) => sum + book.totalCopies, 0),
      totalCategories: categories.length,
      totalUsers: users.length,
      totalBorrowedBooks: activeBorrows.length,
      overdueBooks: overdue.length,
      availableBooks: books.reduce((sum, book) => sum + book.availableCopies, 0),
    };
  };

  const addBook = (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedBooks = [...state.books, newBook];
    setStoredData('books', updatedBooks);
    setState(prev => ({
      ...prev,
      books: updatedBooks,
      stats: calculateStats(updatedBooks, prev.categories, prev.users, prev.borrowRecords),
    }));
  };

  const updateBook = (id: string, bookData: Partial<Book>) => {
    const updatedBooks = state.books.map(book =>
      book.id === id
        ? { ...book, ...bookData, updatedAt: new Date().toISOString() }
        : book
    );

    setStoredData('books', updatedBooks);
    setState(prev => ({
      ...prev,
      books: updatedBooks,
      stats: calculateStats(updatedBooks, prev.categories, prev.users, prev.borrowRecords),
    }));
  };

  const deleteBook = (id: string) => {
    const updatedBooks = state.books.filter(book => book.id !== id);
    setStoredData('books', updatedBooks);
    setState(prev => ({
      ...prev,
      books: updatedBooks,
      stats: calculateStats(updatedBooks, prev.categories, prev.users, prev.borrowRecords),
    }));
  };

  const addCategory = (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedCategories = [...state.categories, newCategory];
    setStoredData('categories', updatedCategories);
    setState(prev => ({
      ...prev,
      categories: updatedCategories,
      stats: calculateStats(prev.books, updatedCategories, prev.users, prev.borrowRecords),
    }));
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    const updatedCategories = state.categories.map(category =>
      category.id === id ? { ...category, ...categoryData } : category
    );

    setStoredData('categories', updatedCategories);
    setState(prev => ({
      ...prev,
      categories: updatedCategories,
    }));
  };

  const deleteCategory = (id: string) => {
    const updatedCategories = state.categories.filter(category => category.id !== id);
    setStoredData('categories', updatedCategories);
    setState(prev => ({
      ...prev,
      categories: updatedCategories,
      stats: calculateStats(prev.books, updatedCategories, prev.users, prev.borrowRecords),
    }));
  };

  const borrowBook = (bookId: string, userId: string): boolean => {
    const book = state.books.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) return false;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks loan period

    const newRecord: BorrowRecord = {
      id: Date.now().toString(),
      userId,
      bookId,
      borrowDate: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      status: 'borrowed',
      renewalCount: 0,
    };

    const updatedBooks = state.books.map(b =>
      b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b
    );

    const updatedRecords = [...state.borrowRecords, newRecord];

    setStoredData('books', updatedBooks);
    setStoredData('borrowRecords', updatedRecords);

    setState(prev => ({
      ...prev,
      books: updatedBooks,
      borrowRecords: updatedRecords,
      stats: calculateStats(updatedBooks, prev.categories, prev.users, updatedRecords),
    }));

    return true;
  };

  const returnBook = (recordId: string) => {
    const record = state.borrowRecords.find(r => r.id === recordId);
    if (!record) return;

    const updatedRecords = state.borrowRecords.map(r =>
      r.id === recordId
        ? { ...r, status: 'returned' as const, returnDate: new Date().toISOString() }
        : r
    );

    const updatedBooks = state.books.map(b =>
      b.id === record.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b
    );

    setStoredData('books', updatedBooks);
    setStoredData('borrowRecords', updatedRecords);

    setState(prev => ({
      ...prev,
      books: updatedBooks,
      borrowRecords: updatedRecords,
      stats: calculateStats(updatedBooks, prev.categories, prev.users, updatedRecords),
    }));
  };

  const renewBook = (recordId: string): boolean => {
    const record = state.borrowRecords.find(r => r.id === recordId);
    if (!record || record.renewalCount >= 2) return false; // Max 2 renewals

    const newDueDate = new Date(record.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14); // Add 2 weeks

    const updatedRecords = state.borrowRecords.map(r =>
      r.id === recordId
        ? {
            ...r,
            dueDate: newDueDate.toISOString(),
            renewalCount: r.renewalCount + 1,
            status: 'borrowed' as const,
          }
        : r
    );

    setStoredData('borrowRecords', updatedRecords);
    setState(prev => ({
      ...prev,
      borrowRecords: updatedRecords,
    }));

    return true;
  };

  const getUserBorrowRecords = (userId: string): BorrowRecord[] => {
    return state.borrowRecords.filter(record => record.userId === userId);
  };

  const getOverdueRecords = (): BorrowRecord[] => {
    return state.borrowRecords.filter(
      record =>
        record.status === 'borrowed' && new Date(record.dueDate) < new Date()
    );
  };

  const refreshStats = () => {
    setState(prev => ({
      ...prev,
      stats: calculateStats(prev.books, prev.categories, prev.users, prev.borrowRecords),
    }));
  };

  return (
    <LibraryContext.Provider
      value={{
        ...state,
        addBook,
        updateBook,
        deleteBook,
        addCategory,
        updateCategory,
        deleteCategory,
        borrowBook,
        returnBook,
        renewBook,
        getUserBorrowRecords,
        getOverdueRecords,
        refreshStats,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};