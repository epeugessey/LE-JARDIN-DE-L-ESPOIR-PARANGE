import React, { useState } from 'react';
import { Phone, Users, UserCheck, Heart, Shield, CheckCircle2, ArrowRight, Sparkles, MapPin, Baby, Flame, FileText } from 'lucide-react';
import { PlatformConfig } from '../types';
import { PerinatalFaqAccordion } from './PerinatalFaqAccordion';
import { useLanguage } from '../context/LanguageContext';

interface ServicesViewProps {
  onOpenConsultationModal: (audience?: 'parange' | 'fratrie' | 'proche' | 'soignant-relais') => void;
  platformConfig?: PlatformConfig;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onOpenConsultationModal, platformConfig }) => {
  const { isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<'tous' | 'gsp' | 'specialises' | 'outreach' | 'memoire'>('tous');
  const phone1 = platformConfig?.phonePrimary || '07 59 87 21 61';
  const phone2 = platformConfig?.phoneSecondary || '05 75 23 93 12';

  const filterTabs = [
    { id: 'tous', label: isEn ? 'All Services' : 'Tous les services' },
    { id: 'gsp', label: isEn ? 'Support Groups (PSG)' : 'Groupes de Soutien (GSP)' },
    { id: 'specialises', label: isEn ? 'Perinatal & Siblings' : 'Deuil Périnatal & Fratrie' },
    { id: 'outreach', label: isEn ? 'Mobile Consultations' : 'Consultations Mobiles' },
    { id: 'memoire', label: isEn ? 'Art-Therapy & Memory' : 'Art-Thérapie & Mémoire' }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>{isEn ? 'Clinical, solidarity & community care' : 'Accompagnement clinique, solidaire & de proximité'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-stone-900 font-serif-accent tracking-tight">
            {isEn ? 'Our Pillars & Support Services' : "Nos Piliers & Services d'Accompagnement"}
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            {isEn 
              ? 'Because the grief of losing a child does not heal through forgetting, but through the compassionate embrace of sorrow, our clinical psychologists and peer support parents walk alongside you with tenderness and respect.'
              : 'Parce que le deuil d\'un enfant ne guérit pas par l\'oubli mais par l\'accueil bienveillant de la blessure, nos psychologues cliniciens et nos pairs-aidants vous accompagnent avec chaleur et respect.'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-wrap gap-1">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Service 1: Groupes de Soutien Psychologique (GSP) */}
          {(activeTab === 'tous' || activeTab === 'gsp') && (
            <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-emerald-300 transition-all duration-300 ease-out flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  {isEn ? 'Pillar I • Core Mission' : 'Pilier I • Cœur de mission'}
                </div>
                <h3 className="text-2xl font-bold text-stone-900 font-serif-accent mb-3 group-hover:text-emerald-900 transition-colors">
                  {isEn ? 'Psychological Support Groups (PSG)' : 'Groupes de Soutien Psychologique (GSP)'}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {isEn 
                    ? 'Safe, warm circles of 8 to 12 bereaved parents, led jointly by a clinical psychologist and a peer parent. A space free of taboo where every tear, silence, and precious memory is honored with gentle care.'
                    : 'Des cercles chaleureux de 8 à 12 Paranges, animés par un psychologue clinicien qualifié et un parent pair-aidant. Un espace libéré de tout tabou où chaque larme, chaque silence et chaque souvenir est accueilli avec une infinie tendresse.'}
                </p>

                <div className="space-y-2.5 mb-6">
                  {(isEn ? [
                    'Regular monthly sessions across COTE D\'IVOIRE and confidential virtual circles',
                    'Express and release guilt, anger, profound sadness and emotional numbness',
                    'De-stigmatize psychological pain against societal or familial misunderstandings',
                    'Mutualized community support ensuring free access or symbolic sliding-scale fees'
                  ] : [
                    'Séances régulières (mensuelles ou bimensuelles) à travers la COTE D\'IVOIRE et en visio sécurisée',
                    'Délier la parole face à la culpabilité, à la colère et au sentiment de vide',
                    'Déstigmatiser la douleur psychologique face aux incompréhensions familiales',
                    'Mutualisation des coûts pour garantir la gratuité ou accessibilité universelle'
                  ]).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">
                  {isEn ? 'Safe & anonymous environment' : 'Cadre sécurisé & anonyme'}
                </span>
                <button
                  onClick={() => onOpenConsultationModal('parange')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {isEn ? 'Join a Support Group' : 'Rejoindre un GSP'}
                </button>
              </div>
            </div>
          )}

          {/* Service 2: Groupe Spécifique Deuil Périnatal */}
          {(activeTab === 'tous' || activeTab === 'specialises') && (
            <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-300 transition-all duration-300 ease-out flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                  <Baby className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                  {isEn ? 'Pillar II • Perinatal Loss' : 'Pilier II • Deuil Périnatal'}
                </div>
                <h3 className="text-2xl font-bold text-stone-900 font-serif-accent mb-3 group-hover:text-amber-900 transition-colors">
                  {isEn ? 'Dedicated Perinatal Bereavement Circles' : 'Soutien Spécifique au Deuil Périnatal'}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {isEn 
                    ? 'Stillbirth, late miscarriage, or neonatal loss are too often downplayed by society. This dedicated group provides parents of babies gone too soon with a recognized voice and unconditional validation.'
                    : 'La mort in utero, la fausse couche tardive ou la perte néonatale sont souvent ignorées par la société (« Tu en feras un autre »). Ce groupe dédié donne une voix et une légitimité aux parents de ces anges partis trop vite.'}
                </p>

                <div className="space-y-2.5 mb-6">
                  {(isEn ? [
                    'Intimate listening circles for mothers and fathers in perinatal mourning',
                    'Guidance in creating symbolic rituals (memory boxes, naming, memorial candles)',
                    'Specialized support for subsequent pregnancies and rainbow babies',
                    'Distribution of hospital Bereavement Kits directly in maternity wards'
                  ] : [
                    'Espace de parole intime pour les mamans et les papas endeuillés',
                    'Aide à la création de rituels symboliques (boîte à souvenirs, prénoms, bougies)',
                    'Accompagnement de l\'anxiété liée aux grossesses suivantes',
                    'Distribution du Kit de Deuil en maternité'
                  ]).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">
                  {isEn ? 'For mothers and fathers' : 'Pour mamans et papas'}
                </span>
                <button
                  onClick={() => onOpenConsultationModal('parange')}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {isEn ? 'Join this Group' : 'Participer à ce groupe'}
                </button>
              </div>
            </div>
          )}

          {/* Service 3: Groupe Fratrie Endeuillée & Ateliers Thématiques */}
          {(activeTab === 'tous' || activeTab === 'specialises') && (
            <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-teal-300 transition-all duration-300 ease-out flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-5 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                  {isEn ? 'Pillar III • Siblings & Family' : 'Pilier III • Fratrie & Foyer'}
                </div>
                <h3 className="text-2xl font-bold text-stone-900 font-serif-accent mb-3 group-hover:text-teal-900 transition-colors">
                  {isEn ? 'Bereaved Siblings & Thematic Workshops' : 'Fratrie Endeuillée & Ateliers Thématiques'}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {isEn 
                    ? 'Brothers and sisters often bear grief in silence to protect their parents. We provide age-adapted expression circles and targeted workshops to strengthen marital and family bonds.'
                    : 'Les frères et sœurs vivent souvent le drame dans l\'ombre pour ne pas peiner leurs parents. Nous leur offrons des cercles d\'expression adaptés, ainsi que des ateliers ciblés pour consolider le couple.'}
                </p>

                <div className="space-y-2.5 mb-6">
                  {(isEn ? [
                    'Support circles for children and teenagers who lost a brother or sister',
                    'Thematic workshop: "Navigating marital life and intimacy after loss"',
                    'Thematic workshop: "Returning to the workplace and colleagues\' reactions"',
                    'Thematic workshop: "Overcoming paralyzing feelings of guilt"'
                  ] : [
                    'Cercles d\'écoute pour enfants et adolescents ayant perdu un frère ou une sœur',
                    'Ateliers thématiques : « La gestion du couple après la perte »',
                    'Ateliers thématiques : « La reprise du travail et le regard des collègues »',
                    'Ateliers thématiques : « Sortir de la culpabilité paralysante »'
                  ]).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">
                  {isEn ? 'Age-appropriate groups' : "Groupes par tranche d'âge"}
                </span>
                <button
                  onClick={() => onOpenConsultationModal('fratrie')}
                  className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {isEn ? 'Enroll a child or teen' : 'Inscrire un enfant ou un ado'}
                </button>
              </div>
            </div>
          )}

          {/* Service 4: Consultations Mobiles Solidaires (Outreach) */}
          {(activeTab === 'tous' || activeTab === 'outreach') && (
            <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-indigo-300 transition-all duration-300 ease-out flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                  {isEn ? 'Pillar IV • Regional Outreach' : 'Pilier IV • Proximité Territoriale'}
                </div>
                <h3 className="text-2xl font-bold text-stone-900 font-serif-accent mb-3 group-hover:text-indigo-900 transition-colors">
                  {isEn ? 'Mobile Solidarity Outreach & Consultations' : 'Consultations Solidaires Mobiles (Outreach)'}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {isEn 
                    ? 'For parents unable to travel or unable to afford private clinic therapy, our mobile teams travel across communities and regional hubs to bring humane, professional support.'
                    : 'Pour les parents qui ne peuvent pas se déplacer ou n\'ont pas les moyens de consulter en cabinet privé, nos équipes mobiles se rendent dans les quartiers populaires et les villes de l\'intérieur.'}
                </p>

                <div className="space-y-2.5 mb-6">
                  {(isEn ? [
                    "Solidarity consultation clinic days throughout COTE D'IVOIRE",
                    'Interventions in community health clinics and local faith communities',
                    'Symbolic donation (500 to 1,000 XOF) with complete fee waiver when needed',
                    `7d/7 solidarity listening helpline (+225 ${phone1} / ${phone2}) reachable everywhere`
                  ] : [
                    "Journées de consultation solidaire à travers toute la COTE D'IVOIRE",
                    'Interventions dans les centres de santé communautaires et paroisses',
                    'Participation symbolique (500 à 1 000 FCFA) avec gratuité totale si nécessaire',
                    `Ligne d'écoute solidaire 7j/7 (+225 ${phone1} / ${phone2}) accessible partout`
                  ]).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">
                  {isEn ? 'Monthly regional missions' : 'Missions mensuelles en région'}
                </span>
                <button
                  onClick={() => onOpenConsultationModal('parange')}
                  className="px-4 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {isEn ? 'View Outreach Schedule' : 'Consulter le calendrier mobile'}
                </button>
              </div>
            </div>
          )}

          {/* Service 5: Résilience, Mémoire & Art-Thérapie */}
          {(activeTab === 'tous' || activeTab === 'memoire') && (
            <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-300 transition-all duration-300 ease-out flex flex-col justify-between md:col-span-2 group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                  {isEn ? 'Pillar V • Memory & Resilience' : 'Pilier V • Mémoire & Résilience'}
                </div>
                <h3 className="text-2xl font-bold text-stone-900 font-serif-accent mb-3 group-hover:text-amber-900 transition-colors">
                  {isEn ? 'Art-Therapy, Memorial Ceremonies & The Virtual Garden' : 'Art-Thérapie, Cérémonies Mémorielles & Le Jardin Virtuel'}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {isEn 
                    ? 'Because certain heartbreaks surpass ordinary words, we use art-therapy (painting, creative writing, traditional music) and collective rituals to tenderly honor the memory of our departed children.'
                    : 'Parce que certains traumatismes dépassent les mots ordinaires, nous mobilisons l\'art-thérapie (peinture, écriture, danse traditionnelle, musique) et des rituels collectifs de commémoration pour honorer la mémoire des enfants partis.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isEn ? 'Walk of Lights' : 'Marche des Lumières'}</span>
                    </div>
                    <p className="text-xs text-stone-500">
                      {isEn 
                        ? 'Annual memorial gathering in Côte d\'Ivoire to light up the night and break the taboo of perinatal grief.'
                        : 'Rassemblement mémoriel annuel en Côte d\'Ivoire pour éclairer la nuit et briser le tabou du deuil.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isEn ? 'Sibling Art-Therapy' : 'Art-Thérapie Fratrie'}</span>
                    </div>
                    <p className="text-xs text-stone-500">
                      {isEn 
                        ? 'Creative mediation workshops for children and teens: painting what cannot be spoken.'
                        : 'Ateliers de médiation créative pour les enfants et ados : peindre ce qui ne peut être dit.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>{isEn ? '1 Flower 1 Angel' : 'Campagne 1 Fleur 1 Ange'}</span>
                    </div>
                    <p className="text-xs text-stone-500">
                      {isEn 
                        ? 'In our Virtual Garden: plant a digital flower and light a candle for your angel.'
                        : 'Dans notre Jardin Virtuel : planter une fleur numérique et allumer une veilleuse pour son ange.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-stone-500 font-medium">
                  {isEn ? 'Open to all bereaved parents and relatives' : 'Ouvert à tous les Paranges et proches'}
                </span>
                <button
                  onClick={() => onOpenConsultationModal('proche')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  {isEn ? 'Sign up for upcoming Art-Therapy workshops' : "S'inscrire aux prochains ateliers d'art-thérapie"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Helpline CTA banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-medium">
              <Phone className="w-3.5 h-3.5" />
              <span>{isEn ? 'Phone Helpline 7 days / week' : 'Permanence téléphonique 7j/7'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-accent">
              {isEn ? 'Need to talk immediately with a peer parent or clinician?' : 'Besoin de parler immédiatement à un pair-aidant ou un clinicien ?'}
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              {isEn 
                ? 'Do not walk through this pain alone tonight. Our solidarity helpline is here to offer a compassionate, non-judgmental presence.'
                : 'Ne restez pas seul avec votre peine ce soir. Notre ligne d\'écoute solidaire est à votre disposition pour vous offrir une présence bienveillante et sans jugement.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href={`tel:+225${phone1.replace(/\s+/g, '')}`}
              className="px-5 py-3.5 rounded-xl bg-white text-emerald-900 font-bold text-xs sm:text-sm text-center hover:bg-emerald-50 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>+225 {phone1} / {phone2}</span>
            </a>
            <button
              onClick={() => onOpenConsultationModal('parange')}
              className="px-6 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold text-sm text-center border border-emerald-500/40 transition-colors"
            >
              {isEn ? 'Book an Appointment Online' : 'Prendre rendez-vous en ligne'}
            </button>
          </div>
        </div>

        {/* Specialized Perinatal FAQ Accordion */}
        <PerinatalFaqAccordion
          onOpenConsultationModal={onOpenConsultationModal}
          phone1={phone1}
          phone2={phone2}
        />
      </div>
    </div>
  );
};
