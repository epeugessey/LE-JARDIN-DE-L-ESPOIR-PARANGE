import React, { useState, useEffect } from 'react';
import { GardenFlower } from '../types';
import { INITIAL_FLOWERS } from '../data/mockData';
import { Flower2, Sparkles, Flame, Plus, Heart, Filter, Sun, X, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const VirtualGardenView: React.FC = () => {
  const { isEn } = useLanguage();
  const [flowers, setFlowers] = useState<GardenFlower[]>(() => {
    const saved = localStorage.getItem('jardin_espoir_ci_flowers') || localStorage.getItem('jardin_renaissance_ci_flowers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : INITIAL_FLOWERS;
      } catch {
        return INITIAL_FLOWERS;
      }
    }
    return INITIAL_FLOWERS;
  });

  const [selectedFlower, setSelectedFlower] = useState<GardenFlower | null>(null);
  const [isPlantingModalOpen, setIsPlantingModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // New flower form
  const [newAuthor, setNewAuthor] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [newRelationship, setNewRelationship] = useState(isEn ? 'In memory of my child' : 'En souvenir de mon enfant');
  const [newFlowerType, setNewFlowerType] = useState<'tournesol' | 'myosotis' | 'rose' | 'lavande' | 'marguerite' | 'pousse'>('rose');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('jardin_renaissance_ci_flowers', JSON.stringify(flowers));
    localStorage.setItem('jardin_espoir_ci_flowers', JSON.stringify(flowers));
  }, [flowers]);

  const handlePlantFlower = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const colorsMap: Record<string, string> = {
      tournesol: '#F59E0B',
      myosotis: '#3B82F6',
      rose: '#EC4899',
      lavande: '#8B5CF6',
      marguerite: '#10B981',
      pousse: '#14B8A6'
    };

    const newFlower: GardenFlower = {
      id: `ci-flower-${Date.now()}`,
      authorName: isAnonymous 
        ? (isEn ? 'Anonymous Parange' : 'Un Parange anonyme') 
        : (newAuthor.trim() || (isEn ? 'A loving mother / father' : 'Une maman / un papa')),
      isAnonymous,
      relationship: newRelationship,
      flowerType: newFlowerType,
      flowerColor: colorsMap[newFlowerType] || '#10B981',
      message: newMessage.trim(),
      date: isEn ? 'Today' : 'Aujourd\'hui',
      candlesCount: 1,
      userLitCandle: true
    };

    setFlowers([newFlower, ...flowers]);
    setNewMessage('');
    setNewAuthor('');
    setIsPlantingModalOpen(false);
    setSelectedFlower(newFlower);
  };

  const handleLightCandle = (flowerId: string) => {
    setFlowers(prev => prev.map(f => {
      if (f.id === flowerId) {
        const alreadyLit = f.userLitCandle;
        return {
          ...f,
          candlesCount: alreadyLit ? f.candlesCount - 1 : f.candlesCount + 1,
          userLitCandle: !alreadyLit
        };
      }
      return f;
    }));

    if (selectedFlower && selectedFlower.id === flowerId) {
      setSelectedFlower(prev => prev ? {
        ...prev,
        candlesCount: prev.userLitCandle ? prev.candlesCount - 1 : prev.candlesCount + 1,
        userLitCandle: !prev.userLitCandle
      } : null);
    }
  };

  const safeFlowers = Array.isArray(flowers) ? flowers : [];

  const filteredFlowers = safeFlowers.filter(f => {
    if (filterType === 'all') return true;
    const rel = (f.relationship || '').toLowerCase();
    if (filterType === 'enfant') return rel.includes('enfant') || rel.includes('fille') || rel.includes('fils') || rel.includes('child');
    if (filterType === 'perinatal') return rel.includes('périnatal') || rel.includes('in utero') || rel.includes('bébé') || rel.includes('baby');
    if (filterType === 'fratrie') return rel.includes('frère') || rel.includes('soeur') || rel.includes('fratrie') || rel.includes('sibling');
    if (filterType === 'soutien') return rel.includes('solidarité') || rel.includes('proche') || rel.includes('relais') || rel.includes('support');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Intro */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{isEn ? 'National Campaign « 1 Flower for 1 Angel » (#1Flower1Angel)' : 'Campagne Nationale « 1 Fleur pour 1 Ange » (#1Fleur1Ange)'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-stone-900 font-serif-accent tracking-tight">
            {isEn ? 'The Paranges Virtual Memorial Garden' : 'Le Jardin Virtuel des Paranges'}
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            {isEn
              ? 'An intimate, compassionate sanctuary where every grieving mother, father, sibling, and relative can plant a digital flower, light an eternal candle, and leave loving words that will never fade.'
              : 'Un sanctuaire intime et solidaire où chaque maman, chaque papa et chaque frère ou sœur peut semer une fleur numérique, allumer une veilleuse et déposer des mots d\'amour qui ne s\'éteindront jamais.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsPlantingModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span>{isEn ? 'Plant a flower for my Angel' : 'Semer une fleur pour mon Ange'}</span>
            </button>
          </div>
        </div>

        {/* Garden Controls & Filters */}
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-stone-200/80 p-4 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
            <Filter className="w-4 h-4 text-emerald-700" />
            <span>{isEn ? 'Filter tributes:' : 'Filtrer les hommages :'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: 'all', label: isEn ? 'All flowers' : 'Toutes les fleurs' },
              { id: 'enfant', label: isEn ? 'Child loss' : 'Perte d\'un enfant' },
              { id: 'perinatal', label: isEn ? 'Perinatal grief' : 'Deuil périnatal' },
              { id: 'fratrie', label: isEn ? 'Siblings' : 'Fratrie' },
              { id: 'soutien', label: isEn ? 'Messages of support' : 'Messages de soutien' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Flowers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredFlowers.map((flower) => {
            const isLit = flower.userLitCandle;
            return (
              <div
                key={flower.id}
                onClick={() => setSelectedFlower(flower)}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group hover:border-emerald-300 relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: flower.flowerColor }}
                      >
                        <Flower2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 line-clamp-1">
                          {flower.authorName}
                        </div>
                        <div className="text-[11px] text-emerald-800 font-medium line-clamp-1">
                          {flower.relationship}
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] text-stone-400">
                      {flower.date}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed line-clamp-4 pt-1">
                    « {flower.message} »
                  </p>
                </div>

                {/* Candles Bar */}
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLightCandle(flower.id);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isLit 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <Flame className={`w-3.5 h-3.5 ${isLit ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-stone-400'}`} />
                    <span>{flower.candlesCount} {isEn ? (flower.candlesCount > 1 ? 'candles' : 'candle') : `veilleuse${flower.candlesCount > 1 ? 's' : ''}`}</span>
                  </button>

                  <span className="text-xs text-stone-400 group-hover:text-emerald-700 transition-colors">
                    {isEn ? 'Read tribute →' : 'Lire le mot doux →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: View Details */}
        {selectedFlower && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
            <div 
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedFlower.flowerColor }}
                  >
                    <Flower2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900">
                      {selectedFlower.authorName}
                    </h3>
                    <div className="text-xs text-emerald-800 font-medium">
                      {selectedFlower.relationship} • {selectedFlower.date}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedFlower(null)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 text-sm text-stone-800 italic leading-relaxed">
                « {selectedFlower.message} »
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleLightCandle(selectedFlower.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedFlower.userLitCandle
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-700 text-white hover:bg-emerald-800'
                  }`}
                >
                  <Flame className={`w-4 h-4 ${selectedFlower.userLitCandle ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-emerald-200'}`} />
                  <span>
                    {selectedFlower.userLitCandle 
                      ? (isEn ? 'Your candle is lit' : 'Votre veilleuse est allumée') 
                      : (isEn ? 'Light a candle in support' : 'Allumer une veilleuse en soutien')}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedFlower(null)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  {isEn ? 'Close' : 'Fermer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Plant a Flower */}
        {isPlantingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
            <div 
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Flower2 className="w-4 h-4" />
                  <span>{isEn ? 'Plant a flower in Le Jardin de l\'Espoir : Parange' : 'Semer une fleur dans Le Jardin de l\'Espoir : Parange'}</span>
                </div>
                <button
                  onClick={() => setIsPlantingModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePlantFlower} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isEn ? 'Your name or signature' : 'Votre prénom ou signature'}
                  </label>
                  <input
                    type="text"
                    disabled={isAnonymous}
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    placeholder={isAnonymous ? (isEn ? "Anonymous post" : "Publication anonyme") : (isEn ? "E.g.: Mary K., Leo's Mom..." : "Ex: Marie K., Papa d'Ariel...")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 disabled:bg-stone-100"
                  />
                  <div className="mt-1.5 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="anonCheck"
                      checked={isAnonymous}
                      onChange={e => setIsAnonymous(e.target.checked)}
                      className="rounded border-stone-300 text-emerald-700 focus:ring-emerald-600"
                    />
                    <label htmlFor="anonCheck" className="text-[11px] text-stone-500 cursor-pointer">
                      {isEn ? 'Keep my tribute completely anonymous' : 'Garder mon hommage entièrement anonyme'}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isEn ? 'Nature of tribute' : 'Nature de l\'hommage'}
                  </label>
                  <select
                    value={newRelationship}
                    onChange={e => setNewRelationship(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value={isEn ? "In memory of my child" : "En souvenir de mon enfant"}>
                      {isEn ? "In memory of my child (Parange)" : "En souvenir de mon enfant (Parange)"}
                    </option>
                    <option value={isEn ? "In memory of my baby (Perinatal)" : "En souvenir de mon bébé (Deuil périnatal)"}>
                      {isEn ? "In memory of my baby (Perinatal loss)" : "En souvenir de mon bébé (Deuil périnatal)"}
                    </option>
                    <option value={isEn ? "In memory of my sibling" : "En souvenir de mon frère ou ma sœur"}>
                      {isEn ? "In memory of my brother or sister (Sibling)" : "En souvenir de mon frère ou ma sœur (Fratrie)"}
                    </option>
                    <option value={isEn ? "Compassionate thought for Paranges" : "Pensée solidaire pour les Paranges"}>
                      {isEn ? "Compassionate thought & solidarity from a loved one" : "Pensée solidaire & compassion d'un proche"}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isEn ? 'Choose symbolic flower' : 'Choisissez la fleur symbolique'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'rose', name: isEn ? 'White Rose' : 'Rose Blanche', color: '#EC4899', desc: isEn ? 'Tenderness' : 'Tendresse' },
                      { id: 'tournesol', name: isEn ? 'Sunflower' : 'Tournesol', color: '#F59E0B', desc: isEn ? 'Light' : 'Lumière' },
                      { id: 'myosotis', name: isEn ? 'Forget-me-not' : 'Myosotis', color: '#3B82F6', desc: isEn ? 'Memory' : 'Mémoire' },
                      { id: 'lavande', name: isEn ? 'Lavender' : 'Lavande', color: '#8B5CF6', desc: isEn ? 'Peace' : 'Paix' },
                      { id: 'marguerite', name: isEn ? 'Daisy' : 'Marguerite', color: '#10B981', desc: isEn ? 'Innocence' : 'Innocence' },
                      { id: 'pousse', name: isEn ? 'Young Sprout' : 'Jeune Pousse', color: '#14B8A6', desc: isEn ? 'Hope' : 'Espoir' }
                    ].map((fl) => (
                      <button
                        type="button"
                        key={fl.id}
                        onClick={() => setNewFlowerType(fl.id as any)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          newFlowerType === fl.id
                            ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                            : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                        }`}
                      >
                        <div 
                          className="w-4 h-4 rounded-full mx-auto mb-1" 
                          style={{ backgroundColor: fl.color }} 
                        />
                        <div className="text-[11px] font-semibold">{fl.name}</div>
                        <div className="text-[9px] text-stone-400">{fl.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isEn ? 'Your heartfelt message *' : 'Votre message ou pensée d\'amour *'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder={isEn ? "Write what your heart needs to express..." : "Écrivez ce que votre cœur a besoin de dire..."}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlantingModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    {isEn ? 'Cancel' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    {isEn ? 'Place my flower in the garden' : 'Déposer ma fleur dans le jardin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
