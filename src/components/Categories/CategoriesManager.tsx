import React, { useState } from 'react';
import { Plus, Edit, Trash2, FolderOpen, BookOpen } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { Category } from '../../types';
import CategoryForm from './CategoryForm';

const CategoriesManager: React.FC = () => {
  const { categories, books, addCategory, updateCategory, deleteCategory } = useLibrary();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  const getCategoryBookCount = (categoryId: string) => {
    return books.filter(book => book.categoryId === categoryId).length;
  };

  const handleSubmit = (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    setShowForm(false);
    setEditingCategory(undefined);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (categoryId: string) => {
    const bookCount = getCategoryBookCount(categoryId);
    if (bookCount > 0) {
      alert(`Cannot delete category. It contains ${bookCount} book(s). Please reassign or remove the books first.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(categoryId);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-1">Organize your books into categories</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Total Categories</p>
          <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Total Books</p>
          <p className="text-2xl font-bold text-blue-600">{books.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Avg Books/Category</p>
          <p className="text-2xl font-bold text-emerald-600">
            {categories.length > 0 ? Math.round(books.length / categories.length) : 0}
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => {
            const bookCount = getCategoryBookCount(category.id);
            return (
              <div key={category.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <FolderOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{bookCount} books</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created {new Date(category.createdAt).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded-full ${
                    bookCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {bookCount > 0 ? 'Active' : 'Empty'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <FolderOpen className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-500 mb-6">
              Create categories to organize your books and make them easier to find.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create First Category
            </button>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default CategoriesManager;