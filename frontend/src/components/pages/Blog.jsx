import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import DashboardLayout from '../layout/DashboardLayout';
import ArticleCard from '../blog/ArticleCard';
import { useLanguage } from '../../context/LanguageContext';

const ARTICLES_PER_PAGE = 3;

const Blog = () => {
  const { t, isRTL, language, getLocalizedPath, getBasePath } = useLanguage();
  const { category: categorySlug, page: pageParam } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  const currentPage = parseInt(pageParam || '1', 10);
  const currentCategory = categorySlug || '';

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
    const basePath = getBasePath();
    if (currentCategory) {
      navigate(`${basePath}/blog/${currentCategory}/page/${page}`);
    } else {
      navigate(`${basePath}/blog/page/${page}`);
    }
  };

  const handleCategoryChange = (slug) => {
    const basePath = getBasePath();
    if (slug) {
      navigate(`${basePath}/blog/${slug}`);
    } else {
      navigate(`${basePath}/blog`);
    }
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

  const currentCategoryData = categories.find(c => c.slug === currentCategory);

  // Get category name based on language
  const getCategoryName = (category) => {
    if (isRTL && category.name_ar) {
      return category.name_ar;
    }
    return category.name;
  };

  return (
    <DashboardLayout>
      {/* Hero Section - Clean & Professional */}
      <section className={`relative bg-[#FAFAFA] overflow-hidden ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Watermark gold bars image */}
        <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 bottom-0 w-1/2 pointer-events-none select-none opacity-[0.04]`}>
          <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            {/* Gold bar 1 */}
            <rect x="50" y="80" width="120" height="40" rx="4" fill="#D4AF37" transform="rotate(-15 110 100)"/>
            <rect x="55" y="85" width="110" height="30" rx="2" fill="#B8963E" transform="rotate(-15 110 100)"/>
            {/* Gold bar 2 */}
            <rect x="150" y="120" width="120" height="40" rx="4" fill="#D4AF37" transform="rotate(-15 210 140)"/>
            <rect x="155" y="125" width="110" height="30" rx="2" fill="#B8963E" transform="rotate(-15 210 140)"/>
            {/* Gold bar 3 */}
            <rect x="100" y="160" width="120" height="40" rx="4" fill="#D4AF37" transform="rotate(-15 160 180)"/>
            <rect x="105" y="165" width="110" height="30" rx="2" fill="#B8963E" transform="rotate(-15 160 180)"/>
            {/* Gold coins */}
            <circle cx="300" cy="100" r="35" fill="#D4AF37"/>
            <circle cx="300" cy="100" r="28" fill="#B8963E"/>
            <circle cx="320" cy="140" r="35" fill="#D4AF37"/>
            <circle cx="320" cy="140" r="28" fill="#C9A961"/>
            <circle cx="280" cy="180" r="35" fill="#D4AF37"/>
            <circle cx="280" cy="180" r="28" fill="#B8963E"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-[2px] bg-[#D4AF37]"></div>
              <span className="text-sm font-medium text-[#D4AF37] uppercase tracking-[0.15em]">{t('blog.title')}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.1] tracking-tight mb-6">
              {currentCategoryData ? getCategoryName(currentCategoryData) : (isRTL ? 'مجلة الذهب' : 'Le Journal de l\'Or')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-xl">
              {currentCategoryData
                ? (isRTL ? `جميع مقالات فئة ${getCategoryName(currentCategoryData)}` : `Tous les articles de la catégorie ${getCategoryName(currentCategoryData)}`)
                : t('blog.subtitle')}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#D4AF37]">{totalArticles}</span>
                <span className="text-sm text-gray-400 uppercase tracking-wider">{isRTL ? 'مقال' : 'Articles'}</span>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#1A1A1A]">{categories.length}</span>
                <span className="text-sm text-gray-400 uppercase tracking-wider">{isRTL ? 'فئات' : 'Catégories'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div className={`h-px bg-gradient-to-r ${isRTL ? 'from-transparent via-gray-200 to-[#D4AF37]' : 'from-[#D4AF37] via-gray-200 to-transparent'}`}></div>
      </section>

      {/* Categories Filter */}
      <section className={`bg-white border-b border-gray-100 sticky top-0 z-20 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            <Link
              to={getLocalizedPath('/blog')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                !currentCategory
                  ? 'bg-[#002FA7] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('blog.allCategories')}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={getLocalizedPath(`/blog/${cat.slug}`)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  currentCategory === cat.slug
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={currentCategory === cat.slug ? { backgroundColor: cat.color } : {}}
              >
                {getCategoryName(cat)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className={`py-12 bg-[#FAFAFA] ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
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
                {t('blog.noArticles')}
              </h3>
              <p className="text-gray-500 mb-6">
                {currentCategory
                  ? (isRTL ? 'لا توجد مقالات في هذه الفئة حالياً.' : 'Aucun article dans cette catégorie pour le moment.')
                  : (isRTL ? 'المقالات قادمة قريباً. ابق على اتصال!' : 'Les articles arrivent bientôt. Restez connecté !')}
              </p>
              {currentCategory && (
                <Link
                  to={getLocalizedPath('/blog')}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 bg-[#002FA7] text-white font-medium rounded-xl hover:bg-[#001f7a] transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {isRTL ? 'عرض جميع المقالات' : 'Voir tous les articles'}
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Articles count */}
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  {totalArticles} {isRTL ? 'مقال' : (totalArticles > 1 ? 'articles trouvés' : 'article trouvé')}
                  {currentCategoryData && (
                    <span> {isRTL ? 'في' : 'dans'} <span className="font-medium text-gray-700">{getCategoryName(currentCategoryData)}</span></span>
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
                  <div className={`flex items-center gap-1 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* Previous button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isRTL ? 'flex-row-reverse' : ''} ${
                        currentPage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#002FA7]'
                      }`}
                    >
                      <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">{t('common.previous')}</span>
                    </button>

                    <div className="w-px h-6 bg-gray-200 mx-1"></div>

                    {/* Page numbers */}
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isRTL ? 'flex-row-reverse' : ''} ${
                        currentPage === totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#002FA7]'
                      }`}
                    >
                      <span className="hidden sm:inline">{t('common.next')}</span>
                      <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <section className={`py-16 bg-white ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-title text-2xl font-bold text-[#1A1A1A] mb-4">
            {isRTL ? 'تابع سعر الذهب في الوقت الحقيقي' : 'Suivez le cours de l\'or en temps réel'}
          </h2>
          <p className="text-gray-500 mb-8">
            {isRTL ? 'اطلع على الأسعار المحدثة وتاريخ التغيرات' : 'Consultez les prix actualisés et l\'historique des variations'}
          </p>
          <Link
            to={getLocalizedPath('/prix-de-lor')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#002FA7] text-white font-semibold rounded-xl hover:bg-[#001f7a] transition-colors shadow-lg shadow-[#002FA7]/25"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {t('home.cta.button')}
          </Link>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Blog;
