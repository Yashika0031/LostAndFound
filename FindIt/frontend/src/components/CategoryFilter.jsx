const categories = [
  { value: '', label: 'All Categories' },
  { value: 'Electronics', label: '📱 Electronics' },
  { value: 'Wallet', label: '👛 Wallet/Purse' },
  { value: 'Documents', label: '📄 Documents' },
  { value: 'Keys', label: '🔑 Keys' },
  { value: 'Jewelry', label: '💍 Jewelry' },
  { value: 'Bags', label: '🎒 Bags/Backpacks' },
  { value: 'Clothing', label: '👕 Clothing' },
  { value: 'Other', label: '📦 Other' }
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Item Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
              ${selectedCategory === category.value
                ? 'bg-navy text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;