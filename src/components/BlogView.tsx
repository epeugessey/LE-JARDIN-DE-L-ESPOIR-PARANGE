import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  ArrowLeft, 
  Heart, 
  Share2, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { BlogPost, BlogComment } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BlogViewProps {
  posts?: BlogPost[];
  comments?: BlogComment[];
  onAddComment: (comment: Omit<BlogComment, 'id' | 'createdAt' | 'status'>) => void;
  onOpenConsultationModal?: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({
  posts = [],
  comments = [],
  onAddComment,
  onOpenConsultationModal
}) => {
  const { t, language, isEn } = useLanguage();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New comment form state
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentRole, setCommentRole] = useState<'parange' | 'proche' | 'soignant' | 'sympathisant'>('parange');
  const [commentContent, setCommentContent] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [copiedLinkMessage, setCopiedLinkMessage] = useState<string | null>(null);

  // Categories list
  const categories = [
    { id: 'all', label: t.blogFilterAll },
    { id: 'cheminement-paranges', label: t.blogFilterJourney },
    { id: 'psychologie-trauma', label: t.blogFilterPsychology },
    { id: 'societe-et-culture', label: t.blogFilterSociety },
    { id: 'papas-paranges', label: t.blogFilterFathers },
    { id: 'fratrie-et-apres', label: t.blogFilterSiblings }
  ];

  const safePosts = Array.isArray(posts) ? posts : [];
  const safeComments = Array.isArray(comments) ? comments : [];

  const activePost = useMemo(() => {
    return safePosts.find(p => p.id === selectedPostId) || null;
  }, [safePosts, selectedPostId]);

  const approvedCommentsForActivePost = useMemo(() => {
    if (!activePost) return [];
    const sourceComments = safeComments.length > 0 
      ? safeComments 
      : (Array.isArray(activePost.comments) ? activePost.comments : []);
    return sourceComments.filter(c => (c.postId ? c.postId === activePost.id : true) && c.status === 'approved');
  }, [safeComments, activePost]);

  const filteredPosts = useMemo(() => {
    return safePosts.filter(post => {
      const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        (post.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.author || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [safePosts, selectedCategory, searchQuery]);

  const handleToggleLike = (postId: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost || !commentAuthor.trim() || !commentContent.trim()) return;

    onAddComment({
      postId: activePost.id,
      postTitle: activePost.title,
      authorName: commentAuthor.trim(),
      authorRole: commentRole,
      content: commentContent.trim()
    });

    setCommentSubmitted(true);
    setCommentAuthor('');
    setCommentContent('');
    setTimeout(() => {
      setCommentSubmitted(false);
    }, 6000);
  };

  const handleShare = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLinkMessage(isEn ? "Link copied to clipboard!" : "Lien de l'article copié dans le presse-papier !");
      setTimeout(() => setCopiedLinkMessage(null), 3500);
    }
  };

  // Render markdown-like structured text
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-4" />;
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl sm:text-2xl font-bold font-serif-accent text-stone-900 mt-8 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-emerald-600 pl-4 py-2 my-4 bg-emerald-50/50 rounded-r-xl italic text-stone-700 text-sm sm:text-base font-serif-accent">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }
      if (trimmed.match(/^[0-9]+\.\s/)) {
        return (
          <p key={idx} className="text-stone-700 text-base leading-relaxed pl-4 my-2">
            <strong className="text-emerald-900">{trimmed.slice(0, 3)}</strong> {trimmed.slice(3)}
          </p>
        );
      }
      if (trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="text-stone-700 text-base leading-relaxed ml-6 list-disc my-1">
            {trimmed.replace('- ', '')}
          </li>
        );
      }
      return (
        <p key={idx} className="text-stone-700 text-base sm:text-lg leading-relaxed mb-4">
          {trimmed}
        </p>
      );
    });
  };

  // DETAIL VIEW (READING A LONG POST)
  if (activePost) {
    const isLiked = likedPosts[activePost.id];
    const totalLikes = (activePost.likesCount || 0) + (isLiked ? 1 : 0);

    return (
      <div className="min-h-screen bg-[#faf9f6] py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <button
            onClick={() => {
              setSelectedPostId(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-emerald-800 hover:border-emerald-300 text-xs sm:text-sm font-semibold transition-all shadow-2xs mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToBlog}</span>
          </button>

          {/* Article Header */}
          <article className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 md:p-12 mb-10 overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {(isEn && activePost.categoryLabelEn) ? activePost.categoryLabelEn : activePost.categoryLabel}
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {(isEn && activePost.readTimeEn) ? activePost.readTimeEn : activePost.readTime}
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {activePost.publishedAt}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif-accent text-stone-900 tracking-tight leading-snug mb-6">
              {(isEn && activePost.titleEn) ? activePost.titleEn : activePost.title}
            </h1>

            {/* Author box */}
            <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-y border-stone-100 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold font-serif-accent text-lg shadow-2xs">
                  {activePost.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">{activePost.author}</div>
                  <div className="text-xs text-stone-500">
                    {(isEn && activePost.authorRoleEn) ? activePost.authorRoleEn : activePost.authorRole}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleLike(activePost.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isLiked 
                      ? 'bg-rose-50 border-rose-200 text-rose-600' 
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
                  <span>{totalLikes} {isEn ? 'Gratitudes' : 'Reconnaissances'}</span>
                </button>

                <button
                  onClick={() => handleShare(activePost)}
                  className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
                  title={isEn ? "Share this article" : "Partager cet article"}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cover Image if available */}
            {activePost.coverImageUrl && (
              <div className="rounded-2xl overflow-hidden mb-8 max-h-[380px] w-full border border-stone-200">
                <img 
                  src={activePost.coverImageUrl} 
                  alt={(isEn && activePost.titleEn) ? activePost.titleEn : activePost.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Excerpt Lead */}
            <div className="text-base sm:text-lg text-emerald-950 font-medium bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/60 mb-8 leading-relaxed">
              {(isEn && activePost.excerptEn) ? activePost.excerptEn : activePost.excerpt}
            </div>

            {/* In-depth content body */}
            <div className="article-body">
              {renderFormattedContent((isEn && activePost.contentEn) ? activePost.contentEn : activePost.content)}
            </div>

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-stone-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-stone-500 flex items-center gap-1 mr-2">
                <Tag className="w-3.5 h-3.5" />
                Tags :
              </span>
              {activePost.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Supportive Callout */}
            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-sm font-bold font-serif-accent">
                  {isEn ? "Need to talk to someone who understands?" : "Ce texte résonne avec votre histoire ?"}
                </div>
                <div className="text-xs text-emerald-200">
                  {isEn ? "Our clinical team offers free, compassionate listening sessions." : "Notre équipe de psychologues et paranges bénévoles est à votre écoute 7j/7."}
                </div>
              </div>
              {onOpenConsultationModal && (
                <button
                  onClick={onOpenConsultationModal}
                  className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shrink-0 shadow-sm cursor-pointer"
                >
                  {isEn ? "Speak with an Advisor" : "Parler à un écoutant"}
                </button>
              )}
            </div>
          </article>

          {/* COMMENTS & DISCUSSION SECTION */}
          <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif-accent text-stone-900">
                  {t.commentsHeading}
                </h2>
                <p className="text-xs text-stone-500">
                  {approvedCommentsForActivePost.length} {isEn ? 'approved tribute(s)' : 'témoignage(s) approuvé(s)'}
                </p>
              </div>
            </div>

            {/* Approved comments list */}
            {approvedCommentsForActivePost.length === 0 ? (
              <div className="py-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 p-6 mb-8 text-xs text-stone-500">
                {t.noCommentsYet}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {approvedCommentsForActivePost.map((c) => (
                  <div 
                    key={c.id} 
                    className="p-4 sm:p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{c.authorName}</span>
                        {c.authorRole && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium">
                            {c.authorRole === 'parange' ? 'Parent / Parange' :
                             c.authorRole === 'proche' ? 'Proche' :
                             c.authorRole === 'soignant' ? 'Soignant' : 'Sympathisant'}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400">{c.createdAt}</span>
                    </div>

                    <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {(isEn && c.contentEn) ? c.contentEn : c.content}
                    </p>

                    {/* Official team reply */}
                    {c.adminReply && (
                      <div className="mt-3 ml-3 sm:ml-6 p-3 sm:p-4 rounded-xl bg-emerald-100/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t.adminReplyLabel}</span>
                        </div>
                        <p className="text-emerald-900/90 leading-relaxed italic">
                          « {(isEn && c.adminReplyEn) ? c.adminReplyEn : c.adminReply} »
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Comment Form */}
            <div className="pt-6 border-t border-stone-200/80">
              <h3 className="text-base sm:text-lg font-bold font-serif-accent text-stone-900 mb-2">
                {t.leaveAComment}
              </h3>
              
              <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50/80 p-3 rounded-xl border border-amber-200 mb-4">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{t.commentModerationNotice}</span>
              </div>

              {commentSubmitted ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold mb-0.5">{isEn ? 'Thank you!' : 'Commentaire transmis !'}</div>
                    <div>{t.commentSubmittedSuccess}</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {t.commentAuthorName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        placeholder="Ex: Awa, Paul ou Anonyme"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-emerald-600 focus:outline-hidden bg-stone-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {t.commentRoleLabel}
                      </label>
                      <select
                        value={commentRole}
                        onChange={(e) => setCommentRole(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-emerald-600 focus:outline-hidden bg-stone-50/50 cursor-pointer"
                      >
                        <option value="parange">{isEn ? 'Bereaved Parent (Parange)' : 'Parent endeuillé (Parange)'}</option>
                        <option value="proche">{isEn ? 'Family Member / Relative' : 'Proche / Famille'}</option>
                        <option value="soignant">{isEn ? 'Healthcare Worker / Midwife' : 'Soignant / Sage-femme'}</option>
                        <option value="sympathisant">{isEn ? 'Sympathizer / Volunteer' : 'Sympathisant / Bénévole'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <textarea
                      required
                      rows={3}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder={t.commentContentPlaceholder}
                      className="w-full p-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-emerald-600 focus:outline-hidden bg-stone-50/50 leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.submitCommentBtn}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </section>

        </div>
      </div>
    );
  }

  // LIST VIEW (BLOG DIRECTORY)
  return (
    <div className="min-h-screen bg-[#faf9f6] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.blogHeaderBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-accent text-stone-900 tracking-tight">
            {t.blogTitle}
          </h1>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {t.blogSubtitle}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-4 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search in articles, tags, authors..." : "Rechercher par mot-clé, auteur, tag..."}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            {/* Categories pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-800 text-white shadow-2xs font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-stone-200 p-12 text-center text-stone-500">
            <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <div className="font-semibold text-stone-700 mb-1">
              {isEn ? "No articles found matching this filter." : "Aucun article trouvé pour ces critères."}
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100"
            >
              {isEn ? "Reset filters" : "Réinitialiser les filtres"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const postComments = safeComments.length > 0
                ? safeComments
                : (Array.isArray(post.comments) ? post.comments : []);
              const approvedCount = postComments.filter(c => (c.postId ? c.postId === post.id : true) && c.status === 'approved').length;

              return (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedPostId(post.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Cover thumbnail */}
                    {post.coverImageUrl && (
                      <div className="h-48 w-full overflow-hidden bg-stone-100 relative">
                        <img 
                          src={post.coverImageUrl} 
                          alt={(isEn && post.titleEn) ? post.titleEn : post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-semibold">
                          {(isEn && post.categoryLabelEn) ? post.categoryLabelEn : post.categoryLabel}
                        </span>
                      </div>
                    )}

                    <div className="p-6 sm:p-7">
                      <div className="flex items-center gap-2 text-xs text-stone-500 mb-2.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          {(isEn && post.readTimeEn) ? post.readTimeEn : post.readTime}
                        </span>
                        <span>•</span>
                        <span>{post.publishedAt}</span>
                      </div>

                      <h3 className="text-xl font-bold font-serif-accent text-stone-900 group-hover:text-emerald-900 transition-colors line-clamp-2 mb-3">
                        {(isEn && post.titleEn) ? post.titleEn : post.title}
                      </h3>

                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
                        {(isEn && post.excerptEn) ? post.excerptEn : post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card bottom footer */}
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-stone-700">
                      <User className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="font-medium truncate max-w-[140px]">{post.author}</span>
                    </div>

                    <div className="flex items-center gap-3 text-stone-500">
                      {approvedCount > 0 && (
                        <span className="flex items-center gap-1 text-[11px]">
                          <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                          {approvedCount}
                        </span>
                      )}
                      <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        <span>{isEn ? 'Read' : 'Lire'}</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
