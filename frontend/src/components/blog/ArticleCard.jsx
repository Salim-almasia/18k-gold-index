import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  const {
    slug,
    title,
    excerpt,
    image,
    category,
    reading_time,
    published_at
  } = article;

  // Format date in French
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Default placeholder image
  const imageUrl = image || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&h=400&fit=crop';

  return (
    <Link
      to={`/blog/${slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl hover:shadow-gray-100/50"
    >
      {/* Image Container - 16:9 aspect ratio */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4">
            <span
              className="inline-block px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg"
              style={{ backgroundColor: category.color || '#D4AF37' }}
            >
              {category.name}
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
              <span>{reading_time} min de lecture</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-title text-xl font-semibold text-[#1A1A1A] mb-3 line-clamp-2 group-hover:text-[#002FA7] transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        )}

        {/* Read more indicator */}
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#002FA7] opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Lire l'article</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
