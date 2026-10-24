import React, { useState } from 'react';
import { 
  Quote, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Clock, 
  Baby, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  Search, 
  Plus, 
  Flame, 
  Heart,
  Eye
} from 'lucide-react';
import { ParangeTestimony } from '../../types';

interface AdminTestimoniesManagerProps {
  testimonies: ParangeTestimony[];
  onApproveTestimony: (id: string) => void;
  onRejectTestimony: (id: string) => void;
  onDeleteTestimony: (id: string) => void;
  onAddTestimony?: (testimony: ParangeTestimony) => void;
}

export const AdminTestimoniesManager: React.FC<AdminTestimoniesManagerProps> = ({
  testimonies = [],
  onApproveTestimony,
  onRejectTestimony,
  onDeleteTestimony,
  onAddTestimony
}) => {
  const [filter, setFilter] = useState<'all' | 'en_attente' | 'approuve' | 'rejete'>('all');
  const [search, setSearch] = useState('');
  const [selectedStory, setSelectedStory] = useState<ParangeTestimony | null>(null);

  const pendingCount = testimonies.filter(t => t.status === 'en_attente').length;
  const approvedCount = testimonies.filter(t => t.status === 'approuve').length;
  const rejectedCount = testimonies.filter(t => t.status === 'rejete').length;

  const filteredTestimonies = testimonies.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.story.toLowerCase().includes(search.toLowerCase()) ||
      t.authorName.toLowerCase().includes(search.toLowerCase()) ||
      (t.childName && t.childName.toLowerCase().includes(search.toLowerCase())) ||
      (t.city && t.city.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleSimulateNewTestimony = () => {
    if (!onAddTestimony) return;
    const sample: ParangeTestimony = {
      id: `testim-${Date.now()}`,
      authorName: 'Maman de l\'Ange Aya',
      authorRole: 'maman',
      authorRoleLabel: 'Maman Parange',
      childName: 'Aya (28 SA)',
      city: 'Abidjan (Plateau)',
      yearOrDate: new Date().getFullYear().toString(),
      title: 'Témoignage reçu en direct : Transformer la douleur en hommage',
      category: 'Mamans Paranges',
      story: "Je dépose ici quelques mots après 6 mois de larmes. Grâce à la permanence du Jardin de l'Espoir : Parange, je recommence à respirer sans culpabiliser de sourire à nouveau.",
      hopeMessage: 'Gardez espoir, même quand la nuit semble éternelle.',
      status: 'en_attente',
      likesCount: 0,
      candlesLitCount: 0,
      createdAt: 'À l\'instant',
      isAnonymous: false
    };
    onAddTestimony(sample);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-amber-700" />
              Modération Éthique & Bienveillante
            </span>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white animate-pulse">
                {pendingCount} à relire
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-accent text-stone-900 mt-2">
            Récits & Témoignages des Paranges
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Validez, sécurisez et publiez les récits confiés par les familles endeuillées de Côte d'Ivoire.
          </p>
        </div>

        {onAddTestimony && (
          <button
            onClick={handleSimulateNewTestimony}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Simuler un témoignage parange</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Tous ({testimonies.length})
          </button>
          
          <button
            onClick={() => setFilter('en_attente')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filter === 'en_attente'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>En attente ({pendingCount})</span>
          </button>

          <button
            onClick={() => setFilter('approuve')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filter === 'approuve'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Approuvés ({approvedCount})</span>
          </button>

          <button
            onClick={() => setFilter('rejete')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filter === 'rejete'
                ? 'bg-stone-600 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <XCircle className="w-3 h-3" />
            <span>Rejetés ({rejectedCount})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrer auteur, ange, ville..."
            className="w-full pl-8 pr-3 py-1.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Testimonies List */}
      {filteredTestimonies.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-stone-200 text-stone-500 space-y-2">
          <Quote className="w-8 h-8 text-stone-300 mx-auto" />
          <p className="text-sm font-semibold text-stone-700">Aucun récit ne correspond à ce filtre.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTestimonies.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                item.status === 'en_attente'
                  ? 'border-amber-300 ring-1 ring-amber-300/50 shadow-xs'
                  : item.status === 'approuve'
                  ? 'border-stone-200/90 shadow-2xs'
                  : 'border-stone-200 opacity-60 bg-stone-50/50'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm">
                    {item.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">{item.authorName}</span>
                      {item.isAnonymous && (
                        <span className="text-[10px] text-stone-400 italic">(Anonyme)</span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold">
                        {item.authorRoleLabel || item.authorRole}
                      </span>
                      {item.city && (
                        <span className="text-[11px] text-stone-400 flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-stone-400" />
                          {item.city}
                        </span>
                      )}
                    </div>
                    {item.childName && (
                      <div className="text-xs text-amber-800 font-medium flex items-center gap-1 mt-0.5">
                        <Baby className="w-3 h-3 text-amber-700" />
                        <span>En mémoire de : <strong>{item.childName}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    item.status === 'approuve'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : item.status === 'en_attente'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}>
                    {item.status === 'approuve' ? '✓ Publié sur le sanctuaire' :
                     item.status === 'en_attente' ? '⏳ En attente de modération' : '✕ Non publié (Rejeté)'}
                  </span>

                  <span className="text-[11px] text-stone-400">
                    {item.createdAt}
                  </span>
                </div>
              </div>

              {/* Story Body */}
              <div className="py-4 space-y-2">
                <h4 className="text-base font-bold text-stone-900 font-serif-accent">
                  « {item.title} »
                </h4>
                <div className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-100 whitespace-pre-line">
                  {item.story}
                </div>
                {item.hopeMessage && (
                  <p className="text-xs text-emerald-900 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 italic">
                    <strong>Message d'espoir transmis :</strong> « {item.hopeMessage} »
                  </p>
                )}
              </div>

              {/* Moderation Controls */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    {item.candlesLitCount || 0} bougies allumées
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    {item.likesCount || 0} soutiens
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.status !== 'approuve' && (
                    <button
                      onClick={() => onApproveTestimony(item.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approuver & Publier</span>
                    </button>
                  )}

                  {item.status !== 'rejete' && (
                    <button
                      onClick={() => onRejectTestimony(item.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Rejeter</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce témoignage ?')) {
                        onDeleteTestimony(item.id);
                      }
                    }}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Supprimer définitivement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
