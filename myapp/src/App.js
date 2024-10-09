import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiStar, FiFilter, FiX } from 'react-icons/fi';
import { useSpring, animated } from 'react-spring';
import './input.css'; // Assuming your CSS file already includes some styling.

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minCalories, setMinCalories] = useState('');
  const [maxCalories, setMaxCalories] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      q: searchTerm,
      min_calories: minCalories,
      max_calories: maxCalories,
      min_rating: minRating,
      max_rating: maxRating,
      page,
      size: pageSize,
    });

    try {
      const response = await fetch(`http://localhost:5000/search?${queryParams}`);
      const data = await response.json();
      setRecipes(data.results);
      setTotalResults(data.total_hits);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRecipes();
  };

  const handleNextPage = () => {
    if (page * pageSize < totalResults) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [page]);

  const filtersAnimation = useSpring({
    transform: filtersVisible ? 'scaleY(1)' : 'scaleY(0)',
    opacity: filtersVisible ? 1 : 0,
    transformOrigin: 'top',
    config: { tension: 300, friction: 20 },
  });

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-orange-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">EpiRecipes</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="flex items-center justify-center">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for recipes..."
                className="w-full pl-4 pr-10 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-orange-500 transition duration-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition duration-300"
              >
                <FiSearch size={24} />
              </button>
            </div>
          </form>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Search Results</h2>
          <button
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-300"
          >
            <FiFilter className="mr-2" /> Filters
          </button>
        </div>

        <animated.div style={filtersAnimation} className="bg-white rounded-lg shadow-md p-6 mb-8 origin-top">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={() => setFiltersVisible(false)}
              className="text-gray-600 hover:text-orange-500 transition duration-300"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={minCalories}
                  onChange={(e) => setMinCalories(e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <input
                  type="number"
                  value={maxCalories}
                  onChange={(e) => setMaxCalories(e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <input
                  type="number"
                  value={maxRating}
                  onChange={(e) => setMaxRating(e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition duration-300"
          >
            Apply Filters
          </button>
        </animated.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{recipe.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{recipe.directions}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">
                      {recipe.calories} calories
                    </span>
                    <div className="flex items-center">
                      <FiStar className="text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-700">{recipe.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && recipes.length === 0 && (
          <p className="text-center text-gray-500 text-lg mt-8">No recipes found. Try adjusting your filters.</p>
        )}

        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`flex items-center px-4 py-2 rounded-md ${
              page === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-700 transition duration-300'
            }`}
          >
            <FiChevronLeft className="mr-2" />
            Previous
          </button>
          <span className="text-lg font-medium">{`Page ${page}`}</span>
          <button
            onClick={handleNextPage}
            disabled={page * pageSize >= totalResults}
            className={`flex items-center px-4 py-2 rounded-md ${
              page * pageSize >= totalResults
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-700 transition duration-300'
            }`}
          >
            Next
            <FiChevronRight className="ml-2" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
