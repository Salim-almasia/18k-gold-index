import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import DashboardLayout from '../layout/DashboardLayout';
import ArticleCard from '../blog/ArticleCard';

const ARTICLES_PER_PAGE = 3;

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentCategory = searchParams.get('category') || '';

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch articles and categories in parallel
      const [articlesRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/api/blog/articles`, {
          params: {
            page: currentPage,
            per_page: ARTICLES_PER_PAGE,
            category: currentCategory || undefined
          }
        }),
        axios.get(`${API_URL}/api/blog/categories`)
      ]);

      setArticles(articlesRes.data.articles || []);
      setTotalPages(articlesRes.data.total_pages || 1);
      setTotalArticles(articlesRes.data.total || 0);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching blog data:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (categorySlug) => {
    const params = new URLSearchParams();
    if (categorySlug) {
      params.set('category', categorySlug);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <DashboardLayout>
      {/* Hero Section - Premium & Innovant */}
      <section className="relative overflow-hidden">
        {/* Background with warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8F4EF] via-[#FDF9F3] to-[#F5EDE4]"></div>

        {/* Decorative gold circle */}
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#D4AF37]/20"></div>
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#D4AF37]/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 items-center py-10 lg:py-14">

            {/* Left: Main Content (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Breadcrumb style */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Accueil</span>
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-[#D4AF37] font-medium">Blog</span>
              </div>

              {/* Title with decorative element */}
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37] to-[#D4AF37]/20 rounded-full"></div>
                <h1 className="font-title text-4xl md:text-5xl lg:text-[56px] font-bold text-[#1A1A1A] leading-[1.1]">
                  Le Journal<br />
                  <span className="text-[#D4AF37]">de l'Or</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg max-w-lg leading-relaxed">
                Transparence. Authenticité. Expertise.<br />
                <span className="text-gray-400">Votre source de confiance pour l'or au Maroc.</span>
              </p>

              {/* Mini stats inline */}
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#D4AF37]">{totalArticles}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">articles</span>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#1A1A1A]">{categories.length}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">thèmes</span>
                </div>
              </div>
            </div>

            {/* Right: Featured Image (2 cols) */}
            <div className="lg:col-span-2 relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-[#D4AF37]/10">
                <img
                  src="https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&h=450&fit=crop&q=80"
                  alt="Or et bijoux"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Expertise</div>
                      <div className="text-lg font-bold text-[#1A1A1A]">Or 18 Carats</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">18K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                !currentCategory
                  ? 'bg-[#002FA7] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tous les articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  currentCategory === cat.slug
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={currentCategory === cat.slug ? { backgroundColor: cat.color } : {}}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-12 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                  <div className="aspect-[16/9] bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            // Empty state
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Aucun article trouvé
              </h3>
              <p className="text-gray-500 mb-6">
                {currentCategory
                  ? 'Aucun article dans cette catégorie pour le moment.'
                  : 'Les articles arrivent bientôt. Restez connecté !'}
              </p>
              {currentCategory && (
                <button
                  onClick={() => handleCategoryChange('')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#002FA7] text-white font-medium rounded-xl hover:bg-[#001f7a] transition-colors"
                >
                  Voir tous les articles
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Articles count */}
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  {totalArticles} article{totalArticles > 1 ? 's' : ''} trouvé{totalArticles > 1 ? 's' : ''}
                  {currentCategory && categories.find(c => c.slug === currentCategory) && (
                    <span> dans <span className="font-medium text-gray-700">{categories.find(c => c.slug === currentCategory).name}</span></span>
                  )}
                </p>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* Premium Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center">
                  {/* Pagination controls */}
                  <div className="flex items-center gap-1 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-2">
                    {/* Previous button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        currentPage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#002FA7]'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Précédent</span>
                    </button>

                    <div className="w-px h-6 bg-gray-200 mx-1"></div>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {getPaginationNumbers().map((page, index) => (
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                            ⋯
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`min-w-[42px] h-10 rounded-xl text-sm font-semibold transition-all ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-[#002FA7] to-[#0040D4] text-white shadow-md shadow-[#002FA7]/30'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      ))}
                    </div>

                    <div className="w-px h-6 bg-gray-200 mx-1"></div>

                    {/* Next button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        currentPage === totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#002FA7]'
                      }`}
                    >
                      <span className="hidden sm:inline">Suivant</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-title text-2xl font-bold text-[#1A1A1A] mb-4">
            Suivez le cours de l'or en temps réel
          </h2>
          <p className="text-gray-500 mb-8">
            Consultez les prix actualisés et l'historique des variations
          </p>
          <Link
            to="/prix-de-lor"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#002FA7] text-white font-semibold rounded-xl hover:bg-[#001f7a] transition-colors shadow-lg shadow-[#002FA7]/25"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Voir le cours actuel
          </Link>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Blog;
