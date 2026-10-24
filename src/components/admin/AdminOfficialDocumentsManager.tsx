import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Building2, 
  Eye, 
  Check, 
  BookOpen, 
  ShieldCheck, 
  Globe,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Heart,
  Calendar,
  Lock,
  Phone
} from 'lucide-react';
import { 
  telechargerCahierDesChargesPDF, 
  telechargerDossierPresentationPDF,
  downloadTechnicalSpecificationsPDF_EN,
  downloadStrategicPresentationPDF_EN,
  telechargerDossierMentoratONGInternationalePDF,
  downloadInternationalNGOMentorshipPitchPDF_EN,
  telechargerStatutsONG_PDF,
  telechargerGuideDeuilParental_PDF,
  telechargerRapportAnnuelActivite_PDF
} from '../../utils/pdfGenerator';

export type DocCategory = 'all' | 'rapports' | 'guides' | 'statuts' | 'mentorat' | 'technique';

export interface StrategicDocumentItem {
  id: string;
  category: 'rapports' | 'guides' | 'statuts' | 'mentorat' | 'technique';
  categoryLabel: string;
  title: string;
  subtitle: string;
  version: string;
  date: string;
  language: 'fr' | 'en' | 'bilingual';
  description: string;
  keyPoints: string[];
  audience: string;
  downloadActionFR?: () => void;
  downloadActionEN?: () => void;
  previewPages: {
    pageNumber: number;
    title: string;
    sections: {
      subtitle?: string;
      content: string;
      isCallout?: boolean;
      table?: { headers: string[]; rows: string[][] };
      bullets?: string[];
    }[];
  }[];
}

