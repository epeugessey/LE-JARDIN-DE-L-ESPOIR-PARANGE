import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Heart, 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  Filter, 
  Send, 
  ArrowLeft, 
  Sparkles, 
  UserCheck, 
  Clock, 
  Eye, 
  ThumbsUp, 
  AlertCircle,
  X,
  Share2
} from 'lucide-react';
import { ForumCategory, ForumTopic, ForumReply } from '../types';
import { FORUM_CATEGORIES } from '../data/forumData';
import { useLanguage } from '../context/LanguageContext';

interface ForumViewProps {
  topics: ForumTopic[];
  onAddTopic: (topic: ForumTopic) => void;
  onAddReply: (topicId: string, reply: ForumReply) => void;
  onOpenConsultationModal: () => void;
}

export const ForumView: React.FC<ForumViewProps> = ({
  topics,
  onAddTopic,
  onAddReply,
  onOpenConsultationModal
}) => {
  const { language, isEn } = useLanguage();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState(false);

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'maman-parange':
        return isEn ? 'Grieving Mother' : 'Maman Parange';
      case 'papa-parange':
        return isEn ? 'Grieving Father' : 'Papa Parange';
      case 'fratrie':
        return isEn ? 'Grieving Sibling' : 'Fratrie endeuillée';
      case 'psychologue':
        return isEn ? 'Psychologist JDE' : 'Psychologue JDE';
      case 'benevole':
        return isEn ? 'JDE Care Team' : 'Équipe JDE';
      default:
        return isEn ? 'Bereaved Parent' : 'Parent endeuillé';
    }
  };

  // New topic form state
  const [newTopicForm, setNewTopicForm] = useState({
    title: '',
    categoryId: 'premiers-pas',
    authorName: '',
    authorRole: 'maman-parange' as 'maman-parange' | 'papa-parange' | 'fratrie' | 'parange',
    content: ''
  });

  // Reply form state
  const [replyForm, setReplyForm] = useState({
    authorName: '',
    authorRole: 'maman-parange' as 'maman-parange' | 'papa-parange' | 'fratrie' | 'parange',
    content: ''
  });

  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationBanner(msg);
    setTimeout(() => setNotificationBanner(null), 6000);
  };

  // Filter approved topics for visitors
  const approvedTopics = useMemo(() => {
    return topics.filter(t => t.status === 'approved');
  }, [topics]);

  // Filtered topics based on category and search query
  const filteredTopics = useMemo(() => {
    return approvedTopics.filter(topic => {
      const matchesCat = selectedCategoryId === 'all' || topic.categoryId === selectedCategoryId;
      const titleVal = (isEn && topic.titleEn ? topic.titleEn : topic.title) || '';
      const contentVal = (isEn && topic.contentEn ? topic.contentEn : topic.content) || '';
      const matchesSearch = 
        titleVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contentVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [approvedTopics, selectedCategoryId, searchQuery, isEn]);

  // Current active topic
  const activeTopic = useMemo(() => {
    if (!activeTopicId) return null;
    return topics.find(t => t.id === activeTopicId) || null;
  }, [topics, activeTopicId]);

  // Handle new topic submit
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicForm.title.trim() || !newTopicForm.content.trim() || !newTopicForm.authorName.trim()) {
      showNotification(isEn ? 'Please fill in all required fields.' : 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const newTopic: ForumTopic = {
      id: `top-${Date.now()}`,
      categoryId: newTopicForm.categoryId,
      title: newTopicForm.title.trim(),
      content: newTopicForm.content.trim(),
      authorName: newTopicForm.authorName.trim(),
      authorRole: newTopicForm.authorRole,
      createdAt: isEn ? 'Just now' : 'À l\'instant',
      status: 'pending', // Requires admin moderation
      viewsCount: 1,
      replies: []
    };

    onAddTopic(newTopic);
    setIsNewTopicModalOpen(false);
    setNewTopicForm({
      title: '',
      categoryId: 'premiers-pas',
      authorName: '',
      authorRole: 'maman-parange',
      content: ''
    });

    showNotification(
      isEn
        ? "Your discussion topic has been submitted! To protect our safe sanctuary, it will appear once approved by our moderation team."
        : "Votre sujet a bien été déposé ! Pour la sécurité et l'apaisement de tous, il apparaîtra après validation bienveillante par l'équipe de modération."
    );
  };

  // Handle reply submit
  const handleCreateReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopic || !replyForm.content.trim() || !replyForm.authorName.trim()) {
      showNotification(isEn ? 'Please enter your name and compassionate reply.' : 'Veuillez renseigner votre prénom et votre message.');
      return;
    }

    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      topicId: activeTopic.id,
      authorName: replyForm.authorName.trim(),
      authorRole: replyForm.authorRole,
      content: replyForm.content.trim(),
      createdAt: isEn ? 'Just now' : 'À l\'instant',
      status: 'pending', // Moderated
      likesCount: 0
    };

    onAddReply(activeTopic.id, newReply);
    setReplyForm({
      authorName: '',
      authorRole: 'maman-parange',
      content: ''
    });

    showNotification(
      isEn
        ? "Your reply was submitted gently. It will be published right after moderation review."
        : "Votre réponse a été enregistrée avec tendresse. Elle sera visible dès sa relecture par nos modérateurs."
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-100 py-10 sm:py-16">
      
      {/* Watermark Logo Background */}
      <div 
        className="absolute right-0 top-20 w-96 h-96 bg-contain bg-no-repeat opacity-5 pointer-events-none"
        style={{ backgroundImage: "url('/logo-circular.jpg')" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Global Notification Banner */}
        {notificationBanner && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-md animate-in fade-in slide-in-from-top-2">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
            <span className="flex-1">{notificationBanner}</span>
            <button 
              onClick={() => setNotificationBanner(null)}
              className="p-1 text-amber-600 hover:text-amber-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* DETAIL TOPIC VIEW */}
        {activeTopic ? (
          <div className="space-y-6">
            <button
              onClick={() => setActiveTopicId(null)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-stone-200 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isEn ? 'Back to Forum topics' : 'Retour aux thématiques du Forum'}</span>
            </button>

            {/* Main Topic Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    {(() => {
                      const cat = FORUM_CATEGORIES.find(c => c.id === activeTopic.categoryId);
                      return (isEn && cat?.nameEn) ? cat.nameEn : (cat?.name || (isEn ? 'Exchange' : 'Échange'));
                    })()}
                  </span>
                  <span className="text-xs text-stone-400">• {activeTopic.createdAt}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{activeTopic.viewsCount} {isEn ? 'views' : 'vues'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{(activeTopic.replies || []).filter(r => r.status === 'approved').length} {isEn ? 'replies' : 'réponses'}</span>
                  </span>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-base shadow-2xs">
                  {activeTopic.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">{activeTopic.authorName}</h4>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium">
                    {getRoleLabel(activeTopic.authorRole)}
                  </span>
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-4">
                <h1 className="text-xl sm:text-2xl font-bold font-serif-accent text-stone-900 leading-snug">
                  {(isEn && activeTopic.titleEn) ? activeTopic.titleEn : activeTopic.title}
                </h1>
                <div className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50/50 p-5 rounded-2xl border border-stone-100">
                  {(isEn && activeTopic.contentEn) ? activeTopic.contentEn : activeTopic.content}
                </div>
              </div>
            </div>

            {/* Approved Replies Section */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold font-serif-accent text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                <span>
                  {isEn ? 'Community Replies & Support' : 'Réponses & Témoignages des Paranges'} 
                  {' '}({(activeTopic.replies || []).filter(r => r.status === 'approved').length})
                </span>
              </h3>

              {((activeTopic.replies || []).filter(r => r.status === 'approved')).length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-stone-200 text-stone-500">
                  <p className="text-sm font-semibold">{isEn ? 'No replies yet.' : 'Aucune réponse pour le moment.'}</p>
                  <p className="text-xs text-stone-400 mt-1">
                    {isEn ? 'Be the first parent to share comforting and supportive words.' : 'Soyez le premier parent à déposer quelques mots de soutien bienveillant.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(activeTopic.replies || [])
                    .filter(r => r.status === 'approved')
                    .map((reply) => (
                      <div 
                        key={reply.id}
                        className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs">
                              {reply.authorName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-xs sm:text-sm font-bold text-stone-900">{reply.authorName}</span>
                              {reply.authorRole && (
                                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium">
                                  {getRoleLabel(reply.authorRole)}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-[11px] text-stone-400">{reply.createdAt}</span>
                        </div>

                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                          {(isEn && reply.contentEn) ? reply.contentEn : reply.content}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Reply Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm sm:text-base font-bold text-stone-900">
                  {isEn ? 'Share compassionate support or your own journey' : 'Déposer un mot de soutien ou partager votre vécu'}
                </h4>
              </div>

              <p className="text-xs text-stone-500">
                {isEn 
                  ? 'Each reply is reviewed gently by our moderation team to ensure a peaceful and comforting space for all.' 
                  : 'Chaque réponse est soumise à modération bienveillante pour garantir un climat de sérénité absolue.'}
              </p>

              <form onSubmit={handleCreateReply} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isEn ? 'Your Name or Pseudonym *' : 'Votre prénom ou pseudonyme *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={replyForm.authorName}
                      onChange={(e) => setReplyForm({ ...replyForm, authorName: e.target.value })}
                      placeholder={isEn ? 'e.g. Marie or Kouamé' : 'Ex: Christiane ou Une maman d\'Abidjan'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isEn ? 'Your Profile' : 'Votre situation'}
                    </label>
                    <select
                      value={replyForm.authorRole}
                      onChange={(e) => setReplyForm({ ...replyForm, authorRole: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                    >
                      <option value="maman-parange">{isEn ? 'Grieving Mother' : 'Maman Parange'}</option>
                      <option value="papa-parange">{isEn ? 'Grieving Father' : 'Papa Parange'}</option>
                      <option value="fratrie">{isEn ? 'Grieving Sibling' : 'Fratrie endeuillée'}</option>
                      <option value="parange">{isEn ? 'Bereaved Parent' : 'Parent endeuillé'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isEn ? 'Your Compassionate Words or Answer *' : 'Votre message de réconfort ou réponse *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={replyForm.content}
                    onChange={(e) => setReplyForm({ ...replyForm, content: e.target.value })}
                    placeholder={isEn ? 'Write from the heart. Sincere and gentle words bring deep comfort...' : 'Écrivez avec le cœur. Les mots sincères et doux sont les plus précieux...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Submit reply' : 'Envoyer ma réponse'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* FORUM TOPICS LIST VIEW */
          <div className="space-y-8">
            
            {/* Forum Header Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div 
                className="absolute right-0 bottom-0 w-80 h-80 bg-contain bg-no-repeat opacity-10 pointer-events-none"
                style={{ backgroundImage: "url('/logo-circular.jpg')" }}
              />

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-extrabold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-950" />
                  <span>{language === 'fr' ? 'Espace Sanctuarisé & Modéré' : 'Moderated & Safe Sanctuary'}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif-accent leading-tight">
                  {language === 'fr' 
                    ? 'Le Forum des Paranges de Côte d\'Ivoire' 
                    : 'Bereaved Parents Discussion Forum'}
                </h1>

                <p className="text-xs sm:text-sm md:text-base text-stone-200 leading-relaxed">
                  {language === 'fr'
                    ? 'Un espace de parole intime, protégé et solidaire pour déposer vos interrogations, rompre l\'isolement et trouver des échos fraternels auprès de ceux qui traversent la même épreuve.'
                    : 'An intimate, protected, and caring space to share questions, break loneliness, and connect with parents walking the same path.'}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsNewTopicModalOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 group"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{isEn ? 'Start a New Discussion' : 'Ouvrir une nouvelle discussion'}</span>
                  </button>

                  <a
                    href="https://www.facebook.com/groups/lejardindelespoirparange/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-105"
                  >
                    <span className="w-4 h-4 rounded-full bg-white text-[#1877F2] flex items-center justify-center font-black text-[10px] shrink-0">f</span>
                    <span>{isEn ? 'Join Facebook Group' : 'Groupe Facebook d\'Entraide'}</span>
                  </a>

                  <button
                    onClick={onOpenConsultationModal}
                    className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4 text-rose-300" />
                    <span>{isEn ? 'Need Individual Counseling' : 'Besoin d\'écoute individuelle'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Thematic Category Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <button
                onClick={() => setSelectedCategoryId('all')}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedCategoryId === 'all'
                    ? 'bg-emerald-800 text-white border-emerald-700 shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedCategoryId === 'all' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {approvedTopics.length}
                  </span>
                </div>
                <span className="text-xs font-bold leading-snug">{isEn ? 'All Discussions' : 'Toutes les discussions'}</span>
              </button>

              {FORUM_CATEGORIES.map(cat => {
                const isSelected = selectedCategoryId === cat.id;
                const count = approvedTopics.filter(t => t.categoryId === cat.id).length;
                const catName = (isEn && cat.nameEn) ? cat.nameEn : cat.name;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-700 shadow-xs'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {count}
                      </span>
                    </div>
                    <span className="text-xs font-bold leading-snug">{catName}</span>
                  </button>
                );
              })}
            </div>

            {/* Search and Action Bar */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? 'Search discussions...' : 'Rechercher une discussion...'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-stone-500 font-medium">
                  {filteredTopics.length} {isEn ? 'discussions' : 'fils de discussion'}
                </span>
                <button
                  onClick={() => setIsNewTopicModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isEn ? 'New Topic' : 'Nouveau Sujet'}</span>
                </button>
              </div>
            </div>

            {/* Topics List */}
            {filteredTopics.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-stone-200 p-8 space-y-3">
                <MessageSquare className="w-12 h-12 mx-auto text-stone-300" />
                <h3 className="text-base font-bold text-stone-800">
                  {isEn ? 'No discussions found' : 'Aucune discussion trouvée'}
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  {isEn
                    ? 'No discussion threads match your search. You can be the first to open a dialogue in this category.'
                    : 'Aucun fil de discussion ne correspond à vos critères. Vous pouvez être le premier à ouvrir le dialogue dans cette catégorie.'}
                </p>
                <button
                  onClick={() => setIsNewTopicModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {isEn ? 'Start a discussion' : 'Ouvrir un fil de discussion'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTopics.map((topic) => {
                  const category = FORUM_CATEGORIES.find(c => c.id === topic.categoryId);
                  const categoryName = (isEn && category?.nameEn) ? category.nameEn : (category?.name || (isEn ? 'General' : 'Général'));
                  const titleDisplay = (isEn && topic.titleEn) ? topic.titleEn : topic.title;
                  const contentDisplay = (isEn && topic.contentEn) ? topic.contentEn : topic.content;
                  const approvedRepliesCount = (topic.replies || []).filter(r => r.status === 'approved').length;

                  return (
                    <div
                      key={topic.id}
                      onClick={() => setActiveTopicId(topic.id)}
                      className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden"
                    >
                      {topic.isPinned && (
                        <div className="absolute top-0 right-8 px-3 py-0.5 bg-amber-400 text-stone-950 font-extrabold text-[10px] uppercase rounded-b-lg shadow-xs flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{isEn ? 'Pinned' : 'Épinglé'}</span>
                        </div>
                      )}

                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700">
                            {categoryName}
                          </span>
                          <span className="text-xs text-stone-400">• {isEn ? 'By' : 'Par'} {topic.authorName}</span>
                          <span className="text-xs text-stone-400">• {topic.createdAt}</span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold font-serif-accent text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                          {titleDisplay}
                        </h3>

                        <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                          {contentDisplay}
                        </p>
                      </div>

                      {/* Stats & CTA */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1.5 shrink-0 border-t sm:border-t-0 sm:border-l border-stone-100 pt-3 sm:pt-0 sm:pl-6">
                        <div className="flex items-center gap-3 text-xs text-stone-500">
                          <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{approvedRepliesCount}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-stone-400" />
                            <span>{topic.viewsCount}</span>
                          </span>
                        </div>

                        <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          <span>{isEn ? 'Read thread' : 'Lire l\'échange'}</span>
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>

      {/* NEW TOPIC MODAL */}
      {isNewTopicModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-stone-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Compassionate & Moderated Space' : 'Espace Bienveillant & Modéré'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-serif-accent text-stone-900">
                  {isEn ? 'Start a New Discussion Thread' : 'Ouvrir un nouveau sujet de discussion'}
                </h3>
              </div>
              <button
                onClick={() => setIsNewTopicModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isEn ? 'Thematic Category *' : 'Catégorie thématique *'}
                </label>
                <select
                  value={newTopicForm.categoryId}
                  onChange={(e) => setNewTopicForm({ ...newTopicForm, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                >
                  {FORUM_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {(isEn && cat.nameEn) ? cat.nameEn : cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isEn ? 'Topic Title *' : 'Titre de votre sujet d\'échange *'}
                </label>
                <input
                  type="text"
                  required
                  value={newTopicForm.title}
                  onChange={(e) => setNewTopicForm({ ...newTopicForm, title: e.target.value })}
                  placeholder={isEn ? 'e.g. How to find the strength to face the quiet home?' : 'Ex: Comment trouver la force de ranger ses petites affaires ?'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isEn ? 'Name or Pseudonym *' : 'Prénom ou pseudonyme *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTopicForm.authorName}
                    onChange={(e) => setNewTopicForm({ ...newTopicForm, authorName: e.target.value })}
                    placeholder={isEn ? 'e.g. Estelle or Grieving Mom' : 'Ex: Estelle ou Maman de Grâce'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isEn ? 'Your Profile' : 'Votre lien'}
                  </label>
                  <select
                    value={newTopicForm.authorRole}
                    onChange={(e) => setNewTopicForm({ ...newTopicForm, authorRole: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                  >
                    <option value="maman-parange">{isEn ? 'Grieving Mother' : 'Maman Parange'}</option>
                    <option value="papa-parange">{isEn ? 'Grieving Father' : 'Papa Parange'}</option>
                    <option value="fratrie">{isEn ? 'Grieving Sibling' : 'Fratrie'}</option>
                    <option value="parange">{isEn ? 'Bereaved Parent' : 'Parent endeuillé'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isEn ? 'Your Message or Question *' : 'Votre message ou question *'}
                </label>
                <textarea
                  rows={5}
                  required
                  value={newTopicForm.content}
                  onChange={(e) => setNewTopicForm({ ...newTopicForm, content: e.target.value })}
                  placeholder={isEn ? 'Freely express your feelings, questions, or doubts. Our community welcomes you without any judgment...' : 'Partagez librement vos ressentis, vos doutes ou vos questions. Notre communauté est là pour vous accueillir sans jugement...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                ℹ️ <strong>{isEn ? 'Golden Moderation Rule' : 'Règle d\'or de modération'}</strong> : {isEn ? 'To ensure an atmosphere devoid of aggressive or guilt-inducing statements, new topics are reviewed kindly by our moderators prior to public display.' : 'Afin de garantir un espace pur et dénué d\'agressivité ou de jugements culpabilisants, les nouveaux sujets sont relus par nos modérateurs avant affichage public.'}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTopicModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isEn ? 'Submit Discussion' : 'Soumettre mon sujet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
