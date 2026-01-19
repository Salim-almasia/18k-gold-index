import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const ArticleCard = ({ article }) => {
  const { isRTL, getLocalizedPath } = useLanguage();

  const {
    slug,
    title,
    title_ar,
    excerpt,
    excerpt_ar,
    image,
    category,
    reading_time,
    published_at
  } = article;

  // Format date based on language
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-MA' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get localized content
  const displayTitle = isRTL && title_ar ? title_ar : title;
  const displayExcerpt = isRTL && excerpt_ar ? excerpt_ar : excerpt;
  const displayCategory = isRTL && category?.name_ar ? category.name_ar : category?.name;

  // Default placeholder image
  const imageUrl = image || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&h=400&fit=crop';

  return (
    <Link
      to={getLocalizedPath(`/blog/${slug}`)}
      className={`group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl hover:shadow-gray-100/50 ${isRTL ? 'font-arabic' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Image Container - 16:9 aspect ratio */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={displayTitle}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Category Badge */}
        {category && displayCategory && (
          <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
            <span
              className="inline-block px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg"
              style={{ backgroundColor: category.color || '#D4AF37' }}
            >
              {displayCategory}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span>{formatDate(published_at)}</span>
          {reading_time && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>{isRTL ? `${reading_time} دقائق للقراءة` : `${reading_time} min de lecture`}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-title text-xl font-semibold text-[#1A1A1A] mb-3 line-clamp-2 group-hover:text-[#002FA7] transition-colors">
          {displayTitle}
        </h3>

        {/* Excerpt */}
        {displayExcerpt && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
            {displayExcerpt}
          </p>
        )}

        {/* Read more indicator */}
        <div className={`mt-4 flex items-center gap-2 text-sm font-medium text-[#002FA7] opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span>{isRTL ? 'اقرأ المقال' : "Lire l'article"}</span>
          <svg className={`w-4 h-4 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