export const AdminOfficialDocumentsManager: React.FC = () => {
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DocCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Integrated PDF Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<StrategicDocumentItem | null>(null);
  const [previewPageIndex, setPreviewPageIndex] = useState(0);
  const [previewZoom, setPreviewZoom] = useState<number>(100);

  const showSuccess = (msg: string) => {
    setDownloadSuccess(msg);
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  // -------------------------------------------------------------
  // LIST OF OFFICIAL STRATEGIC DOCUMENTS WITH RICH PREVIEW PAGES
  // -------------------------------------------------------------
  const DOCUMENTS: StrategicDocumentItem[] = useMemo(() => [
    {
      id: 'doc-mentorat',
      category: 'mentorat',
      categoryLabel: 'Mentorat & Dossiers Bailleurs',
      title: "Dossier de Présentation & Candidature au Mentorat Institutionnel",
      subtitle: "International NGO Mentorship Proposal & Flagship Strategic Pitch Deck",
      version: "Édition Exécutive 2026-2028",
      date: "2026",
      language: 'bilingual',
      audience: "ONGs Internationales Marraines, Bailleurs Multilatéraux, Fonds de Dotation",
      description: "Dossier exécutif formaté selon les normes des grands réseaux humanitaires mondiaux. Diagnostic sanitaire en Côte d'Ivoire, les 8 modules de l'écosystème, modèle économique hybride, et les 4 piliers du mentorat sollicité.",
      keyPoints: [
        "Inclusivité universelle absolue : accueil de tout parent ayant perdu un enfant, de la mort in utero à l'âge adulte avancé",
        "Architecture des 8 modules (Sanctuaire, Écoute 24/7, Carnet Émotionnel Sécurisé par ID/PIN, Kits CHU, Formation Soignants, Groupe Facebook)",
        "Feuille de route 2026-2028 et alignement ODD 3, 5 et 17"
      ],
      downloadActionFR: () => {
        setDownloadingDoc('mentorat_fr');
        try {
          telechargerDossierMentoratONGInternationalePDF();
          showSuccess("Dossier de Mentorat (FR) téléchargé avec succès (PDF).");
        } finally {
          setDownloadingDoc(null);
        }
      },
      downloadActionEN: () => {
        setDownloadingDoc('mentorat_en');
        try {
          downloadInternationalNGOMentorshipPitchPDF_EN();
          showSuccess("International Mentorship Proposal (EN) downloaded successfully (PDF).");
        } finally {
          setDownloadingDoc(null);
        }
      },
      previewPages: [
        {
          pageNumber: 1,
          title: "Résumé Exécutif & Vision Fondatrice",
          sections: [
            {
              isCallout: true,
              subtitle: "PRINCIPE CARDINAL D'INCLUSIVITÉ UNIVERSELLE",
              content: "Le Jardin de l'Espoir : Parange accueille et accompagne TOUTE personne ayant perdu au moins 1 enfant, quel que soit l'âge de l'enfant disparu : qu'il soit mort-né (mort in utero, fausse couche tardive, interruption médicale de grossesse) ou décédé à un âge avancé (nourrisson, jeune enfant, adolescent, adulte). Pour des parents, la perte d'un enfant défie l'ordre naturel des générations. On reste Parange pour toujours."
            },
            {
              subtitle: "Mission & Positionnement en Côte d'Ivoire",
              content: "Première organisation ivoirienne structurée dédiée exclusivement au soutien psychologique, à la réhabilitation psychosociale et à la mémoire digne des parents endeuillés. Notre écosystème allie un sanctuaire numérique empathique, une ligne d'écoute 24/7, une communauté Facebook active, des kits de mémoire et des formations en CHU."
            }
          ]
        },
        {
          pageNumber: 2,
          title: "Les 8 Modules de l'Écosystème & Le Carnet Émotionnel Sécurisé",
          sections: [
            {
              subtitle: "Module Innovant : Carnet & Journal Émotionnel Sécurisé (ID & Mot de Passe)",
              content: "Espace intime souverain protégé par identifiant unique et mot de passe secret. Le parent peut entièrement customiser son carnet (6 couleurs apaisantes de reliure, 7 motifs sacrés d'anges et fleurs, ex-libris de dédicace), enregistrer sa météo quotidienne (1/5 à 5/5, 12 émotions, sommeil) et mesurer le chemin de sa résilience avec garantie de confidentialité locale."
            },
            {
              subtitle: "Tableau Comparatif d'Impact Sanitaire",
              content: "Mesure de la résorption du traumatisme parental et désenclavement du deuil en Afrique de l'Ouest :",
              table: {
                headers: ["Indicateur Sanitaire", "Constat Terrain Côte d'Ivoire", "Réponse Jardin de l'Espoir"],
                rows: [
                  ["Mortalité néonatale", "~28 pour 1 000 naissances vivantes", "Prise en charge hospitalière & boîtes mémoires"],
                  ["Décès d'enfants de tout âge", "Accidents, maladies, drames", "Accueil inconditionnel sans restriction d'âge"],
                  ["Prise en charge psychologique", "Inférieure à 2% dans les structures publiques", "Écoute gratuite 24/7 & Groupes de Soutien GSP"],
                  ["Tabou et isolement", "Silence imposé, mères culpabilisées", "Groupe Facebook d'entraide & libération de la parole"]
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: 'doc-presentation',
      category: 'mentorat',
      categoryLabel: 'Mentorat & Dossiers Bailleurs',
      title: "Dossier de Présentation Stratégique & Plaquette d'Impact",
      subtitle: "Strategic Presentation Dossier & Pitch Deck (Impact Investors, Health Ministries & Families)",
      version: "Édition Officielle 2026",
      date: "2026",
      language: 'bilingual',
      audience: "Investisseurs d'Impact, Ministère de la Santé, CHU, Mécènes et Familles",
      description: "Plaquette tripartite articulée autour des 3 piliers d'action : impact socio-économique & pérennité financière (SROI) pour les investisseurs, protocoles hospitaliers (CHU & cliniques), et guide d'accueil bienveillant pour les familles.",
      keyPoints: [
        "Volet Investisseurs : SROI, modèle de rentabilité hybride et indicateurs clés d'impact",
        "Volet Partenaires Santé : Pont hôpital-domicile et kits d'empreintes pédiatriques",
        "Volet Familles : Écoute 24/7, Carnet secret personnalisé et communauté Facebook active"
      ],
      downloadActionFR: () => {
        setDownloadingDoc('presentation_fr');
        try {
          telechargerDossierPresentationPDF();
          showSuccess("Dossier de Présentation (FR) téléchargé avec succès (PDF).");
        } finally {
          setDownloadingDoc(null);
        }
      },
      downloadActionEN: () => {
        setDownloadingDoc('presentation_en');
        try {
          downloadStrategicPresentationPDF_EN();
          showSuccess("Strategic Presentation (EN) downloaded successfully (PDF).");
        } finally {
          setDownloadingDoc(null);
        }
      },
      previewPages: [
        {
          pageNumber: 1,
          title: "Vision Fondatrice & Inclusivité Tout Âge",
          sections: [
            {
              isCallout: true,
              subtitle: "ACCUEIL INCONDITIONNEL DE TOUTE PERTE D'ENFANT",
              content: "Le Jardin de l'Espoir : Parange s'adresse sans réserve à TOUTES les personnes ayant perdu au moins 1 enfant, quel que soit l'âge de l'enfant disparu : qu'il soit mort-né ou mort à un âge avancé. Pour un parent, le départ d'un enfant est une déchirure éternelle qui transcende les âges."
            },
            {
              subtitle: "Trois Piliers d'Intervention",
              bullets: [
                "1. Pour les Investisseurs d'Impact : Santé mentale maternelle, prévention du décrochage économique familial et SROI démontré.",
                "2. Pour les Hôpitaux & Soignants : Protocole de bientraitance deuil et remise de la boîte à souvenirs en salle d'accouchement.",
                "3. Pour les Parents & Fratries : Écoute 7j/7, Carnet émotionnel intime protégé par ID/PIN, Jardin des fleurs éternelles et Groupe Facebook."
              ],
              content: "Notre mission brise le silence et fait éclore l'espoir au cœur des épreuves les plus intenses."
            }
          ]
        }
      ]
    },
    {
      id: 'doc-rapports-annuels',
      category: 'rapports',
      categoryLabel: 'Rapports Annuels',
      title: "Rapport Annuel d'Activité & Bilan d'Impact 2025-2026",
      subtitle: "Rapport moral, financier et opérationnel certifié pour l'Assemblée Générale et les Bailleurs",
      version: "Exercice Clos 2025-2026",
      date: "2026",
      language: 'fr',
      audience: "Bailleurs Multilatéraux, Conseil d'Administration, Ministère de la Santé, Partenaires",
      description: "Synthèse des réalisations opérationnelles : 1 420 familles accompagnées, 1 850 appels d'urgence traités, 890 kits de mémoire remis en maternités, déploiement du carnet émotionnel privé et perspectives d'antennes régionales.",
      keyPoints: [
        "Statistiques réelles d'accompagnement : +1 420 familles paranges soutenues",
        "Partenariats hospitaliers actifs avec les CHU de Cocody, Treichville et Yopougon",
        "Plaidoyer national pour la reconnaissance officielle d'un congé deuil parental en Côte d'Ivoire"
      ],
      downloadActionFR: () => {
        setDownloadingDoc('rapport_fr');
        try {
          telechargerRapportAnnuelActivite_PDF();
          showSuccess("Rapport Annuel d'Activité 2025-2026 téléchargé avec succès (PDF).");
        } finally {
          setDownloadingDoc(null);
        }
      },
      previewPages: [
        {
          pageNumber: 1,
          title: "Bilan Moral & Chiffres Clés de l'Exercice",
          sections: [
            {
              subtitle: "Rapport de la Direction Exécutive",
              content: "L'exercice 2025-2026 a marqué un tournant historique avec l'accueil inconditionnel de familles endeuillées par la perte d'un enfant de tout âge. Grâce à l'engagement bénévole et au soutien des donateurs, la plateforme a permis d'apporter un réconfort direct à plus de 1 420 foyers.",
              table: {
                headers: ["Axe d'Intervention", "Réalisé 2025-2026", "Taux de Réalisation"],
                rows: [
                  ["Familles accompagnées (écoute & GSP)", "1 420 familles", "102%"],
                  ["Appels d'urgence traités 7j/7", "1 850 appels", "115%"],
                  ["Boîtes de mémoire distribuées", "890 kits", "111%"],
                  ["Veilleuses & fleurs mémorielles", "2 640 anges", "105%"]
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: 'doc-guides-deuil',
      category: 'guides',
      categoryLabel: 'Guides de Deuil & Prise en Charge',
      title: "Guide d'Accompagnement du Deuil Parental pour Toutes les Familles",
      subtitle: "Guide clinique, psycho-émotionnel et fraternel pour les paranges (deuil périnatal & tout âge)",
      version: "Édition 2026",
      date: "2026",
      language: 'fr',
      audience: "Mères, Pères, Couples, Fratries, Grands-Parents et Soignants Relais",
      description: "Ouvrage de référence rédigé par des psychologues cliniciens et des pairs-aidants. Les étapes du deuil parental, les conseils pour surmonter l'angoisse et la culpabilité, l'utilisation du carnet émotionnel privé et les rituels de mémoire.",
      keyPoints: [
        "Accueil de toute perte d'enfant sans distinction d'âge (mort-né à l'âge adulte)",
        "Outils pratiques d'apaisement : météo intérieure, carnet intime et cercles de parole",
        "Conseils pour préserver le couple et accompagner la fratrie en deuil"
      ],
      downloadActionFR: () => {
        setDownloadingDoc('guide_fr');
        try {
          telechargerGuideDeuilParental_PDF();
          showSuccess("Guide d'Accompagnement du Deuil Parental téléchargé avec succès (PDF).");
        } finally {
          setDownloadingDoc(null);
        }
      },
      previewPages: [
        {
          pageNumber: 1,
          title: "Introduction Bienveillante & Accueil du Deuil",
          sections: [
            {
              isCallout: true,
              subtitle: "VOUS N'ÊTES PAS SEULS DANS CE DÉSERT",
              content: "La disparition d'un enfant est la blessure la plus vive qu'un cœur humain puisse porter. Quel que soit le moment où votre enfant vous a quitté – avant la naissance ou après des décennies à vos côtés –, son existence est sacrée et votre douleur mérite un respect infini."
            },
            {
              subtitle: "Outils de Résilience Proposés par l'ONG",
              bullets: [
                "La ligne d'écoute gratuite disponible 7j/7 pour déposer vos larmes sans crainte du jugement.",
                "Le Groupe Facebook officiel des Paranges pour échanger au quotidien avec d'autres parents qui comprennent.",
                "Le Carnet Émotionnel Sécurisé par ID et mot de passe pour suivre votre météo intérieure intime.",
                "Le Jardin Virtuel des Anges pour semer une fleur éternelle et allumer une bougie de souvenir."
              ],
              content: "Chaque pas compte. Prenez le temps d'accueillir votre chagrin avec tendresse."
            }
          ]
        }
      ]
    },
    {
      id: 'doc-statuts-ong',
      category: 'statuts',
      categoryLabel: 'Statuts & Juridique ONG',
      title: "Statuts Constitutifs Officiels Déposés de l'ONG",
      subtitle: "Régie par la loi n° 60-315 du 21 septembre 1960 relative aux associations en Côte d'Ivoire",
      version: "Statuts Déposés & Certifiés",
      date: "2026",
      language: 'fr',
      audience: "Ministère de l'Intérieur, Bailleurs Institutionnels, Membres de l'ONG",
      description: "Texte fondateur légal définissant la dénomination, le siège social à Abidjan, l'objet social exclusif (soutien au deuil parental de tout âge), les règles de gouvernance, l'Assemblée Générale, et la comptabilité SYSCOHADA.",
      keyPoints: [
        "Dénomination officielle : « LE JARDIN DE L'ESPOIR : PARANGE »",
        "Objet statutaire : soutien psychologique, réhabilitation psychosociale et mémoire digne",
        "Organisation démocratique : AG souveraine, CA de 7 membres, Comité Clinique et Direction Exécutive"
      ],
      downloadActionFR: () => {
        setDownloadingDoc('statuts_fr');
        try {
          telechargerStatutsONG_PDF();
          showSuccess("Statuts Officiels de l'ONG téléchargés avec succès (PDF).");
        } finally {
          setDownloadingDoc(null);
        }
      },
      previewPages: [
        {
          pageNumber: 1,
          title: "Articles Fondateurs & Objet Social Exclusif",
          sections: [
            {
              subtitle: "Article 1 à 3 : Création, Siège et Périmètre d'Action",
              content: "Il est constitué à Abidjan une Organisation Non Gouvernementale régie par la loi du 21 septembre 1960, ayant pour dénomination « LE JARDIN DE L'ESPOIR : PARANGE ».",
              isCallout: true
            },
            {
              subtitle: "Objet Social Certifié",
              content: "L'ONG a pour objet exclusif de venir en aide à toute personne ayant perdu au moins 1 enfant quel que soit son âge, d'assurer une écoute 24/7, de délivrer des kits mémoriels dans les maternités, de maintenir un sanctuaire numérique et de sensibiliser la société ivoirienne contre la stigmatisation des paranges."
            }
          ]
        }
      ]
    },
    {
      id: 'doc-cahier-des-charges',
      category: 'technique',
      categoryLabel: 'Spécifications Techniques',
      title: "Cahier des Charges Fonctionnel & Technique",
      subtitle: "Functional & Technical Specifications (V2.4 Comprehensive System Architecture)",
      version: "Version Technique 2.4",
      date: "2026",
      language: 'bilingual',
      audience: "Équipes d'Ingénierie Logicielle, DSI Bailleurs, Auditeurs Informatiques",
      description: "Document de référence en 5 chapitres détaillant l'architecture applicative : écoute d'urgence 24/7, Jardin Virtuel des Anges, Carnet Émotionnel PWA 100% privé avec ID/PIN, forum de modération et sécurité React 19.",
      keyPoints: [
        "Spécifications complètes des 8 modules fonctionnels",
        "Protocoles de confidentialité zéro-télémétrie et chiffrement local des carnets",
        "Architecture PWA low-bandwidth optimisée pour les réseaux mobiles africains"
      ],
      downloadActionFR: () => {
        setDownloadingDoc('cahier_fr');
        try {
          telechargerCahierDesChargesPDF();
          showSuccess("Cahier des Charges (FR) téléchargé avec succès (PDF).");
        } finally {
          setDownloadingDoc(null);
        }
      },
      downloadActionEN: () => {
        setDownloadingDoc('cahier_en');
        try {
          downloadTechnicalSpecificationsPDF_EN();
          showSuccess("Technical Specifications (EN) downloaded successfully (PDF).");
        } finally {
          setDownloadingDoc(null);
        }
      },
      previewPages: [
        {
          pageNumber: 1,
          title: "Architecture Système & Modules Applicatifs",
          sections: [
            {
              subtitle: "Périmètre Applicatif Global",
              content: "L'infrastructure logicielle 'Le Jardin de l'Espoir : Parange' comprend 8 sous-systèmes interconnectés assurant l'écoute d'urgence, le sanctuaire mémoriel, le carnet privé chiffré, la modération administrative et les exports de conformité."
            }
          ]
        }
      ]
    }
  ], []);

  // Filtered documents by category and search query
  const filteredDocuments = useMemo(() => {
    return DOCUMENTS.filter(doc => {
      const matchCat = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [DOCUMENTS, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* En-tête Principal de la Section Documents */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <FileText className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Centre de Documentation Officielle & Stratégique</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>Documents Bilingues (FR & EN) • Certifiés 2026</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif-accent text-white tracking-tight">
            Documents Stratégiques, Rapports & Spécifications Officielles
          </h2>

          <p className="text-emerald-100/85 text-xs sm:text-sm leading-relaxed">
            Consultez, filtrez et prévisualisez en direct l'ensemble des documents institutionnels de <strong>Le Jardin de l'Espoir : Parange</strong> : statuts déposés, rapports annuels, guides cliniques du deuil parental (tout âge), dossiers de mentorat et spécifications techniques.
          </p>

          {/* Quick Direct Download Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => {
                telechargerDossierMentoratONGInternationalePDF();
                showSuccess("Dossier Mentorat ONG (FR) téléchargé.");
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3 h-3 text-stone-950" />
              <span>★ 1. Dossier Mentorat ONG (FR)</span>
            </button>
            <button
              onClick={() => {
                telechargerStatutsONG_PDF();
                showSuccess("Statuts Officiels ONG téléchargés.");
              }}
              className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3 h-3 text-stone-950" />
              <span>2. Statuts Juridiques ONG (PDF)</span>
            </button>
            <button
              onClick={() => {
                telechargerGuideDeuilParental_PDF();
                showSuccess("Guide Pratique Deuil Parental téléchargé.");
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>3. Guide Pratique Deuil (Tout Âge)</span>
            </button>
            <button
              onClick={() => {
                telechargerRapportAnnuelActivite_PDF();
                showSuccess("Rapport Annuel 2025-2026 téléchargé.");
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-400/40 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>4. Rapport Annuel d'Activité</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification de succès */}
      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">{downloadSuccess}</p>
        </div>
      )}

      {/* BARRE DE FILTRES PAR TYPE DE DOCUMENT & RECHERCHE */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Pills de Catégories */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filtres :
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Tous ({DOCUMENTS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('rapports')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedCategory === 'rapports'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Rapports Annuels
            </button>
            <button
              onClick={() => setSelectedCategory('guides')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedCategory === 'guides'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Guides de Deuil
            </button>
            <button
              onClick={() => setSelectedCategory('statuts')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedCategory === 'statuts'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Statuts ONG
            </button>
            <button
              onClick={() => setSelectedCategory('mentorat')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedCategory === 'mentorat'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Mentorat & Bailleurs
            </button>
            <button
              onClick={() => setSelectedCategory('technique')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedCategory === 'technique'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Technique & Cahier
            </button>
          </div>

          {/* Recherche */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un document..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* GRILLE DES DOCUMENTS STRATÉGIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <div 
            key={doc.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              
              {/* Category & Version Tag */}
              <div className="flex items-start justify-between gap-3">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                  {doc.categoryLabel}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {doc.version}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900 font-serif-accent leading-snug">
                  {doc.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-1 italic">
                  {doc.subtitle}
                </p>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                {doc.description}
              </p>

              {/* Key points */}
              <div className="space-y-1.5 pt-1">
                {doc.keyPoints.slice(0, 2).map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-stone-700">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions : Prévisualisation Intégrée & Téléchargements */}
            <div className="pt-4 border-t border-stone-100 space-y-2.5">
              
              {/* Bouton de Prévisualisation PDF intégrée */}
              <button
                onClick={() => {
                  setPreviewDoc(doc);
                  setPreviewPageIndex(0);
                  setPreviewZoom(100);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 text-stone-700 font-bold text-xs flex items-center justify-center gap-2 border border-stone-200 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                <span>Prévisualiser le PDF (Lecteur intégré)</span>
              </button>

              {/* Boutons Téléchargement FR / EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {doc.downloadActionFR && (
                  <button
                    onClick={doc.downloadActionFR}
                    className="py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>🇫🇷 PDF (FR)</span>
                  </button>
                )}

                {doc.downloadActionEN && (
                  <button
                    onClick={doc.downloadActionEN}
                    className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-amber-300" />
                    <span>🇬🇧 PDF (EN)</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* MODAL DE PRÉVISUALISATION PDF INTÉGRÉE (EMBEDDED VIEWER)  */}
      {/* ========================================================= */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div 
            className="relative w-full max-w-5xl bg-[#f5f2eb] rounded-3xl shadow-2xl border border-stone-300 overflow-hidden my-auto flex flex-col max-h-[94vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du Viewer PDF */}
            <div className="p-4 sm:p-5 bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded">
                      Prévisualisation PDF
                    </span>
                    <span className="text-xs text-stone-400">
                      Page {previewPageIndex + 1} sur {previewDoc.previewPages.length}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                    {previewDoc.title}
                  </h3>
                </div>
              </div>

              {/* Contrôles du Viewer (Zoom, Télécharger, Fermer) */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <div className="flex items-center bg-stone-800 rounded-xl p-1 text-xs">
                  <button
                    onClick={() => setPreviewZoom(Math.max(80, previewZoom - 10))}
                    className="p-1.5 hover:bg-stone-700 rounded-lg text-stone-300"
                    title="Zoom arrière"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-[11px] font-mono font-bold text-amber-300">{previewZoom}%</span>
                  <button
                    onClick={() => setPreviewZoom(Math.min(130, previewZoom + 10))}
                    className="p-1.5 hover:bg-stone-700 rounded-lg text-stone-300"
                    title="Zoom avant"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {previewDoc.downloadActionFR && (
                  <button
                    onClick={previewDoc.downloadActionFR}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Télécharger PDF</span>
                  </button>
                )}

                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Fermer la prévisualisation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Corps du Viewer : Rendu d'une Feuille PDF Réaliste */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
              <div 
                className="bg-white rounded-2xl shadow-xl border border-stone-300 p-8 sm:p-12 w-full max-w-3xl space-y-6 text-stone-800 transition-transform origin-top"
                style={{ transform: `scale(${previewZoom / 100})` }}
              >
                {/* En-tête officiel de la feuille */}
                <div className="border-b-2 border-stone-900 pb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                      RÉPUBLIQUE DE CÔTE D'IVOIRE • ORGANISATION NON GOUVERNEMENTALE
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif-accent text-stone-900 mt-1">
                      LE JARDIN DE L'ESPOIR : PARANGE
                    </h2>
                    <p className="text-[11px] text-stone-500 italic">
                      Sanctuaire & Écosystème pour Toute Personne Ayant Perdu au Moins 1 Enfant (Tout Âge)
                    </p>
                  </div>
                  <div className="text-right text-[10px] text-stone-400 font-mono">
                    <div>{previewDoc.version}</div>
                    <div>{previewDoc.date}</div>
                  </div>
                </div>

                {/* Contenu de la page actuelle */}
                {(() => {
                  const currentPage = previewDoc.previewPages[previewPageIndex] || previewDoc.previewPages[0];
                  if (!currentPage) return null;

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <h4 className="text-base font-bold font-serif-accent text-emerald-950">
                          {currentPage.title}
                        </h4>
                        <span className="text-[11px] text-stone-400 font-mono">
                          Page {currentPage.pageNumber}
                        </span>
                      </div>

                      {currentPage.sections.map((sec, sIdx) => (
                        <div 
                          key={sIdx} 
                          className={sec.isCallout ? "bg-amber-50/70 p-4 rounded-xl border border-amber-300/80 space-y-1.5" : "space-y-2"}
                        >
                          {sec.subtitle && (
                            <h5 className={`text-xs font-bold uppercase tracking-wider ${sec.isCallout ? 'text-amber-900' : 'text-stone-800'}`}>
                              {sec.subtitle}
                            </h5>
                          )}
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                            {sec.content}
                          </p>

                          {sec.bullets && (
                            <ul className="space-y-1.5 pt-1 pl-2 text-xs text-stone-700">
                              {sec.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-2">
                                  <span className="text-emerald-700 font-bold">•</span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {sec.table && (
                            <div className="overflow-x-auto pt-2">
                              <table className="w-full text-left text-xs border border-stone-200 rounded-lg overflow-hidden">
                                <thead className="bg-stone-100 text-stone-800 font-bold">
                                  <tr>
                                    {sec.table.headers.map((h, hIdx) => (
                                      <th key={hIdx} className="p-2 border-b border-stone-200">{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {sec.table.rows.map((r, rIdx) => (
                                    <tr key={rIdx} className="border-b border-stone-100 hover:bg-stone-50">
                                      {r.map((c, cIdx) => (
                                        <td key={cIdx} className="p-2 text-stone-600">{c}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Pied de page officiel avec cachet */}
                <div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-stone-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                    <span>Document officiel certifié • Le Jardin de l'Espoir : Parange</span>
                  </div>
                  <div>
                    Permanence d'Écoute : +225 07 59 87 21 61 / 05 75 23 93 12
                  </div>
                </div>

              </div>
            </div>

            {/* Pagination du Viewer */}
            {previewDoc.previewPages.length > 1 && (
              <div className="p-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 shrink-0">
                <button
                  onClick={() => setPreviewPageIndex(Math.max(0, previewPageIndex - 1))}
                  disabled={previewPageIndex === 0}
                  className="px-3 py-1 rounded-lg border border-stone-300 font-bold hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Page précédente
                </button>
                <span>
                  Page <strong>{previewPageIndex + 1}</strong> sur <strong>{previewDoc.previewPages.length}</strong>
                </span>
                <button
                  onClick={() => setPreviewPageIndex(Math.min(previewDoc.previewPages.length - 1, previewPageIndex + 1))}
                  disabled={previewPageIndex >= previewDoc.previewPages.length - 1}
                  className="px-3 py-1 rounded-lg border border-stone-300 font-bold hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Page suivante →
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
