export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  categoryId: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  coverUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  renewalCount: number;
}

export interface LibraryStats {
  totalBooks: number;
  totalCategories: number;
  totalUsers: number;
  totalBorrowedBooks: number;
  overdueBooks: number;
  availableBooks: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LibraryState {
  books: Book[];
  categories: Category[];
  users: User[];
  borrowRecords: BorrowRecord[];
  stats: LibraryStats;
}