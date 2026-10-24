import React, { useState } from 'react';
import { TrainingModule } from '../types';
import { TRAINING_MODULES } from '../data/mockData';
import { GraduationCap, Clock, Award, CheckCircle2, FileText, Send, Building2, Users, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TrainingView: React.FC = () => {
  const { isEn } = useLanguage();
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    email: '',
    phone: '',
    city: "COTE D'IVOIRE",
    moduleCode: 'SANTE-01',
    participantsCount: '1',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    const matchedModule = TRAINING_MODULES.find((m) => m.code === formData.moduleCode);
    const newRegId = `tr-${Date.now()}`;

    const newRecord = {
      id: newRegId,
      name: formData.name.trim(),
      institution: formData.institution.trim() || 'Établissement de Santé',
      email: formData.email.trim() || '',
      phone: formData.phone.trim(),
      city: formData.city.trim() || 'Abidjan',
      moduleCode: formData.moduleCode,
      moduleTitle: matchedModule?.title || 'Formation Professionnelle',
      participantsCount: parseInt(formData.participantsCount) || 1,
      message: formData.message.trim(),
      requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'en_attente' as const,
      notes: 'Demande soumise via le portail public des formations.'
    };

    // 1. Persist to training registrations
    try {
      const stored = localStorage.getItem('jde_training_registrations');
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem('jde_training_registrations', JSON.stringify([newRecord, ...existing]));
      window.dispatchEvent(new Event('jde_trainings_updated'));
    } catch (err) {
      console.warn('Could not save training registration', err);
    }

    // 2. Generate Admin Notification alert for Alert Bubble & Cockpit
    try {
      const adminNotif = {
        id: `notif-train-${Date.now()}`,
        type: 'demande_formation' as const,
        senderName: formData.name.trim(),
        senderPhone: formData.phone.trim(),
        senderEmail: formData.email.trim() || undefined,
        senderCity: formData.city.trim() || "Côte d'Ivoire",
        subject: `Candidature Formation : ${matchedModule?.code || formData.moduleCode}`,
        message: `${formData.name.trim()} (${formData.institution.trim() || 'Santé'}) souhaite inscrire ${formData.participantsCount} participant(s) au module ${matchedModule?.title || formData.moduleCode}. ${formData.message ? `Détails : "${formData.message}"` : ''}`,
        timestamp: new Date().toISOString(),
        status: 'unread' as const,
        urgencyLevel: 'haute' as const,
        metadata: {
          trainingId: newRegId,
          institution: formData.institution,
          moduleCode: formData.moduleCode,
          participantsCount: formData.participantsCount
        }
      };

      const storedNotifs = localStorage.getItem('jde_admin_notifications');
      const existingNotifs = storedNotifs ? JSON.parse(storedNotifs) : [];
      localStorage.setItem('jde_admin_notifications', JSON.stringify([adminNotif, ...existingNotifs]));
      window.dispatchEvent(new Event('jde_notifications_updated'));
    } catch (err) {
      console.warn('Could not save notification', err);
    }

    setRequestSent(true);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{isEn ? 'Training & Community Outreach Division' : 'Pôle Formation & Sensibilisation Communautaire'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-stone-900 font-serif-accent tracking-tight">
            {isEn ? 'Professional Training & Community Health Relays' : 'Formations Professionnelles & Relais de Santé'}
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            {isEn 
              ? 'Training hospital healthcare providers in Côte d\'Ivoire (midwives, nurses, pediatricians) in compassionate notification, and empowering community leaders and peer parents to break silence around perinatal grief.'
              : 'Former les soignants hospitaliers de Côte d\'Ivoire (sages-femmes, infirmiers, pédiatres) à l\'annonce bienveillante et équiper les leaders communautaires et pairs-aidants pour délier la parole autour des Paranges.'}
          </p>
        </div>

        {/* Value props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">
                {isEn ? 'Academic & Clinical Partnerships' : 'Partenariats Universitaires & Cliniques'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isEn 
                  ? 'Curricula designed with university psychology departments and senior clinical hospital practitioners.'
                  : 'Programmes conçus avec les départements de Psychologie des universités d\'Abidjan et des praticiens hospitaliers chevronnés.'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-800">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">
                {isEn ? 'Hospital Bereavement Kit Handover' : 'Remise du Kit de Deuil Hospitalier'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isEn 
                  ? 'Practical protocols for handing over memory kits in maternity and pediatric units with compassionate tact.'
                  : 'Apprentissage pratique de la remise du kit en maternité et pédiatrie pour éviter le sentiment d\'abandon des familles.'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-100 text-indigo-800">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">
                {isEn ? '"Parent to Mentor" Program' : 'Programme « Parange à Guide »'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isEn 
                  ? 'A dedicated pathway training resilient bereaved parents to become accredited, empathetic peer guides.'
                  : 'Cursus unique pour former des parents endeuillés résilients à devenir des pairs-aidants certifiés et bienveillants.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-6 mb-16">
          <h2 className="text-2xl font-bold text-stone-900 font-serif-accent">
            {isEn ? 'Our Training Modules Catalog' : 'Catalogue de nos modules de formation'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TRAINING_MODULES.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-bold font-mono">
                      {module.code}
                    </span>
                    <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {module.format}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 font-serif-accent mb-2">
                    {module.title}
                  </h3>
                  <p className="text-xs font-medium text-stone-500 mb-4">
                    {module.subtitle}
                  </p>

                  <div className="space-y-2.5 text-xs text-stone-600 mb-6 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span><strong>{isEn ? 'Duration:' : 'Durée :'}</strong> {module.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span><strong>{isEn ? 'Audience:' : 'Public :'}</strong> {module.targetProfessionals}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                      {isEn ? 'Key Objectives:' : 'Objectifs clés :'}
                    </h4>
                    <ul className="space-y-1.5">
                      {module.objectives.slice(0, 3).map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <div className="text-xs text-stone-500 mb-3">
                    {isEn ? 'Tuition:' : 'Tarif :'} <strong className="text-stone-900">{module.pricePerPerson}</strong>
                  </div>
                  <button
                    onClick={() => {
                      setFormData({ ...formData, moduleCode: module.code });
                      setSelectedModule(module);
                      const el = document.getElementById('inscription-form');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    {isEn ? 'Request Registration or Quote' : "Demander l'inscription ou devis"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Registration Form */}
        <div id="inscription-form" className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 shadow-sm max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-stone-900 font-serif-accent mb-2">
              {isEn ? 'Registration Request or On-Site Institutional Session' : "Demande d'inscription ou session intra-établissement"}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              {isEn 
                ? 'For your hospital, maternity ward, clinic, community organization or parish in Côte d\'Ivoire.'
                : 'Pour votre hôpital, maternité, clinique, association communautaire ou paroisse en Côte d\'Ivoire.'}
            </p>
          </div>

          {requestSent ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-stone-900">
                {isEn ? 'Your request has been successfully submitted' : 'Votre demande a bien été transmise'}
              </h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                {isEn 
                  ? 'Our training director will contact you within 24 business hours with the detailed session timetable.'
                  : 'Le responsable pédagogique du Jardin de l\'Espoir : Parange vous recontactera sous 24h ouvrées pour vous transmettre le calendrier détaillé.'}
              </p>
              <button
                onClick={() => setRequestSent(false)}
                className="mt-4 px-4 py-2 rounded-xl bg-stone-100 text-xs font-semibold text-stone-700 hover:bg-stone-200 cursor-pointer"
              >
                {isEn ? 'Send another request' : 'Envoyer une autre demande'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isEn ? 'Full Name of Coordinator *' : 'Nom et prénom du responsable *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isEn ? "e.g. Dr. Smith / Mrs. Toure" : "Ex: Dr. Kouamé / Mme Touré"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isEn ? 'Institution or Clinic *' : 'Établissement ou Structure *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={e => setFormData({ ...formData, institution: e.target.value })}
                    placeholder={isEn ? "e.g. University Hospital / Maternity / Parish" : "Ex: CHU Treichville / Maternité Cocody / Paroisse"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isEn ? 'Phone Number (+225) *' : 'Numéro de téléphone (+225) *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex: 07 00 11 22 33"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isEn ? 'City or Commune (Côte d\'Ivoire) *' : 'Ville ou Commune *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder={isEn ? "e.g. COTE D'IVOIRE (City, Commune or Region)" : "Ex: COTE D'IVOIRE (Ville, Commune ou Région)"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isEn ? 'Desired Module' : 'Module souhaité'}
                  </label>
                  <select
                    value={formData.moduleCode}
                    onChange={e => setFormData({ ...formData, moduleCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="SANTE-01">SANTE-01 : {isEn ? 'Maternity & Pediatric Caregivers (Bereavement Kit)' : 'Soignants Maternité & Pédiatrie (Kit de Deuil)'}</option>
                    <option value="RELAIS-02">RELAIS-02 : {isEn ? 'Community Relays & Spiritual Leaders' : 'Relais Communautaires & Guides Spirituels'}</option>
                    <option value="PAIR-03">PAIR-03 : {isEn ? '"Parent to Mentor" Program (Peer-Guidance)' : 'Programme « Parange à Guide » (Pair-aidance)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isEn ? 'Estimated Participants Count' : 'Nombre estimé de participants'}
                  </label>
                  <input
                    type="text"
                    value={formData.participantsCount}
                    onChange={e => setFormData({ ...formData, participantsCount: e.target.value })}
                    placeholder={isEn ? "e.g. 1 individual or team of 10" : "Ex: 1 personne ou équipe de 10 personnes"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isEn ? 'Expectations or Preferred Timeline' : 'Précisions sur vos attentes ou calendrier envisagé'}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder={isEn ? "Preferred dates, institutional context..." : "Dates souhaitées, contexte de votre structure..."}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 text-center">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isEn ? 'Submit Training Request' : 'Envoyer ma demande de formation'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
