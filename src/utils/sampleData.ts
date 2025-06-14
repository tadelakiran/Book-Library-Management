import { Book, Category, User, BorrowRecord } from '../types';
import { getStoredData, setStoredData } from './storage';

export const initializeSampleData = () => {
  // Only initialize if data doesn't exist
  if (!getStoredData('categories')) {
    const sampleCategories: Category[] = [
      {
        id: '1',
        name: 'Fiction',
        description: 'Fictional literature and novels',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Science',
        description: 'Scientific books and research',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Technology',
        description: 'Books about technology and programming',
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'History',
        description: 'Historical books and biographies',
        createdAt: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Self-Help',
        description: 'Personal development and self-improvement',
        createdAt: new Date().toISOString(),
      },
    ];
    setStoredData('categories', sampleCategories);
  }

  if (!getStoredData('books')) {
    const sampleBooks: Book[] = [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0-7432-7356-5',
        categoryId: '1',
        description: 'A classic American novel set in the Jazz Age',
        totalCopies: 5,
        availableCopies: 3,
        coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0-13-235088-4',
        categoryId: '3',
        description: 'A handbook of agile software craftsmanship',
        totalCopies: 8,
        availableCopies: 5,
        coverUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        isbn: '978-0-06-231609-7',
        categoryId: '4',
        description: 'A brief history of humankind',
        totalCopies: 6,
        availableCopies: 4,
        coverUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'The Physics of the Impossible',
        author: 'Michio Kaku',
        isbn: '978-0-385-52069-0',
        categoryId: '2',
        description: 'A scientific exploration into the world of phasers, force fields, teleportation, and time travel',
        totalCopies: 4,
        availableCopies: 2,
        coverUrl: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '978-0-7352-1129-2',
        categoryId: '5',
        description: 'An easy and proven way to build good habits and break bad ones',
        totalCopies: 10,
        availableCopies: 7,
        coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '6',
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0-452-28423-4',
        categoryId: '1',
        description: 'A dystopian social science fiction novel',
        totalCopies: 7,
        availableCopies: 4,
        coverUrl: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    setStoredData('books', sampleBooks);
  }

  if (!getStoredData('users')) {
    const sampleUsers: User[] = [
      {
        id: '1',
        email: 'admin@library.com',
        name: 'Library Admin',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'john@email.com',
        name: 'John Doe',
        role: 'user',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        email: 'jane@email.com',
        name: 'Jane Smith',
        role: 'user',
        createdAt: new Date().toISOString(),
      },
    ];
    setStoredData('users', sampleUsers);
  }

  if (!getStoredData('borrowRecords')) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const overdueDueDate = new Date();
    overdueDueDate.setDate(overdueDueDate.getDate() - 3);

    const sampleBorrowRecords: BorrowRecord[] = [
      {
        id: '1',
        userId: '2',
        bookId: '1',
        borrowDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: dueDate.toISOString(),
        status: 'borrowed',
        renewalCount: 0,
      },
      {
        id: '2',
        userId: '3',
        bookId: '4',
        borrowDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: overdueDueDate.toISOString(),
        status: 'borrowed',
        renewalCount: 1,
      },
    ];
    setStoredData('borrowRecords', sampleBorrowRecords);
  }
};