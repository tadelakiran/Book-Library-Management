# 📚 Library Management System

A comprehensive, modern web-based library management system built with React, TypeScript, and Tailwind CSS. This system provides a complete solution for managing books, users, and library operations with a beautiful, responsive interface.

## ✨ Features

### 🔐 Authentication System
- **Dual Role Support**: Admin and User roles with different permissions
- **Secure Login/Registration**: Form validation and error handling
- **Demo Accounts**: Quick access with pre-configured credentials
- **Session Management**: Persistent login state with localStorage

### 👨‍💼 Admin Features
- **Dashboard**: Comprehensive overview with statistics and recent activity
- **Book Management**: Add, edit, delete, and organize books
- **Category Management**: Create and manage book categories
- **User Management**: View and manage library members
- **Reports & Analytics**: Detailed insights and statistics
- **Overdue Tracking**: Monitor and manage overdue books

### 👤 User Features
- **Personal Dashboard**: Overview of borrowed books and library stats
- **Book Browsing**: Search and filter available books
- **Book Borrowing**: Easy borrowing system with due date tracking
- **My Books**: Manage borrowed books, renewals, and history
- **Profile Management**: Update personal information

### 🎨 Design Features
- **Modern UI**: Beautiful orange and green gradient theme
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Responsive Design**: Works perfectly on all device sizes
- **Glass Morphism**: Modern backdrop blur effects
- **Interactive Elements**: Engaging user experience with visual feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Demo Credentials

### Admin Account
- **Email**: `admin@library.com`
- **Password**: `password123`

### User Account
- **Email**: `john@email.com`
- **Password**: `password123`

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Auth/            # Authentication components
│   ├── Books/           # Book management components
│   ├── Categories/      # Category management components
│   ├── Dashboard/       # Dashboard components
│   ├── Layout/          # Layout components (Header, Sidebar)
│   ├── Profile/         # User profile components
│   ├── Reports/         # Reports and analytics
│   └── Users/           # User management components
├── contexts/            # React Context providers
│   ├── AuthContext.tsx  # Authentication state management
│   └── LibraryContext.tsx # Library data management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
│   ├── storage.ts       # localStorage utilities
│   └── sampleData.ts    # Sample data initialization
└── App.tsx             # Main application component
```

## 🛠️ Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Context API
- **Data Storage**: localStorage (for demo purposes)
- **Linting**: ESLint with TypeScript support

## 📱 Key Functionalities

### Book Management
- Add new books with cover images, categories, and metadata
- Edit existing book information
- Delete books (with safety checks)
- Track available vs. total copies
- Search and filter by title, author, category, and availability

### User Management
- View all registered users
- Track user borrowing activity
- Monitor overdue books per user
- Role-based access control

### Borrowing System
- 14-day loan period with automatic due date calculation
- Book renewal system (up to 2 renewals)
- Overdue book tracking and alerts
- Borrowing history for each user

### Reports & Analytics
- Library statistics and trends
- Popular books tracking
- Category-wise book distribution
- User activity monitoring
- Overdue book reports

## 🎨 Design System

### Color Palette
- **Primary**: Orange gradients (`from-orange-500 to-amber-500`)
- **Secondary**: Green gradients (`from-green-500 to-emerald-500`)
- **Accent**: Red gradients for alerts (`from-red-500 to-pink-500`)
- **Neutral**: Gray tones for text and backgrounds

### Animation Features
- Smooth hover transitions on all interactive elements
- Scale and rotation effects on buttons and cards
- Gradient animations and color transitions
- Loading states with pulse animations
- Shake animations for form validation errors

## 🔧 Customization

### Adding New Features
1. Create new components in the appropriate directory
2. Add routes in `App.tsx`
3. Update the sidebar navigation in `Sidebar.tsx`
4. Add necessary types in `types/index.ts`

### Modifying the Theme
1. Update color classes in Tailwind configuration
2. Modify gradient combinations in components
3. Adjust animation timings in `index.css`

### Data Storage
Currently uses localStorage for demo purposes. To integrate with a real backend:
1. Replace localStorage calls in `utils/storage.ts`
2. Update context providers to use API calls
3. Add proper error handling and loading states

## 📈 Future Enhancements

- **Backend Integration**: Connect to a real database and API
- **Email Notifications**: Automated overdue book reminders
- **Advanced Search**: Full-text search with filters
- **Book Reservations**: Queue system for popular books
- **Digital Books**: Support for e-books and PDFs
- **Mobile App**: React Native version
- **Barcode Scanning**: Quick book check-in/out
- **Fine Management**: Late fee calculation and payment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lucide React** for beautiful icons
- **Tailwind CSS** for utility-first styling
- **React** team for the amazing framework
- **Vite** for lightning-fast development experience

---

**Built with ❤️ for modern library management**