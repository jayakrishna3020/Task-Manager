import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync Search & Category with URL Parameters
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';

  // Local-only Filter States
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);

  // Fetch initial data
  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        
        if (isMounted) {
          setProducts(productsData);
          setCategories(categoriesData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch products data.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update URL search query
  const setSearchQuery = (query) => {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (query.trim()) {
        nextParams.set('search', query.trim());
      } else {
        nextParams.delete('search');
      }
      return nextParams;
    });
  };

  // Update URL category filter
  const setSelectedCategory = (category) => {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (category && category !== 'all') {
        nextParams.set('category', category);
      } else {
        nextParams.delete('category');
      }
      return nextParams;
    });
  };

  // Compute filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Price range filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating filter (minimum rating)
    if (ratingFilter > 0) {
      result = result.filter((p) => p.rating && p.rating.rate >= ratingFilter);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy, priceRange, ratingFilter]);

  // Max price helper based on actual products
  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 1000;
    return Math.ceil(Math.max(...products.map((p) => p.price)));
  }, [products]);

  // Sync price limits once products load
  useEffect(() => {
    if (products.length > 0) {
      setPriceRange([0, maxProductPrice]);
    }
  }, [products, maxProductPrice]);

  // Reset all filters
  const resetFilters = () => {
    setSearchParams({}); // Clear query params
    setSortBy('default');
    setPriceRange([0, maxProductPrice]);
    setRatingFilter(0);
  };

  return {
    products,
    categories,
    loading,
    error,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    ratingFilter,
    setRatingFilter,
    maxProductPrice,
    resetFilters
  };
}
export default useProducts;
