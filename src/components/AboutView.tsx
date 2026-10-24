import React, { useState } from 'react';
import { Flower2, Shield, Heart, Users, Sparkles, CheckCircle2, Award, Compass, PhoneCall, Flame, AlertCircle, Download, FileText, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  telechargerDossierMentoratONGInternationalePDF, 
  downloadInternationalNGOMentorshipPitchPDF_EN,
  telechargerDossierPresentationPDF,
  downloadStrategicPresentationPDF_EN
} from '../utils/pdfGenerator';

interface AboutViewProps {
  onOpenConsultationModal: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenConsultationModal }) => {
  const { isEn } = useLanguage();
  const [downloadingMentorat, setDownloadingMentorat] = useState<'fr' | 'en' | null>(null);
  const [downloadingPresentation, setDownloadingPresentation] = useState<'fr' | 'en' | null>(null);

  const handleDownloadFR = () => {
    setDownloadingMentorat('fr');
    try {
      telechargerDossierMentoratONGInternationalePDF();
    } finally {
      setTimeout(() => setDownloadingMentorat(null), 1000);
    }
  };

  const handleDownloadEN = () => {
    setDownloadingMentorat('en');
    try {
      downloadInternationalNGOMentorshipPitchPDF_EN();
    } finally {
      setTimeout(() => setDownloadingMentorat(null), 1000);
    }
  };

  const handleDownloadPresFR = () => {
    setDownloadingPresentation('fr');
    try {
      telechargerDossierPresentationPDF();
    } finally {
      setTimeout(() => setDownloadingPresentation(null), 1000);
    }
  };

  const handleDownloadPresEN = () => {
    setDownloadingPresentation('en');
    try {
      downloadStrategicPresentationPDF_EN();
    } finally {
      setTimeout(() => setDownloadingPresentation(null), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>{isEn ? 'Our story, our sacred promise & our values' : 'Notre histoire, notre promesse & nos valeurs'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-stone-900 font-serif-accent tracking-tight">
            {isEn ? 'The Origin of Le Jardin de l\'Espoir : Parange' : 'L\'Origine du Jardin de l\'Espoir : Parange'}
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            {isEn 
              ? 'Born from immense heartbreak and a sacred promise: ensuring that no grieving parent in Côte d\'Ivoire is condemned to silence and solitude after the loss of their child.'
              : 'Né d\'une blessure immense et d\'une promesse sacrée : faire en sorte qu\'aucun parent en Côte d\'Ivoire ne soit condamné au silence et à l\'isolement après la perte de son enfant.'}
          </p>
        </div>

        {/* The Heartfelt 2018 Founding Story */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-md mb-16 relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  {isEn ? 'Founders\' Testimony' : 'Le Témoignage des Fondateurs'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-accent">
                  {isEn ? 'A tragedy transformed into a life mission' : 'Une tragédie devenue une mission de vie'}
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed border-l-4 border-emerald-600 pl-6 my-6 italic bg-stone-50/70 py-4 pr-4 rounded-r-2xl">
              {isEn ? (
                <>
                  <p>
                    « In 2018, our family life was brutally shattered. A fire claimed our two children, along with our mother, our brother, and our nephews and nieces: 9 members of our family, 3 generations extinguished in a single night. This event was not merely a tragedy; it marked the beginning of heartbreaking loneliness and eternal questioning.
                  </p>
                  <p>
                    In Côte d\'Ivoire, as in many societies, the loss of a child is treated with silence, often relegated solely to funeral rites. We quickly realized a painful truth: there was no sanctuary for us, the survivors. No space where a broken heart could be listened to, soothed, and cared for. Searching for help, we found that high-quality psychological support was an unaffordable luxury. Psychologists were costly, specialized perinatal care virtually nonexistent, and the topic deeply TABOO.
                  </p>
                  <p>
                    It was in this darkness that we embraced a word—not to forget, but to bestow identity: <strong>"Parange" (Angel Parent)</strong>. We understood that our battle was not merely personal; it belonged to thousands of invisible, overlooked Ivorian parents whose unresolved grief threatened everything else: their health, their marriage, their future.
                  </p>
                  <p>
                    After traversing our own desert, we made a sacred vow: <em>no one else should ever walk this desert alone</em>. Our calling became making vital professional bereavement care freely accessible. Thus was born <strong>LE JARDIN DE L'ESPOIR : PARANGE</strong>. »
                  </p>
                </>
              ) : (
                <>
                  <p>
                    « En 2018, notre vie de famille a été brutalement anéantie. Un incendie a emporté nos deux enfants ainsi que notre maman, notre frère et nos neveux et nièces : 9 membres de notre famille, 3 générations fauchées en une nuit. Cet événement n'était pas seulement une tragédie ; il fut le début d'une solitude déchirante et d'un éternel questionnement.
                  </p>
                  <p>
                    En Côte d'Ivoire, comme dans de nombreuses sociétés, la perte d'un enfant est traitée en silence, souvent reléguée aux rites funéraires, sans plus. Nous avons rapidement découvert une chose terrible : il n'y avait pas d'endroit pour nous, les survivants. Pas d'espace où le cœur brisé pouvait être écouté, soigné. En cherchant de l'aide, nous avons réalisé que la prise en charge psychologique de qualité était un luxe inabordable. Les psychologues étaient chers, l'aide spécialisée quasi inexistante, et le sujet TABOU.
                  </p>
                  <p>
                    C'est dans cette obscurité que nous avons découvert un mot, non pas pour oublier, mais pour donner une identité : le mot <strong>"Parange" (Parent d'Ange)</strong>. Nous avons dès lors compris que notre combat n'était pas seulement personnel ; il était celui de milliers de parents ivoiriens, invisibles et ignorés, pour qui le deuil non soigné risquait de détruire tout le reste : leur santé, leur couple, leur futur.
                  </p>
                  <p>
                    Après avoir traversé notre propre chemin de croix, nous avons fait une promesse : <em>personne d'autre ne devrait affronter seul ce désert</em>. Notre mission est devenue de rendre accessible ce qui est vital : le soutien professionnel. C'est ainsi qu'est né <strong>LE JARDIN DE L'ESPOIR : PARANGE</strong>. »
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scope and Boundaries: Côte d'Ivoire Specificity & Universal Inclusivity */}
        <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-xl relative overflow-hidden border border-emerald-800">
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            
            {/* CARDINAL STATEMENT: ALL AGES INCLUSIVITY */}
            <div className="p-5 rounded-2xl bg-amber-400/20 border-2 border-amber-400/70 text-amber-100 space-y-2 shadow-md">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Universal Compassion Principle • All Ages Welcomed' : 'Principe Fondateur d\'Inclusivité Universelle • Tout Âge'}</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-white leading-snug">
                {isEn
                  ? 'Le Jardin de l\'Espoir : Parange supports EVERY person who has lost at least one child, regardless of the child\'s age — whether stillborn (miscarriage, termination, stillbirth) or deceased in infancy, childhood, youth or at an advanced adult age.'
                  : 'Le Jardin de l\'Espoir : Parange accueille et accompagne TOUTE personne ayant perdu au moins un enfant, quel que soit l\'âge de l\'enfant disparu : qu\'il soit mort-né (mort in utero, interruption médicale de grossesse, fausse couche) ou décédé nourrisson, enfant, adolescent, adulte ou à un âge avancé.'}
              </p>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {isEn
                  ? 'Surviving one\'s child defies the natural order of life. No lifespan diminishes the eternal bond or the boundless sorrow of a mother or a father. Once a parent, always a Parange.'
                  : 'Pour un père ou une mère, la perte d\'un enfant défie l\'ordre naturel des générations. Aucune durée d\'existence partagée n\'atténue le déchirement d\'un cœur de parent. On reste Parange pour toujours.'}
              </p>
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2">
                {isEn ? 'Our Exclusive Scope of Intervention' : 'Notre champ d\'intervention exclusif'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-accent">
                {isEn ? 'Filling a Critical Public Health Void Without Dispersion' : 'Combler un vide de santé publique sans dispersion'}
              </h2>
            </div>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              {isEn
                ? "« In Côte d'Ivoire, current humanitarian efforts rightfully focus on orphans. However, no specialized and accessible structure existed for grieving parents (Paranges). Our project fills this void by creating the first professional, community-rooted psychological sanctuary for adults devastated by the loss of their child, whatever their age. »"
                : "« En Côte d'Ivoire, l'offre d'aide actuelle se concentre légitimement sur les enfants orphelins. Cependant, il n'existait aucune structure spécialisée et accessible pour les parents endeuillés (les Paranges). Notre projet comble ce vide en créant le premier lieu de soutien psychologique professionnel et solidaire pour les adultes brisés par la perte de leur enfant, quel que soit son âge. »"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-900/80 border border-emerald-700/80 space-y-2">
                <div className="font-bold text-sm text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isEn ? '1. All-Age Child Loss (From Toddler to Adult)' : '1. Paranges de Tout Âge (Enfant à Adulte Avancé)'}</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {isEn
                    ? 'Parents mourning a toddler, schoolchild, teenager, or adult son/daughter (disease, traffic accident, tragedy, advanced age).'
                    : 'Parents ayant perdu un enfant à tout moment de sa vie : nourrisson, écolier, adolescent ou enfant adulte décédé à un âge avancé (accident, maladie, drame).'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-900/80 border border-emerald-700/80 space-y-2">
                <div className="font-bold text-sm text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isEn ? '2. Perinatal Loss & Stillbirth' : '2. Tout-Petits & Mort-Nés (Deuil Périnatal)'}</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {isEn
                    ? 'Stillbirth, late miscarriage, medical termination (IMG), neonatal death: validating existence and voice for these angel babies.'
                    : 'Mort fœtale in utero, fausse couche tardive, interruption médicale de grossesse (IMG), décès néonatal : donner un prénom, une existence et une sépulture digne à ces anges.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-900/80 border border-emerald-700/80 space-y-2">
                <div className="font-bold text-sm text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isEn ? '3. Grieving Siblings' : '3. La Fratrie Endeuillée'}</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {isEn
                    ? 'Targeted psychological care for brothers and sisters who mourn in the shadow to protect their parents.'
                    : 'Soutien ciblé aux frères et sœurs qui vivent la perte dans l\'ombre et ont besoin de soins adaptés.'}
                </p>
              </div>
            </div>

            {/* Facebook Group Community Strip */}
            <div className="p-4 rounded-2xl bg-[#1877F2]/20 border border-[#1877F2]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1877F2] text-white flex items-center justify-center font-black text-base shrink-0 shadow-sm">
                  f
                </div>
                <div>
                  <p className="font-bold text-white text-xs sm:text-sm">
                    {isEn ? 'Official Facebook Support Group for Families' : 'Groupe Facebook Officiel d\'Entraide des Paranges'}
                  </p>
                  <p className="text-blue-200 text-[11px]">
                    {isEn ? 'Safe, respectful, and moderated community available 24/7' : 'Rejoignez notre communauté bienveillante pour échanger au quotidien entre pairs'}
                  </p>
                </div>
              </div>
              <a
                href="https://www.facebook.com/groups/lejardindelespoirparange/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
              >
                <span>{isEn ? 'Join on Facebook' : 'Rejoindre le Groupe Facebook'}</span>
                <span className="text-sm">→</span>
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-900/40 border border-amber-500/50 text-xs text-amber-200 leading-relaxed flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>{isEn ? 'Distinction from other organizations:' : 'Différence avec d\'autres organismes :'}</strong>{' '}
                {isEn
                  ? 'Le Jardin de l\'Espoir : Parange does not handle parental divorces, illness of parents, abandonment or disappearances. This strict ethical focus ensures every single franc directly supports the trauma of Paranges and grieving siblings in Côte d\'Ivoire.'
                  : 'Contrairement à des organismes d\'accompagnement de jeunesse étrangers, Le Jardin de l\'Espoir : Parange ne gère pas les séparations ou divorces parentaux, ni les maladies graves, l\'abandon ou les disparitions. Ce choix éthique rigoureux garantit que chaque franc mobilisé sert directement le traumatisme des Paranges et des fratries en Côte d\'Ivoire.'}
              </div>
            </div>
          </div>
        </div>

        {/* The 3 Governance Poles */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-xs mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
              {isEn ? 'Governance & Multidisciplinary Team' : 'Gouvernance & Équipe'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-accent mb-2">
              {isEn ? 'An alliance of clinical experts and empathetic peer guides' : 'Une alliance de professionnels et de pairs-aidants'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              {isEn
                ? 'Combining rigorous clinical psychology with the profound strength of lived experience for unparalleled care.'
                : 'Associer l\'expertise clinique rigoureuse et la puissance de l\'expérience vécue pour un accueil sans pareil.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-base font-bold text-stone-900">
                {isEn ? 'Certified Clinical Department' : 'Pôle Professionnel Certifié'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isEn
                  ? 'Licensed clinical psychologists, psychotherapists and social workers. Scientific collaborations with University psychology faculties in Abidjan for clinical supervision.'
                  : 'Psychologues cliniciens, sociologues et travailleurs sociaux certifiés. Partenariats étroits avec les départements de Psychologie des universités d\'Abidjan pour la supervision et la recherche clinique appliquée.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-base font-bold text-stone-900">
                {isEn ? '"Parange-to-Guide" Mentorship' : 'Pôle « Parange à Guide »'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isEn
                  ? 'Trained angel parents who have navigated the deep waters of bereavement, offering active listening and co-facilitation. They embody living proof that healing is possible without forgetting.'
                  : 'Parents ayant eux-mêmes traversé le deuil, formés aux techniques d\'écoute active et de co-animation. Ils apportent la preuve vivante qu\'il est possible de se relever sans oublier.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-teal-200 bg-teal-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-base font-bold text-stone-900">
                {isEn ? 'Community Relays & Volunteers' : 'Bénévoles Solidaires & Relais'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isEn
                  ? 'A dedicated network of hospital ambassadors in maternity wards, healthcare centers and local communities to distribute Memory Kits and guide families to our helpline.'
                  : 'Réseau d\'ambassadeurs dans les maternités, associations de femmes et quartiers populaires pour briser le tabou, distribuer les Kits de Deuil et orienter les familles vers notre ligne d\'écoute.'}
              </p>
            </div>
          </div>
        </div>

        {/* Espace Partenariats, ONGs Internationales & Mentorat */}
        <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-stone-900/5 rounded-3xl p-8 sm:p-10 border-2 border-amber-300 shadow-md mb-16 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black uppercase">
                <Building2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Institutional Mentorship & International NGOs' : 'Mentorat Institutionnel & ONGs Internationales'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-accent text-stone-900">
                {isEn 
                  ? 'Presenting the Platform to a Prospective Mentor NGO'
                  : 'Présenter la Plateforme à une ONG Internationale Marraine'}
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                {isEn
                  ? 'Download our complete executive presentation dossier formatted specifically for international partners. Includes full feature breakdown, epidemiological data for Côte d\'Ivoire, competitive advantages, our 4 proposed mentorship pillars, and the 2026-2028 regional scale-up roadmap.'
                  : 'Téléchargez notre dossier exécutif officiel spécialement formaté pour les partenaires et mentors internationaux. Il présente toutes les fonctionnalités de la plateforme, les données de santé publique en Côte d\'Ivoire, les 4 piliers concrets du mentorat sollicité, et la feuille de route 2026-2028.'}
              </p>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded block text-center">
                  {isEn ? 'Mentorship Dossier (PDF)' : 'Dossier Mentorat (PDF)'}
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleDownloadFR}
                    disabled={downloadingMentorat === 'fr'}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-stone-950" />
                    <span>{downloadingMentorat === 'fr' ? 'Génération...' : '🇫🇷 Mentorat (FR)'}</span>
                  </button>
                  <button
                    onClick={handleDownloadEN}
                    disabled={downloadingMentorat === 'en'}
                    className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-400/40 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    <span>{downloadingMentorat === 'en' ? 'Generating...' : '🇬🇧 Mentorship (EN)'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-amber-200/60">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded block text-center">
                  {isEn ? 'Strategic Presentation & Pitch Deck (PDF)' : 'Présentation Stratégique & Impact (PDF)'}
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleDownloadPresFR}
                    disabled={downloadingPresentation === 'fr'}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingPresentation === 'fr' ? 'Génération...' : '🇫🇷 Présentation (FR)'}</span>
                  </button>
                  <button
                    onClick={handleDownloadPresEN}
                    disabled={downloadingPresentation === 'en'}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-teal-200 border border-teal-400/40 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-300" />
                    <span>{downloadingPresentation === 'en' ? 'Generating...' : '🇬🇧 Pitch Deck (EN)'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center py-6">
          <button
            onClick={onOpenConsultationModal}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base shadow-lg transition-transform hover:scale-102 cursor-pointer"
          >
            <PhoneCall className="w-5 h-5" />
            <span>{isEn ? 'Connect with our compassionate listening team' : 'Prendre contact avec notre équipe d\'écoute'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
