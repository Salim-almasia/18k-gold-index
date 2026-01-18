import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_URL from '../../config';

const BlogAdmin = ({ token }) => {
  const [activeTab, setActiveTab] = useState('articles');
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = useCallback(async () => {
    const headers = { headers: { 'Authorization': `Bearer ${token}` } };
    try {
      setLoading(true);
      const [articlesRes, categoriesRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/blog/articles`, headers),
        axios.get(`${API_URL}/api/blog/categories`),
        axios.get(`${API_URL}/api/admin/blog/stats`, headers)
      ]);
      // Handle paginated response: {articles: [...], total, page, ...}
      const articlesData = articlesRes.data?.articles || articlesRes.data || [];
      setArticles(Array.isArray(articlesData) ? articlesData : []);
      setCategories(categoriesRes.data || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching blog data:', error);
      showMessage('error', 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    try {
      await axios.delete(`${API_URL}/api/admin/blog/articles/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      showMessage('success', 'Article supprimé avec succès');
      fetchData();
    } catch (error) {
      showMessage('error', 'Erreur lors de la suppression');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
    try {
      await axios.delete(`${API_URL}/api/admin/blog/categories/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      showMessage('success', 'Catégorie supprimée');
      fetchData();
    } catch (error) {
      showMessage('error', 'Erreur: cette catégorie contient peut-être des articles');
    }
  };

  const handleEditArticle = async (article) => {
    // Fetch full article data to get all fields
    try {
      const response = await axios.get(`${API_URL}/api/admin/blog/articles/${article.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEditingArticle(response.data);
      setShowArticleForm(true);
    } catch (error) {
      console.error('Error fetching article:', error);
      showMessage('error', 'Erreur lors du chargement de l\'article');
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || article.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Message */}
      {message.text && (
        <div className={`flex items-center gap-3 p-4 rounded-xl ${
          message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {message.type === 'success' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          <span>{message.text}</span>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#002FA7]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#002FA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Articles</p>
                <p className="text-xl font-bold text-gray-800">{stats.total_articles}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Publiés</p>
                <p className="text-xl font-bold text-emerald-600">{stats.published_articles}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Brouillons</p>
                <p className="text-xl font-bold text-amber-600">{stats.draft_articles}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Catégories</p>
                <p className="text-xl font-bold text-gray-800">{stats.total_categories}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'articles'
              ? 'bg-[#002FA7] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Articles
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'categories'
              ? 'bg-[#002FA7] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Catégories
        </button>
      </div>

      {/* Articles Tab */}
      {activeTab === 'articles' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none"
              >
                <option value="">Tous</option>
                <option value="published">Publiés</option>
                <option value="draft">Brouillons</option>
              </select>
            </div>
            <button
              onClick={() => {
                setEditingArticle(null);
                setShowArticleForm(true);
              }}
              className="px-4 py-2 bg-[#002FA7] text-white text-sm font-medium rounded-lg hover:bg-[#001f7a] transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvel article
            </button>
          </div>

          {/* Articles List */}
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-gray-500">Aucun article trouvé</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredArticles.map((article) => (
                <div key={article.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {article.image ? (
                        <img src={article.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-gray-800 truncate">{article.title}</h3>
                          {article.title_ar && (
                            <p className="text-sm text-gray-500 truncate" dir="rtl">{article.title_ar}</p>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            {article.category && (
                              <span
                                className="px-2 py-0.5 rounded-full text-white"
                                style={{ backgroundColor: article.category.color || '#D4AF37' }}
                              >
                                {article.category.name}
                              </span>
                            )}
                            <span>{formatDate(article.created_at)}</span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {article.views}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            article.status === 'published'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {article.status === 'published' ? 'Publié' : 'Brouillon'}
                          </span>

                          <button
                            onClick={() => handleEditArticle(article)}
                            className="p-2 text-gray-400 hover:text-[#002FA7] hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Gestion des catégories</h3>
            <button
              onClick={() => {
                setEditingCategory(null);
                setShowCategoryForm(true);
              }}
              className="px-4 py-2 bg-[#002FA7] text-white text-sm font-medium rounded-lg hover:bg-[#001f7a] transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle catégorie
            </button>
          </div>

          {categories.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-gray-500">Aucune catégorie créée</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categories.map((category) => (
                <div key={category.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <div>
                      <span className="font-medium text-gray-800">{category.name}</span>
                      {category.name_ar && (
                        <span className="text-gray-500 mx-2">|</span>
                      )}
                      {category.name_ar && (
                        <span className="text-gray-600" dir="rtl">{category.name_ar}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">/{category.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setShowCategoryForm(true);
                      }}
                      className="p-2 text-gray-400 hover:text-[#002FA7] hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Article Form Modal */}
      {showArticleForm && (
        <ArticleFormModal
          article={editingArticle}
          categories={categories}
          token={token}
          onClose={() => {
            setShowArticleForm(false);
            setEditingArticle(null);
          }}
          onSave={() => {
            setShowArticleForm(false);
            setEditingArticle(null);
            fetchData();
            showMessage('success', editingArticle ? 'Article mis à jour' : 'Article créé avec succès');
          }}
        />
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryFormModal
          category={editingCategory}
          token={token}
          onClose={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
          onSave={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
            fetchData();
            showMessage('success', editingCategory ? 'Catégorie mise à jour' : 'Catégorie créée');
          }}
        />
      )}
    </div>
  );
};

// Article Form Modal Component with Language Tabs
const ArticleFormModal = ({ article, categories, token, onClose, onSave }) => {
  const [langTab, setLangTab] = useState('fr');
  const [formData, setFormData] = useState({
    // French content
    title: '',
    excerpt: '',
    content: '',
    meta_title: '',
    meta_description: '',
    // Arabic content
    title_ar: '',
    excerpt_ar: '',
    content_ar: '',
    meta_title_ar: '',
    meta_description_ar: '',
    // Common fields
    image: '',
    category_id: '',
    status: 'draft',
    reading_time: 5,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Update form data when article changes (fixes the edit bug)
  useEffect(() => {
    if (article) {
      setFormData({
        // French content
        title: article.title || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
        // Arabic content
        title_ar: article.title_ar || '',
        excerpt_ar: article.excerpt_ar || '',
        content_ar: article.content_ar || '',
        meta_title_ar: article.meta_title_ar || '',
        meta_description_ar: article.meta_description_ar || '',
        // Common fields
        image: article.image || '',
        category_id: article.category_id || '',
        status: article.status || 'draft',
        reading_time: article.reading_time || 5,
      });
    }
  }, [article]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      setUploading(true);
      const response = await axios.post(`${API_URL}/api/admin/upload`, formDataUpload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData(prev => ({ ...prev, image: response.data.url }));
    } catch (error) {
      setError('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        reading_time: parseInt(formData.reading_time)
      };

      if (article) {
        await axios.put(`${API_URL}/api/admin/blog/articles/${article.id}`, payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/api/admin/blog/articles`, payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      onSave();
    } catch (error) {
      setError(error.response?.data?.detail || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            {article ? 'Modifier l\'article' : 'Nouvel article'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Language Tabs */}
          <div className="flex gap-2 border-b border-gray-200 pb-2">
            <button
              type="button"
              onClick={() => setLangTab('fr')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                langTab === 'fr'
                  ? 'bg-[#002FA7] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>🇫🇷</span>
              Français
            </button>
            <button
              type="button"
              onClick={() => setLangTab('ar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                langTab === 'ar'
                  ? 'bg-[#002FA7] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>🇲🇦</span>
              العربية
            </button>
          </div>

          {/* French Content */}
          {langTab === 'fr' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre (FR) *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none"
                  placeholder="Titre de l'article en français"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Extrait (FR)</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={2}
                  maxLength={300}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none resize-none"
                  placeholder="Court résumé de l'article (max 300 caractères)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenu (FR) *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none resize-none font-mono text-sm"
                  placeholder="Contenu HTML de l'article..."
                />
                <p className="text-xs text-gray-400 mt-1">Vous pouvez utiliser du HTML pour le formatage</p>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">SEO Français (Optionnel)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title (FR)</label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleChange}
                      maxLength={200}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none"
                      placeholder="Titre pour les moteurs de recherche"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description (FR)</label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleChange}
                      rows={2}
                      maxLength={300}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none resize-none"
                      placeholder="Description pour les moteurs de recherche"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Arabic Content */}
          {langTab === 'ar' && (
            <div className="space-y-5" dir="rtl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">العنوان (AR)</label>
                <input
                  type="text"
                  name="title_ar"
                  value={formData.title_ar}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none text-right"
                  placeholder="عنوان المقال بالعربية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">الملخص (AR)</label>
                <textarea
                  name="excerpt_ar"
                  value={formData.excerpt_ar}
                  onChange={handleChange}
                  rows={2}
                  maxLength={300}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none resize-none text-right"
                  placeholder="ملخص قصير للمقال (300 حرف كحد أقصى)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">المحتوى (AR)</label>
                <textarea
                  name="content_ar"
                  value={formData.content_ar}
                  onChange={handleChange}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none resize-none font-mono text-sm text-right"
                  placeholder="محتوى المقال بصيغة HTML..."
                />
                <p className="text-xs text-gray-400 mt-1 text-right">يمكنك استخدام HTML للتنسيق</p>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 text-right">SEO بالعربية (اختياري)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">Meta Title (AR)</label>
                    <input
                      type="text"
                      name="meta_title_ar"
                      value={formData.meta_title_ar}
                      onChange={handleChange}
                      maxLength={200}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none text-right"
                      placeholder="عنوان لمحركات البحث"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">Meta Description (AR)</label>
                    <textarea
                      name="meta_description_ar"
                      value={formData.meta_description_ar}
                      onChange={handleChange}
                      rows={2}
                      maxLength={300}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none resize-none text-right"
                      placeholder="وصف لمحركات البحث"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Paramètres généraux</h3>

            {/* Image */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none"
                    placeholder="URL de l'image"
                  />
                </div>
                <label className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 cursor-pointer transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {uploading ? 'Upload...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {formData.image && (
                <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none"
                >
                  <option value="">Sans catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
            </div>

            {/* Reading time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Temps de lecture (minutes)</label>
              <input
                type="number"
                name="reading_time"
                value={formData.reading_time}
                onChange={handleChange}
                min="1"
                className="w-32 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#002FA7] text-white rounded-xl hover:bg-[#001f7a] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {article ? 'Mettre à jour' : 'Créer l\'article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Category Form Modal Component with Arabic Name
const CategoryFormModal = ({ category, token, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    color: '#D4AF37'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form data when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        name_ar: category.name_ar || '',
        color: category.color || '#D4AF37'
      });
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (category) {
        await axios.put(`${API_URL}/api/admin/blog/categories/${category.id}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/api/admin/blog/categories`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      onSave();
    } catch (error) {
      setError(error.response?.data?.detail || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom (FR) *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none"
              placeholder="Nom de la catégorie en français"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم (AR)</label>
            <input
              type="text"
              value={formData.name_ar}
              onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none text-right"
              placeholder="اسم الفئة بالعربية"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-12 h-12 rounded-xl cursor-pointer border border-gray-200"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002FA7]/20 focus:border-[#002FA7] outline-none font-mono"
                placeholder="#D4AF37"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#002FA7] text-white rounded-xl hover:bg-[#001f7a] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {category ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogAdmin;
