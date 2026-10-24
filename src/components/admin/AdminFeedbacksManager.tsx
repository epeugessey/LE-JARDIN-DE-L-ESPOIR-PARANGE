import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Trash2, 
  MessageSquare, 
  User, 
  MapPin, 
  Sparkles, 
  Check, 
  Phone, 
  HelpCircle,
  Download,
  AlertTriangle
} from 'lucide-react';
import { ConsultationFeedback } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface AdminFeedbacksManagerProps {
  feedbacks: ConsultationFeedback[];
  onUpdateFeedbackStatus: (id: string, status: 'nouveau' | 'lu' | 'traite') => void;
  onDeleteFeedback: (id: string) => void;
  onAddTestFeedback?: () => void;
}

export const AdminFeedbacksManager: React.FC<AdminFeedbacksManagerProps> = ({
  feedbacks,
  onUpdateFeedbackStatus,
  onDeleteFeedback,
  onAddTestFeedback
}) => {
  const { isEn } = useLanguage();
  const [filterRating, setFilterRating] = useState<'all' | '5' | '4' | 'low'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'nouveau' | 'traite'>('all');
  const [filterSessionType, setFilterSessionType] = useState<string>('all');

  const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : [];

  // Statistics calculation
  const totalCount = safeFeedbacks.length;
  const averageOverall = totalCount > 0
    ? (safeFeedbacks.reduce((acc, f) => acc + (f.overallRating || 5), 0) / totalCount).toFixed(2)
    : '5.00';

  const averageEmpathy = totalCount > 0
    ? (safeFeedbacks.reduce((acc, f) => acc + (f.listeningEmpathy || 5), 0) / totalCount).toFixed(1)
    : '5.0';

  const averageSpeed = totalCount > 0
    ? (safeFeedbacks.reduce((acc, f) => acc + (f.responseSpeed || 5), 0) / totalCount).toFixed(1)
    : '4.8';

  const averageRelief = totalCount > 0
    ? (safeFeedbacks.reduce((acc, f) => acc + (f.reliefAndGuidance || 5), 0) / totalCount).toFixed(1)
    : '4.9';

  const recommendCount = safeFeedbacks.filter(f => f.wouldRecommend).length;
  const recommendPercent = totalCount > 0 ? Math.round((recommendCount / totalCount) * 100) : 100;
  const unhandledCount = safeFeedbacks.filter(f => f.status === 'nouveau').length;

  // Filtered feedbacks
  const filteredFeedbacks = safeFeedbacks.filter(f => {
    if (filterStatus !== 'all' && f.status !== filterStatus) return false;
    if (filterSessionType !== 'all' && f.sessionType !== filterSessionType) return false;
    if (filterRating === '5' && f.overallRating !== 5) return false;
    if (filterRating === '4' && f.overallRating !== 4) return false;
    if (filterRating === 'low' && f.overallRating > 3) return false;
    return true;
  });

  const handleExportFeedbacks = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(safeFeedbacks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rapport-qualite-ecoute-jde-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Assurance Qualité & Supervision Écoute</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Avis & Retours Post-Consultation ({totalCount})
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Évaluations et témoignages transmis par les familles après un appel, un tchat d'urgence ou un entretien solidaire.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onAddTestFeedback && (
            <button
              onClick={onAddTestFeedback}
              className="px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              + Simuler un avis
            </button>
          )}
          <button
            onClick={handleExportFeedbacks}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Exporter Rapport (JSON)</span>
          </button>
        </div>
      </div>

      {/* KPI Dashboard Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Note Globale */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-200/80">
          <span className="text-[11px] font-extrabold uppercase text-amber-900 block tracking-wider">
            Note Moyenne
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-serif font-bold text-stone-900">{averageOverall}</span>
            <span className="text-xs text-stone-500">/ 5</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-amber-500">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-500" />
            ))}
          </div>
        </div>

        {/* Card 2: Taux de Recommandation */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="text-[11px] font-extrabold uppercase text-emerald-900 block tracking-wider">
            Recommandation
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-serif font-bold text-emerald-950">{recommendPercent}%</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block mt-1">
            {recommendCount} familles recommandent l'écoute
          </span>
        </div>

        {/* Card 3: Empathie & Bienveillance */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <span className="text-[11px] font-extrabold uppercase text-stone-500 block tracking-wider">
            Empathie & Écoute
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-serif font-bold text-stone-900">{averageEmpathy}</span>
            <span className="text-xs text-stone-500">/ 5</span>
          </div>
          <span className="text-[11px] text-stone-500 font-medium block mt-1">
            Chaleur sans jugement
          </span>
        </div>

        {/* Card 4: Rapidité */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <span className="text-[11px] font-extrabold uppercase text-stone-500 block tracking-wider">
            Rapidité Prise Contact
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-serif font-bold text-stone-900">{averageSpeed}</span>
            <span className="text-xs text-stone-500">/ 5</span>
          </div>
          <span className="text-[11px] text-stone-500 font-medium block mt-1">
            Réactivité de la ligne
          </span>
        </div>

        {/* Card 5: Soulagement & Clarté */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <span className="text-[11px] font-extrabold uppercase text-stone-500 block tracking-wider">
            Soulagement Apporté
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-serif font-bold text-stone-900">{averageRelief}</span>
            <span className="text-xs text-stone-500">/ 5</span>
          </div>
          <span className="text-[11px] text-stone-500 font-medium block mt-1">
            Orientation & Conseils
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-stone-100/90 rounded-2xl border border-stone-200 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-stone-500 font-semibold px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filtrer :
          </span>

          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            Tous ({totalCount})
          </button>

          <button
            onClick={() => setFilterStatus('nouveau')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterStatus === 'nouveau'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            Nouveaux avis ({unhandledCount})
          </button>

          <button
            onClick={() => setFilterStatus('traite')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterStatus === 'traite'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            Pris en compte
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Rating filter */}
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="all">Toutes les notes</option>
            <option value="5">5 Étoiles uniquement</option>
            <option value="4">4 Étoiles</option>
            <option value="low">1 à 3 Étoiles (Alertes)</option>
          </select>

          {/* Session type filter */}
          <select
            value={filterSessionType}
            onChange={(e) => setFilterSessionType(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="all">Tous types de sessions</option>
            <option value="telephone">Permanence Téléphonique</option>
            <option value="chat_direct">Tchat direct</option>
            <option value="presentiel">Présentiel</option>
            <option value="visio">Visio</option>
          </select>
        </div>
      </div>

      {/* Feedbacks Grid / List */}
      {filteredFeedbacks.length === 0 ? (
        <div className="py-12 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-3">
          <MessageSquare className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-sm font-bold text-stone-700">Aucun retour d'expérience ne correspond aux critères</h3>
          <p className="text-xs text-stone-500">Essayez de réinitialiser vos filtres pour visualiser l'ensemble des évaluations reçues.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map((item) => {
            const isNew = item.status === 'nouveau';
            return (
              <div 
                key={item.id}
                className={`p-5 rounded-2xl border transition-all duration-200 bg-white ${
                  isNew 
                    ? 'border-amber-300 shadow-sm ring-1 ring-amber-300/60' 
                    : 'border-stone-200 shadow-2xs hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${
                            star <= item.overallRating 
                              ? 'fill-amber-400 text-amber-500' 
                              : 'text-stone-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-stone-900">
                      {item.overallRating}/5
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                      {item.sessionTypeLabel}
                    </span>
                    {isNew && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-extrabold uppercase animate-pulse">
                        Nouveau
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.dateFormatted || item.timestamp.slice(0, 10)}</span>
                  </div>
                </div>

                {/* Body details */}
                <div className="py-3.5 space-y-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                    <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                      <User className="w-3.5 h-3.5 text-stone-500" />
                      <span>{item.isAnonymous ? 'Anonyme' : (item.respondentName || 'Famille')}</span>
                      <span className="text-stone-400 font-normal">({item.respondentRoleLabel})</span>
                    </div>

                    {item.respondentCity && (
                      <div className="flex items-center gap-1 text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{item.respondentCity}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <ThumbsUp className={`w-3.5 h-3.5 ${item.wouldRecommend ? 'text-emerald-600' : 'text-stone-400'}`} />
                      <span className={item.wouldRecommend ? 'text-emerald-700 font-medium' : 'text-stone-500'}>
                        {item.wouldRecommend ? 'Recommande cette permanence' : 'Recommandation réservée'}
                      </span>
                    </div>
                  </div>

                  {/* Sub-ratings */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-700 font-medium">
                    <div>
                      <span className="text-stone-500 block">Bienveillance & Écoute :</span>
                      <strong className="text-emerald-800">{item.listeningEmpathy}/5</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Rapidité de contact :</span>
                      <strong className="text-emerald-800">{item.responseSpeed}/5</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Soulagement & Utilité :</span>
                      <strong className="text-emerald-800">{item.reliefAndGuidance}/5</strong>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="text-xs text-stone-800 leading-relaxed bg-amber-50/40 p-3 rounded-xl border border-amber-100">
                    <span className="font-semibold text-stone-900 block mb-1">Témoignage & Retour :</span>
                    « {item.feedbackText} »
                  </div>

                  {/* Suggestions */}
                  {item.improvementSuggestion && (
                    <div className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-start gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-900">Suggestion pour l'administration : </span>
                        <span>{item.improvementSuggestion}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {item.status !== 'traite' ? (
                      <button
                        onClick={() => onUpdateFeedbackStatus(item.id, 'traite')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Marquer comme pris en compte</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Traité par l'administration</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Voulez-vous supprimer définitivement cette évaluation ?')) {
                        onDeleteFeedback(item.id);
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Supprimer ce retour"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
