import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LibraryProvider } from './contexts/LibraryContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import BooksManager from './components/Books/BooksManager';
import CategoriesManager from './components/Categories/CategoriesManager';
import UsersManager from './components/Users/UsersManager';
import BrowseBooks from './components/Books/BrowseBooks';
import MyBooks from './components/Books/MyBooks';
import OverdueBooks from './components/Books/OverdueBooks';
import ReportsView from './components/Reports/ReportsView';
import ProfileView from './components/Profile/ProfileView';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showLoginForm, setShowLoginForm] = useState(true);

  if (!isAuthenticated) {
    return showLoginForm ? (
      <LoginForm onToggleForm={() => setShowLoginForm(false)} />
    ) : (
      <RegisterForm onToggleForm={() => setShowLoginForm(true)} />
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return user?.role === 'admin' ? (
          <AdminDashboard onViewChange={setCurrentView} />
        ) : (
          <UserDashboard onViewChange={setCurrentView} />
        );
      case 'books':
        return <BooksManager />;
      case 'categories':
        return <CategoriesManager />;
      case 'users':
        return <UsersManager />;
      case 'browse':
        return <BrowseBooks />;
      case 'my-books':
        return <MyBooks />;
      case 'overdue':
        return <OverdueBooks />;
      case 'reports':
        return <ReportsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return user?.role === 'admin' ? (
          <AdminDashboard onViewChange={setCurrentView} />
        ) : (
          <UserDashboard onViewChange={setCurrentView} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <AppContent />
      </LibraryProvider>
    </AuthProvider>
  );
}

export default App;