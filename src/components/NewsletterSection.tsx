import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, Heart, Sparkles, Send, Bell } from 'lucide-react';

interface NewsletterSectionProps {
  platformConfig?: {
    email?: string;
  };
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ platformConfig }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [profileType, setProfileType] = useState<'parange' | 'proche' | 'soignant' | 'sympathisant'>('parange');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Veuillez renseigner une adresse courriel valide.');
      return;
    }

    setErrorMessage(null);
    setStatus('loading');

    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('jde_newsletter_subscribers') || '[]');
        const newSubscriber = {
          email,
          name: name || 'Anonyme',
          profileType,
          date: new Date().toISOString()
        };
        existing.push(newSubscriber);
        localStorage.setItem('jde_newsletter_subscribers', JSON.stringify(existing));
      } catch (err) {
        console.warn('LocalStorage save error', err);
      }

      setStatus('success');
    }, 600);
  };

  return (
    <section className="py-14 sm:py-20 bg-stone-900 text-white relative overflow-hidden border-t border-stone-800">
      {/* Soft decorative glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {status === 'success' ? (
          <div className="bg-emerald-900/60 border border-emerald-500/40 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-300 mx-auto flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-serif-accent text-white">
              Merci pour votre confiance fraternelle
            </h3>
            <p className="text-stone-300 text-sm max-w-lg mx-auto leading-relaxed">
              Votre inscription à la <strong>Lettre de l'Espoir : Parange</strong> a bien été enregistrée pour <em>{email}</em>. Vous recevrez nos invitations mensuelles aux groupes de parole, cérémonies du souvenir et ateliers.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setStatus('idle');
                  setEmail('');
                  setName('');
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
              >
                Inscrire une autre adresse
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold">
                <Bell className="w-3.5 h-3.5 text-emerald-400" />
                <span>La Lettre du Jardin • Événements & Soutien en Côte d'Ivoire</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif-accent tracking-tight text-white">
                Restez informé(e) de nos rencontres et cérémonies
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                Recevez chaque mois nos dates de cercles de parole (GSP), ateliers d'art-thérapie mémorielle, conférences de santé maternelle et avancées de notre plaidoyer en Côte d'Ivoire.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-stone-800/80 backdrop-blur-xs p-6 sm:p-8 rounded-3xl border border-stone-700/80 shadow-xl space-y-5">
              
              {/* Profile selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Vous souhaitez recevoir les nouvelles en tant que :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'parange', label: 'Parent / Parange' },
                    { id: 'proche', label: 'Proche / Famille' },
                    { id: 'soignant', label: 'Soignant / Relais' },
                    { id: 'sympathisant', label: 'Sympathisant / Donateur' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setProfileType(item.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer text-center ${
                        profileType === item.id
                          ? 'bg-emerald-700 text-white border-emerald-500 font-semibold'
                          : 'bg-stone-900/60 text-stone-400 border-stone-700 hover:text-stone-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Prénom ou Pseudonyme (facultatif)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex : Marie, Kouadio ou Anonyme"
                    className="w-full px-4 py-3 rounded-xl bg-stone-900/90 border border-stone-700 text-white text-xs sm:text-sm placeholder-stone-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Votre adresse e-mail <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@exemple.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-900/90 border border-stone-700 text-white text-xs sm:text-sm placeholder-stone-500 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="text-rose-400 text-xs font-medium bg-rose-950/40 p-3 rounded-xl border border-rose-800">
                  {errorMessage}
                </div>
              )}

              {/* Submit and reassuring notes */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Confidentialité garantie • Aucun spam • Désinscription en 1 clic</span>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <span>Inscription en cours...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>S'inscrire à la Lettre</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
};
