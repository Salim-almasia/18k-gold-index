import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import Blog from './Blog';
import ArticlePage from './ArticlePage';

// Known category slugs - will be fetched dynamically
const BlogRouter = () => {
  const { slug } = useParams();
  const [isCategory, setIsCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const checkSlugType = async () => {
      try {
        // Fetch categories to check if slug is a category
        const response = await axios.get(`${API_URL}/api/blog/categories`);
        const cats = response.data || [];
        setCategories(cats);

        // Check if the slug matches any category
        const categoryMatch = cats.some(cat => cat.slug === slug);
        setIsCategory(categoryMatch);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // If error, assume it's an article
        setIsCategory(false);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      checkSlugType();
    } else {
      setLoading(false);
    }
  }, [slug]);

  // Show loading state briefly
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If it's a category, render Blog with category filter
  if (isCategory) {
    return <Blog />;
  }

  // Otherwise, render ArticlePage
  return <ArticlePage />;
};

export default BlogRouter;
