import React, { useState, useMemo, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Smartphone, 
  CreditCard, 
  Calendar,
  Sparkles,
  Download,
  CheckCircle2,
  Plus,
  Trash2,
  FileText,
  Filter,
  Search,
  Sliders,
  Check,
  X,
  ShieldCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Receipt,
  PieChart as PieIcon,
  HelpCircle
} from 'lucide-react';
import { DonationRecord } from '../../types';
import { 
  FinancialMovement,
  telechargerBilanComptablePDF,
  telechargerGrandLivreComptablePDF,
  telechargerRapportAffectationFondsPDF,
  telechargerRecuFiscalDonPDF
} from '../../utils/pdfGenerator';

interface AdminDonationAnalyticsProps {
  donations?: DonationRecord[];
}

const INITIAL_FINANCIAL_MOVEMENTS: FinancialMovement[] = [
  {
    id: 'mov-1',
    date: '2026-10-12',
    label: "Don solidaire anonyme - Vague de Lumière",
    type: 'entree',
    category: "Dons Publics",
    amount: 50000,
    paymentMethod: "Wave Mobile Money",
    referencePiece: "WAV-98214",
    beneficiaryOrDonor: "Donateur Anonyme"
  },
  {
    id: 'mov-2',
    date: '2026-10-10',
    label: "Achat fournitures 50 kits de mémoire CHU Cocody",
    type: 'sortie',
    category: "Programme Boîtes Mémoire",
    amount: 185000,
    paymentMethod: "Virement Bancaire",
    referencePiece: "FAC-2026-089",
    beneficiaryOrDonor: "Fournisseur Empreintes Argile CI"
  },
  {
    id: 'mov-3',
    date: '2026-10-08',
    label: "Subvention mécénat entreprise RSE Fondation Solidarité",
    type: 'entree',
    category: "Mécénat d'Entreprise",
    amount: 1500000,
    paymentMethod: "Virement Bancaire",
    referencePiece: "SUB-RSE-2026-03",
    beneficiaryOrDonor: "Fondation Bâtir Ensemble"
  },
  {
    id: 'mov-4',
    date: '2026-10-05',
    label: "Indemnités permanences écoutantes 24/7 (Septembre)",
    type: 'sortie',
    category: "Ligne d'Écoute 24/7",
    amount: 320000,
    paymentMethod: "Orange Money CI",
    referencePiece: "REM-ECOUTE-09",
    beneficiaryOrDonor: "Équipe Écoutantes Bénévoles"
  },
  {
    id: 'mov-5',
    date: '2026-10-02',
    label: "Collecte mensuelle paranges communauté Facebook",
    type: 'entree',
    category: "Dons Publics",
    amount: 420000,
    paymentMethod: "MTN Mobile Money",
    referencePiece: "MTN-44120",
    beneficiaryOrDonor: "Collectif Paranges CI"
  },
  {
    id: 'mov-6',
    date: '2026-09-28',
    label: "Honoraires supervision psychologues cliniciens cercles GSP",
    type: 'sortie',
    category: "Cercles de Parole GSP",
    amount: 250000,
    paymentMethod: "Chèque Bancaire",
    referencePiece: "CHQ-882103",
    beneficiaryOrDonor: "Cabinet Psychologie Abidjan"
  },
  {
    id: 'mov-7',
    date: '2026-09-24',
    label: "Frais serveurs PWA & télécoms ligne d'urgence",
    type: 'sortie',
    category: "Frais Généraux & PWA",
    amount: 75000,
    paymentMethod: "Carte Bancaire",
    referencePiece: "INFRA-2026-09",
    beneficiaryOrDonor: "Opérateur Télécoms Côte d'Ivoire"
  },
  {
    id: 'mov-8',
    date: '2026-09-18',
    label: "Don en mémoire d'un ange parti à l'âge adulte",
    type: 'entree',
    category: "Dons Publics",
    amount: 200000,
    paymentMethod: "Wave Mobile Money",
    referencePiece: "WAV-77190",
    beneficiaryOrDonor: "Famille Touré"
  }
];

export const AdminDonationAnalytics: React.FC<AdminDonationAnalyticsProps> = ({ donations = [] }) => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'depenses' | 'ledger' | 'documents'>('dashboard');
  const [chartView, setChartView] = useState<'total' | 'channels' | 'donors'>('total');

  // 1. BUDGET GOAL MANAGEMENT (Editable & Persisted)
  const [targetBudget, setTargetBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('jde_target_budget');
      return saved ? parseInt(saved, 10) : 20000000; // 20 millions FCFA par défaut
    } catch {
      return 20000000;
    }
  });

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState(targetBudget.toString());

  const handleSaveBudget = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseInt(tempBudgetInput.replace(/\s+/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) {
      setTargetBudget(parsed);
      try {
        localStorage.setItem('jde_target_budget', parsed.toString());
      } catch (err) {
        console.warn("Storage error", err);
      }
      setIsEditingBudget(false);
      showFeedback(`Objectif budgétaire annuel de l'ONG fixé à : ${parsed.toLocaleString('fr-FR')} FCFA`);
    }
  };

  // 2. FINANCIAL MOVEMENTS LEDGER (Persisted)
  const [movements, setMovements] = useState<FinancialMovement[]>(() => {
    try {
      const saved = localStorage.getItem('jde_financial_movements');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_FINANCIAL_MOVEMENTS;
    } catch {
      return INITIAL_FINANCIAL_MOVEMENTS;
    }
  });

  const saveMovements = (updated: FinancialMovement[]) => {
    setMovements(updated);
    try {
      localStorage.setItem('jde_financial_movements', JSON.stringify(updated));
    } catch (err) {
      console.warn("Storage error", err);
    }
  };

  // Add transaction modal state
  const [isAddingMovement, setIsAddingMovement] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<'entree' | 'sortie'>('entree');
  const [newCategory, setNewCategory] = useState("Dons Publics");
  const [newAmount, setNewAmount] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState("Wave Mobile Money");
  const [newRefPiece, setNewRefPiece] = useState('');
  const [newBeneficiary, setNewBeneficiary] = useState('');

  // Expenses management state
  const [expenseFilterCategory, setExpenseFilterCategory] = useState<string>('all');
  const [expenseSearch, setExpenseSearch] = useState<string>('');

  const openAddExpenseModal = () => {
    setNewType('sortie');
    setNewCategory("Programme Boîtes Mémoire");
    setNewPaymentMethod("Virement Bancaire");
    setNewLabel('');
    setNewAmount('');
    setNewRefPiece('');
    setNewBeneficiary('');
    setNewDate(new Date().toISOString().slice(0, 10));
    setIsAddingMovement(true);
  };

  // Ledger Filter & Search
  const [ledgerFilterType, setLedgerFilterType] = useState<'all' | 'entree' | 'sortie'>('all');
  const [ledgerSearch, setLedgerSearch] = useState('');

  // Feedback Notification
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  // 3. STATISTICAL AGGREGATIONS
  const totalEntrees = useMemo(() => {
    return movements
      .filter(m => m.type === 'entree')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [movements]);

  const totalSorties = useMemo(() => {
    return movements
      .filter(m => m.type === 'sortie')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [movements]);

  const soldeNet = totalEntrees - totalSorties;
  const progressPercent = Math.min(100, Math.round((totalEntrees / (targetBudget || 1)) * 100));
  const remainingToGoal = Math.max(0, targetBudget - totalEntrees);

  // Realistic monthly data aggregation for 2026 charts
  const monthlyData = useMemo(() => {
    return [
      { month: 'Jan 2026', total: 680000, wave: 320000, orange: 180000, mtn: 110000, carte: 70000, donors: 24 },
      { month: 'Fév 2026', total: 840000, wave: 410000, orange: 220000, mtn: 130000, carte: 80000, donors: 31 },
      { month: 'Mar 2026', total: 1120000, wave: 540000, orange: 290000, mtn: 170000, carte: 120000, donors: 39 },
      { month: 'Avr 2026', total: 980000, wave: 480000, orange: 250000, mtn: 150000, carte: 100000, donors: 35 },
      { month: 'Mai 2026', total: 1450000, wave: 720000, orange: 360000, mtn: 220000, carte: 150000, donors: 52 },
      { month: 'Juin 2026', total: 1290000, wave: 630000, orange: 330000, mtn: 200000, carte: 130000, donors: 46 },
      { month: 'Juil 2026', total: 1620000, wave: 810000, orange: 410000, mtn: 240000, carte: 160000, donors: 58 },
      { month: 'Août 2026', total: 1980000, wave: 990000, orange: 500000, mtn: 290000, carte: 200000, donors: 71 },
      { month: 'Sept 2026', total: 2450000, wave: 1250000, orange: 610000, mtn: 360000, carte: 230000, donors: 89 },
      { month: 'Oct 2026 (En cours)', total: 2890000, wave: 1490000, orange: 720000, mtn: 420000, carte: 260000, donors: 104 },
    ];
  }, []);

  const totalDonors = useMemo(() => {
    return monthlyData.reduce((acc, curr) => acc + curr.donors, 0);
  }, [monthlyData]);

  const formatCurrency = (val: number) => {
    return `${val.toLocaleString('fr-FR')} FCFA`;
  };

  // Add movement handler
  const handleAddMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(newAmount.replace(/\s+/g, ''), 10);
    if (!newLabel.trim() || isNaN(amountNum) || amountNum <= 0) {
      showFeedback("Veuillez renseigner un libellé valide et un montant positif.");
      return;
    }

    const newMov: FinancialMovement = {
      id: `mov-${Date.now()}`,
      date: newDate,
      label: newLabel.trim(),
      type: newType,
      category: newCategory,
      amount: amountNum,
      paymentMethod: newPaymentMethod,
      referencePiece: newRefPiece.trim() || `REF-${Date.now().toString().slice(-5)}`,
      beneficiaryOrDonor: newBeneficiary.trim() || (newType === 'entree' ? "Donateur" : "Bénéficiaire")
    };

    const updated = [newMov, ...movements];
    saveMovements(updated);
    setIsAddingMovement(false);
    setNewLabel('');
    setNewAmount('');
    setNewRefPiece('');
    setNewBeneficiary('');
    showFeedback(`Mouvement « ${newMov.label} » enregistré avec succès (+/- ${amountNum.toLocaleString('fr-FR')} FCFA).`);
  };

  // Delete movement handler
  const handleDeleteMovement = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette écriture comptable ?")) {
      const updated = movements.filter(m => m.id !== id);
      saveMovements(updated);
      showFeedback("Écriture comptable supprimée.");
    }
  };

  // Export Grand Livre as CSV
  const handleExportCSV = () => {
    let csv = "ID;Date;Type;Libelle;Categorie;Montant_FCFA;Mode_Reglement;Piece_Justificative;Tiers\n";
    movements.forEach(m => {
      csv += `"${m.id}";"${m.date}";"${m.type}";"${m.label}";"${m.category}";${m.type === 'entree' ? m.amount : -m.amount};"${m.paymentMethod}";"${m.referencePiece || ''}";"${m.beneficiaryOrDonor || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Grand_Livre_Comptable_Jardin_Espoir_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showFeedback("Grand Livre exporté au format tableur CSV.");
  };

  // Filtered movements for the ledger
  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      const matchType = ledgerFilterType === 'all' || m.type === ledgerFilterType;
      const matchSearch = ledgerSearch.trim() === '' ||
        m.label.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        m.category.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        m.paymentMethod.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        (m.referencePiece && m.referencePiece.toLowerCase().includes(ledgerSearch.toLowerCase())) ||
        (m.beneficiaryOrDonor && m.beneficiaryOrDonor.toLowerCase().includes(ledgerSearch.toLowerCase()));
      return matchType && matchSearch;
    });
  }, [movements, ledgerFilterType, ledgerSearch]);

  // Dedicated Expenses collection for NGO
  const expensesList = useMemo(() => {
    return movements.filter(m => m.type === 'sortie');
  }, [movements]);

  const filteredExpenses = useMemo(() => {
    return expensesList.filter(e => {
      const matchCat = expenseFilterCategory === 'all' || e.category === expenseFilterCategory;
      const matchSearch = expenseSearch.trim() === '' ||
        e.label.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        e.category.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        e.paymentMethod.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        (e.referencePiece && e.referencePiece.toLowerCase().includes(expenseSearch.toLowerCase())) ||
        (e.beneficiaryOrDonor && e.beneficiaryOrDonor.toLowerCase().includes(expenseSearch.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [expensesList, expenseFilterCategory, expenseSearch]);

  const totalExpensesAmount = useMemo(() => {
    return expensesList.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expensesList]);

  const budgetConsumptionPercent = Math.min(100, Math.round((totalExpensesAmount / (targetBudget || 1)) * 100));
  const remainingBudgetToSpend = Math.max(0, targetBudget - totalExpensesAmount);

  // Export Expenses as CSV
  const handleExportExpensesCSV = () => {
    let csv = "ID;Date;Libelle;Categorie;Montant_FCFA;Mode_Reglement;Piece_Justificative;Beneficiaire_Fournisseur\n";
    expensesList.forEach(m => {
      csv += `"${m.id}";"${m.date}";"${m.label}";"${m.category}";${m.amount};"${m.paymentMethod}";"${m.referencePiece || ''}";"${m.beneficiaryOrDonor || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Depenses_ONG_Jardin_Espoir_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showFeedback("Historique complet des dépenses de l'ONG exporté en format CSV.");
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-900 text-white p-3.5 rounded-2xl shadow-xl border border-stone-700 text-xs space-y-1.5">
          <p className="font-bold text-amber-300 border-b border-stone-800 pb-1">{label}</p>
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between gap-4 font-mono text-[11px]">
              <span style={{ color: item.color || item.fill }}>{item.name} :</span>
              <span className="font-bold">
                {typeof item.value === 'number' && item.name !== 'Donateurs' ? formatCurrency(item.value) : item.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* FEEDBACK TOAST */}
      {feedbackMsg && (
        <div className="bg-emerald-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl text-xs sm:text-sm font-semibold animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-emerald-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HEADER CARD WITH OBJECTIF BUDGET DEFINITION */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-5xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Module Trésorerie & Finances • Réservé aux Administrateurs</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Conforme Normes SYSCOHADA Associatif</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-accent text-white tracking-tight">
                Gestion des Finances & Évolution des Dons
              </h2>
              <p className="text-emerald-100/85 text-xs sm:text-sm leading-relaxed mt-1 max-w-2xl">
                Suivi intégral des entrées (dons Wave, Orange, MTN, subventions, mécénats) et des sorties opérationnelles de <strong>LE JARDIN DE L'ESPOIR : PARANGE</strong>, avec mise à jour instantanée des bilans officiels.
              </p>
            </div>

            {/* BOUTON DÉFINIR L'OBJECTIF BUDGET */}
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-amber-400/40 shrink-0 min-w-[260px] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-amber-300" />
                  Objectif Budget
                </span>
                <button
                  onClick={() => {
                    setTempBudgetInput(targetBudget.toString());
                    setIsEditingBudget(!isEditingBudget);
                  }}
                  className="text-[11px] underline text-emerald-200 hover:text-white font-bold cursor-pointer"
                >
                  {isEditingBudget ? 'Fermer' : 'Modifier'}
                </button>
              </div>

              {isEditingBudget ? (
                <form onSubmit={handleSaveBudget} className="space-y-2 pt-1 animate-in fade-in">
                  <input
                    type="number"
                    step="500000"
                    value={tempBudgetInput}
                    onChange={(e) => setTempBudgetInput(e.target.value)}
                    placeholder="Montant FCFA"
                    className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-amber-400/80 text-white text-xs font-mono font-bold"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      type="submit"
                      className="flex-1 py-1 px-2 rounded-lg bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingBudget(false)}
                      className="py-1 px-2 rounded-lg bg-stone-800 text-stone-300 text-xs"
                    >
                      Annuler
                    </button>
                  </div>
                  {/* Presets rapides */}
                  <div className="flex gap-1 pt-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setTempBudgetInput("15000000")}
                      className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-stone-300"
                    >
                      15M
                    </button>
                    <button
                      type="button"
                      onClick={() => setTempBudgetInput("20000000")}
                      className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-stone-300"
                    >
                      20M
                    </button>
                    <button
                      type="button"
                      onClick={() => setTempBudgetInput("25000000")}
                      className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-stone-300"
                    >
                      25M
                    </button>
                    <button
                      type="button"
                      onClick={() => setTempBudgetInput("30000000")}
                      className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-stone-300"
                    >
                      30M
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                    {formatCurrency(targetBudget)}
                  </div>
                  <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden mt-1.5">
                    <div 
                      className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${progressPercent}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-emerald-200 mt-1">
                    <span>{progressPercent}% réalisé</span>
                    <span>Reste : {formatCurrency(remainingToGoal)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`py-2 px-4 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'dashboard'
                ? 'bg-white text-stone-900 shadow-md scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            <span>1. Dashboard & Dons Recharts</span>
          </button>

          <button
            onClick={() => setActiveSubTab('depenses')}
            className={`py-2 px-4 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'depenses'
                ? 'bg-gradient-to-r from-rose-700 to-red-800 text-white shadow-md ring-2 ring-amber-400 scale-105'
                : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-amber-300" />
            <span>2. Dépenses & Budget ONG ({expensesList.length} dépenses • {budgetConsumptionPercent}% engagé)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ledger')}
            className={`py-2 px-4 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'ledger'
                ? 'bg-white text-stone-900 shadow-md scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-amber-500" />
            <span>3. Grand Livre des Flux ({movements.length} écritures)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('documents')}
            className={`py-2 px-4 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'documents'
                ? 'bg-white text-stone-900 shadow-md scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            <span>4. Bilans & Points Financiers (PDF/CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS SUMMARY BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Entrées */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Total Ressources Collectées</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black font-mono text-emerald-800">
            {formatCurrency(totalEntrees)}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold pt-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Dons Wave, Orange, MTN & Mécénats</span>
          </div>
        </div>

        {/* Total Dépenses / Sorties */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Total Dépenses Engagées</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black font-mono text-rose-800">
            {formatCurrency(totalSorties)}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-rose-600 font-semibold pt-1">
            <TrendingDown className="w-3 h-3" />
            <span>Actions sociales, kits mémoires & écoute</span>
          </div>
        </div>

        {/* Solde Net Disponible */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Solde Net de Trésorerie</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <p className={`text-xl sm:text-2xl font-black font-mono ${soldeNet >= 0 ? 'text-teal-800' : 'text-rose-600'}`}>
            {formatCurrency(soldeNet)}
          </p>
          <div className="text-[11px] text-stone-500 pt-1">
            Trésorerie saine & positive
          </div>
        </div>

        {/* Taux d'atteinte de l'Objectif Budget */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Taux Atteinte Objectif</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black font-mono text-amber-900">
            {progressPercent}%
          </p>
          <p className="text-[11px] text-stone-500 pt-1">
            Cible : {formatCurrency(targetBudget)}
          </p>
        </div>

      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: DASHBOARD & RECHARTS EVOLUTION GRAPHS         */}
      {/* ========================================================= */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-serif-accent flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>Évolution Mensuelle des Dons & Collectes (Exercice 2026)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Visualisation graphique interactive en Francs CFA (XOF)
                </p>
              </div>

              {/* View Mode Toggle Buttons */}
              <div className="inline-flex rounded-xl bg-stone-100 p-1 text-xs">
                <button
                  onClick={() => setChartView('total')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    chartView === 'total'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Total Cumulé
                </button>
                <button
                  onClick={() => setChartView('channels')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    chartView === 'channels'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Par Canal de Paiement
                </button>
                <button
                  onClick={() => setChartView('donors')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    chartView === 'donors'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Nombre de Donateurs
                </button>
              </div>
            </div>

            {/* Recharts Chart Area */}
            <div className="h-80 w-full pt-2">
              {chartView === 'total' && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#78716c' }} />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#78716c' }} 
                      tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      name="Dons Totaux" 
                      stroke="#0d9488" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorTotal)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {chartView === 'channels' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#78716c' }} />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#78716c' }} 
                      tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                    <Bar dataKey="wave" name="Wave Mobile Money" stackId="a" fill="#06b6d4" />
                    <Bar dataKey="orange" name="Orange Money CI" stackId="a" fill="#f97316" />
                    <Bar dataKey="mtn" name="MTN Mobile Money" stackId="a" fill="#eab308" />
                    <Bar dataKey="carte" name="Cartes & Virements" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {chartView === 'donors' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#78716c' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#78716c' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="donors" name="Donateurs" fill="#d97706" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: GESTION & SAISIE DES DÉPENSES DE L'ONG        */}
      {/* ========================================================= */}
      {activeSubTab === 'depenses' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header Card with Quick Actions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold mb-2 border border-rose-200">
                  <Receipt className="w-3.5 h-3.5 text-rose-600" />
                  <span>Grand Livre des Décaissements • Pôles d'Intervention</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif-accent text-stone-900">
                  Saisie & Suivi des Dépenses de l'ONG
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-2xl">
                  Enregistrez chaque facture, indemnité d'écoute, achat de kits pédiatriques ou aide d'urgence pour alimenter en direct les bilans financiers certifiés et contrôler la consommation du budget total.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={openAddExpenseModal}
                  className="py-3 px-5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Renseigner une Dépense</span>
                </button>

                <button
                  onClick={handleExportExpensesCSV}
                  className="py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Exporter toutes les dépenses en format Excel / CSV"
                >
                  <Download className="w-3.5 h-3.5 text-stone-500" />
                  <span>Exporter CSV</span>
                </button>

                <button
                  onClick={() => telechargerBilanComptablePDF(totalEntrees, totalSorties, soldeNet, targetBudget, movements.length)}
                  className="py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>Bilan PDF Officiel</span>
                </button>
              </div>
            </div>

            {/* SYNTHÈSE BUDGÉTAIRE DE L'ONG (BUDGET DÉFINI VS DÉPENSES ENGAGÉES) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Carte 1: Budget Total Annuel Fixé */}
              <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-2 border border-stone-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-amber-300" />
                    Budget Total ONG
                  </span>
                  <button
                    onClick={() => {
                      setTempBudgetInput(targetBudget.toString());
                      setIsEditingBudget(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[11px] underline text-emerald-300 hover:text-white font-bold cursor-pointer"
                  >
                    Modifier
                  </button>
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-white">
                  {formatCurrency(targetBudget)}
                </div>
                <p className="text-[10px] text-stone-400">
                  Enveloppe globale prévisionnelle d'intervention
                </p>
              </div>

              {/* Carte 2: Total des Dépenses Réelles */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                  <span>Dépenses Engagées</span>
                  <ArrowUpRight className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-rose-900">
                  {formatCurrency(totalExpensesAmount)}
                </div>
                <p className="text-[10px] text-rose-700">
                  {expensesList.length} décaissements comptabilisés
                </p>
              </div>

              {/* Carte 3: Solde de Budget Disponible */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span>Solde Budget Disponible</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-950">
                  {formatCurrency(remainingBudgetToSpend)}
                </div>
                <p className="text-[10px] text-emerald-700">
                  Crédit disponible pour les missions à venir
                </p>
              </div>

              {/* Carte 4: Taux de Consommation Budgétaire */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>Taux de Consommation</span>
                  <span className="font-mono">{budgetConsumptionPercent}%</span>
                </div>
                <div className="w-full bg-amber-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${budgetConsumptionPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-amber-800">
                  {budgetConsumptionPercent > 90 ? 'Alerte : Budget presque consommé' : 'Consommation conforme au plan d\'action'}
                </p>
              </div>

            </div>

            {/* VENTILATION ANALYTIQUE DES CHARGES PAR MISSION */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <PieIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>Ventilation Budgétaire & Dépenses par Pôle d'Utilisation de l'ONG</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {[
                  {
                    name: "Programme Boîtes Mémoire CHU",
                    plannedPercent: 25,
                    color: "border-amber-300 bg-amber-50/50 text-amber-950",
                    progressColor: "bg-amber-500"
                  },
                  {
                    name: "Actions Sociales & Écoute 24/7",
                    plannedPercent: 25,
                    color: "border-emerald-300 bg-emerald-50/50 text-emerald-950",
                    progressColor: "bg-emerald-600"
                  },
                  {
                    name: "Cercles de Parole GSP",
                    plannedPercent: 20,
                    color: "border-teal-300 bg-teal-50/50 text-teal-950",
                    progressColor: "bg-teal-600"
                  },
                  {
                    name: "Aide d'Urgence Obsèques & Familles",
                    plannedPercent: 15,
                    color: "border-rose-300 bg-rose-50/50 text-rose-950",
                    progressColor: "bg-rose-600"
                  },
                  {
                    name: "Formation Soignants CHU",
                    plannedPercent: 8,
                    color: "border-indigo-300 bg-indigo-50/50 text-indigo-950",
                    progressColor: "bg-indigo-600"
                  },
                  {
                    name: "Frais Généraux & PWA",
                    plannedPercent: 7,
                    color: "border-stone-300 bg-stone-50/50 text-stone-950",
                    progressColor: "bg-stone-600"
                  }
                ].map((pole, idx) => {
                  const spentInPole = expensesList
                    .filter(e => e.category.toLowerCase().includes(pole.name.toLowerCase().slice(0, 10)))
                    .reduce((acc, curr) => acc + curr.amount, 0);
                  const poleTarget = Math.round(targetBudget * (pole.plannedPercent / 100));
                  const poleConsumedPercent = Math.min(100, Math.round((spentInPole / (poleTarget || 1)) * 100));

                  return (
                    <div key={idx} className={`p-3.5 rounded-2xl border ${pole.color} space-y-2`}>
                      <div className="flex items-center justify-between font-bold">
                        <span className="truncate">{pole.name}</span>
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-white/80 border font-mono">
                          {pole.plannedPercent}% cible
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-stone-600">Dépensé : <strong>{spentInPole.toLocaleString('fr-FR')} F</strong></span>
                        <span className="text-stone-500">Cible : {poleTarget.toLocaleString('fr-FR')} F</span>
                      </div>
                      <div className="w-full bg-stone-200/80 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pole.progressColor}`}
                          style={{ width: `${poleConsumedPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FILTRES & RECHERCHE DES DÉPENSES */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                <span className="text-stone-500 font-bold shrink-0">Catégorie :</span>
                {[
                  { id: 'all', label: 'Toutes' },
                  { id: 'Programme Boîtes Mémoire', label: 'Boîtes Mémoire' },
                  { id: 'Ligne d\'Écoute 24/7', label: 'Écoute 24/7' },
                  { id: 'Cercles de Parole GSP', label: 'Cercles GSP' },
                  { id: 'Aide d\'Urgence Obsèques & Familles', label: 'Aides Familles' },
                  { id: 'Formation Soignants CHU', label: 'Formations' },
                  { id: 'Frais Généraux & PWA', label: 'Frais Généraux' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setExpenseFilterCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                      expenseFilterCategory === cat.id
                        ? 'bg-rose-700 text-white shadow-2xs'
                        : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={expenseSearch}
                  onChange={(e) => setExpenseSearch(e.target.value)}
                  placeholder="Rechercher dépense, tiers..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>
            </div>

            {/* TABLEAU DES DÉPENSES DE L'ONG */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-100/70 text-stone-700 font-bold">
                    <th className="p-3">Date</th>
                    <th className="p-3">Libellé de la Dépense</th>
                    <th className="p-3">Catégorie Mission</th>
                    <th className="p-3 text-right">Montant (FCFA)</th>
                    <th className="p-3">Règlement</th>
                    <th className="p-3">N° Pièce / Facture</th>
                    <th className="p-3">Fournisseur / Bénéficiaire</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-stone-500 italic">
                        Aucune dépense ne correspond aux critères de recherche.
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-rose-50/40 transition-colors">
                        <td className="p-3 font-mono text-stone-500 whitespace-nowrap">
                          {exp.date}
                        </td>
                        <td className="p-3 font-semibold text-stone-900">
                          {exp.label}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                            {exp.category}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-right text-rose-700 whitespace-nowrap">
                          -{exp.amount.toLocaleString('fr-FR')} F
                        </td>
                        <td className="p-3 text-stone-600">
                          {exp.paymentMethod}
                        </td>
                        <td className="p-3 font-mono text-stone-500 text-[11px]">
                          {exp.referencePiece || 'N/A'}
                        </td>
                        <td className="p-3 text-stone-700 font-medium">
                          {exp.beneficiaryOrDonor || 'Tiers officiel'}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteMovement(exp.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Supprimer cette dépense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Footer */}
            <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 gap-2">
              <div>
                Affichage de <strong>{filteredExpenses.length}</strong> dépense{filteredExpenses.length > 1 ? 's' : ''} sur un total de <strong>{expensesList.length}</strong>.
              </div>
              <div className="font-mono text-sm font-bold text-rose-800">
                Total sélectionné : -{filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('fr-FR')} FCFA
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: GRAND LIVRE DES FINANCES (ENTRÉES & SORTIES)   */}
      {/* ========================================================= */}
      {activeSubTab === 'ledger' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 animate-in fade-in">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-xl font-bold font-serif-accent text-stone-900">
                Grand Livre des Flux de Trésorerie (Entrées & Sorties)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Registre chronologique des recettes, dons reçus, subventions et dépenses opérationnelles.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsAddingMovement(true)}
                className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Mouvement Financier</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="py-2.5 px-3.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Exporter le grand livre en CSV pour Excel"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Exporter CSV</span>
              </button>
            </div>
          </div>

          {/* Filtres & Recherche du Grand Livre */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-bold">Type :</span>
              <button
                onClick={() => setLedgerFilterType('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  ledgerFilterType === 'all' ? 'bg-emerald-800 text-white' : 'bg-white text-stone-600 border border-stone-200'
                }`}
              >
                Tous ({movements.length})
              </button>
              <button
                onClick={() => setLedgerFilterType('entree')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  ledgerFilterType === 'entree' ? 'bg-emerald-800 text-white' : 'bg-white text-stone-600 border border-stone-200'
                }`}
              >
                Entrées ({movements.filter(m => m.type === 'entree').length})
              </button>
              <button
                onClick={() => setLedgerFilterType('sortie')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  ledgerFilterType === 'sortie' ? 'bg-rose-700 text-white' : 'bg-white text-stone-600 border border-stone-200'
                }`}
              >
                Sorties / Dépenses ({movements.filter(m => m.type === 'sortie').length})
              </button>
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder="Rechercher libellé, pièce..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Tableau des mouvements */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-stone-200 rounded-2xl overflow-hidden">
              <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 border-b border-stone-200">Date</th>
                  <th className="p-3 border-b border-stone-200">Type</th>
                  <th className="p-3 border-b border-stone-200">Libellé & Justificatif</th>
                  <th className="p-3 border-b border-stone-200">Catégorie</th>
                  <th className="p-3 border-b border-stone-200">Règlement</th>
                  <th className="p-3 border-b border-stone-200 text-right">Montant (FCFA)</th>
                  <th className="p-3 border-b border-stone-200 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3 font-mono text-stone-600 whitespace-nowrap">{mov.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        mov.type === 'entree' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {mov.type === 'entree' ? 'Entrée' : 'Dépense'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-stone-900">{mov.label}</div>
                      <div className="text-[10px] text-stone-400 flex items-center gap-2">
                        {mov.referencePiece && <span>Réf : {mov.referencePiece}</span>}
                        {mov.beneficiaryOrDonor && <span>• {mov.beneficiaryOrDonor}</span>}
                      </div>
                    </td>
                    <td className="p-3 text-stone-600">{mov.category}</td>
                    <td className="p-3 text-stone-600 whitespace-nowrap">{mov.paymentMethod}</td>
                    <td className="p-3 text-right font-mono font-bold whitespace-nowrap">
                      <span className={mov.type === 'entree' ? 'text-emerald-700' : 'text-rose-700'}>
                        {mov.type === 'entree' ? '+' : '-'}{mov.amount.toLocaleString('fr-FR')} FCFA
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteMovement(mov.id)}
                        className="text-stone-300 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Supprimer cette écriture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: DOCUMENTS COMPTABLES OFFICIELS TÉLÉCHARGEABLES */}
      {/* ========================================================= */}
      {activeSubTab === 'documents' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-900 text-xs font-bold mb-2">
                <Receipt className="w-3.5 h-3.5 text-teal-700" />
                <span>Documents Comptables & Fiscaux Officiels</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-accent text-stone-900">
                Livrables Comptables Mis à Jour Dynamiquement
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Ces documents sont générés en temps réel à partir de vos mouvements financiers et de votre objectif budgétaire. Ils répondent aux critères d'audit des bailleurs (AFD, USAID, Union Européenne) et de la législation ivoirienne.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* DOCUMENT 1: BILAN FINANCIER & COMPTE DE RÉSULTAT */}
              <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-stone-900 font-serif-accent">
                    1. Bilan Comptable & Compte de Résultat Officiel (PDF)
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Synthèse certifiée des produits ({formatCurrency(totalEntrees)}), des charges ({formatCurrency(totalSorties)}) et du solde net de trésorerie ({formatCurrency(soldeNet)}).
                  </p>
                </div>
                <button
                  onClick={() => {
                    telechargerBilanComptablePDF(totalEntrees, totalSorties, soldeNet, targetBudget, movements.length);
                    showFeedback("Bilan Comptable Officiel téléchargé avec succès (PDF).");
                  }}
                  className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger le Bilan Officiel (PDF)</span>
                </button>
              </div>

              {/* DOCUMENT 2: GRAND LIVRE GÉNÉRAL DE TRÉSORERIE */}
              <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-stone-900 font-serif-accent">
                    2. Grand Livre Général des Flux Financiers (PDF & CSV)
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Registre complet chronologique de tous les mouvements avec pièces justificatives, modes de règlement et solde progressif.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      telechargerGrandLivreComptablePDF(movements, totalEntrees, totalSorties, soldeNet);
                      showFeedback("Grand Livre de Trésorerie téléchargé (PDF).");
                    }}
                    className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Format PDF</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Format Tableur CSV</span>
                  </button>
                </div>
              </div>

              {/* DOCUMENT 3: RAPPORT D'AFFECTATION POUR LES BAILLEURS */}
              <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <PieIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-stone-900 font-serif-accent">
                    3. Rapport d'Affectation des Ressources & Bailleurs (PDF)
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Document d'audit pour les institutions financières et bailleurs (AFD, USAID, UE), justifiant l'allocation des fonds par pôle d'action humanitaire.
                  </p>
                </div>
                <button
                  onClick={() => {
                    telechargerRapportAffectationFondsPDF(totalEntrees, totalSorties, soldeNet);
                    showFeedback("Rapport d'Affectation des Ressources téléchargé (PDF).");
                  }}
                  className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger le Rapport d'Affectation (PDF)</span>
                </button>
              </div>

              {/* DOCUMENT 4: MODÈLE D'ATTESTATION & REÇU FISCAL DE DON */}
              <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-stone-900 font-serif-accent">
                    4. Attestation & Reçu Fiscal de Don (PDF)
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Modèle officiel délivré aux donateurs et mécènes d'entreprise pour déductibilité fiscale et traçabilité légale.
                  </p>
                </div>
                <button
                  onClick={() => {
                    telechargerRecuFiscalDonPDF("Donateur Exemplaire", 100000, "Wave Mobile Money", `RF-${Date.now().toString().slice(-6)}`);
                    showFeedback("Modèle officiel de Reçu Fiscal téléchargé (PDF).");
                  }}
                  className="py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Générer un Reçu Fiscal de Don (PDF)</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AJOUTER UN NOUVEAU MOUVEMENT FINANCIER            */}
      {/* ========================================================= */}
      {isAddingMovement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-stone-900 font-serif-accent">
                  Nouveau Mouvement Financier
                </h3>
              </div>
              <button
                onClick={() => setIsAddingMovement(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMovement} className="space-y-4 text-xs">
              
              {/* Type: Entrée ou Sortie */}
              <div>
                <label className="block text-stone-700 font-bold mb-1 uppercase tracking-wider">
                  Type d'opération *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewType('entree');
                      setNewCategory("Dons Publics");
                    }}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
                      newType === 'entree'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>Entrée (Ressource)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewType('sortie');
                      setNewCategory("Actions Sociales & Écoute 24/7");
                    }}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
                      newType === 'sortie'
                        ? 'bg-rose-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Sortie (Dépense)</span>
                  </button>
                </div>
              </div>

              {/* Date & Montant */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Montant en FCFA *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="500"
                    placeholder="Ex: 50000"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold bg-stone-50"
                  />
                </div>
              </div>

              {/* Libellé */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">Libellé de l'opération *</label>
                <input
                  type="text"
                  required
                  placeholder={newType === 'entree' ? "Ex: Don pour fleurs mémorielles..." : "Ex: Achat fournitures kits pédiatriques..."}
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">Catégorie Comptable *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
                >
                  {newType === 'entree' ? (
                    <>
                      <option value="Dons Publics">Dons Publics (Mobile Money)</option>
                      <option value="Mécénat d'Entreprise">Mécénat d'Entreprise (RSE)</option>
                      <option value="Subvention Institutionnelle">Subvention Institutionnelle</option>
                      <option value="Vente de Kits & Formations">Vente de Kits & Formations</option>
                      <option value="Cotisations Membres">Cotisations des Membres</option>
                    </>
                  ) : (
                    <>
                      <option value="Programme Boîtes Mémoire">Programme Boîtes Mémoire CHU</option>
                      <option value="Actions Sociales & Écoute 24/7">Actions Sociales & Écoute 24/7</option>
                      <option value="Cercles de Parole GSP">Cercles de Parole GSP</option>
                      <option value="Aide d'Urgence Obsèques & Familles">Aide d'Urgence Obsèques & Familles</option>
                      <option value="Missions Régionales CI">Missions Régionales CI</option>
                      <option value="Formation Soignants CHU">Formation Soignants CHU</option>
                      <option value="Frais Généraux & PWA">Frais Généraux & PWA</option>
                      <option value="Cérémonies Commémoratives">Cérémonies Commémoratives</option>
                    </>
                  )}
                </select>
              </div>

              {/* Moyen de paiement */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Mode de règlement *</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
                  >
                    <option value="Wave Mobile Money">Wave Mobile Money</option>
                    <option value="Orange Money CI">Orange Money CI</option>
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="Virement Bancaire">Virement Bancaire</option>
                    <option value="Chèque Bancaire">Chèque Bancaire</option>
                    <option value="Espèces / Caisse">Espèces / Caisse</option>
                    <option value="Carte Bancaire">Carte Bancaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Réf. Pièce / Facture</label>
                  <input
                    type="text"
                    placeholder="Ex: FAC-2026-10"
                    value={newRefPiece}
                    onChange={(e) => setNewRefPiece(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
                  />
                </div>
              </div>

              {/* Donateur ou Bénéficiaire */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  {newType === 'entree' ? "Donateur / Émetteur" : "Bénéficiaire / Fournisseur"}
                </label>
                <input
                  type="text"
                  placeholder="Ex: Famille Koffi, CHU Treichville..."
                  value={newBeneficiary}
                  onChange={(e) => setNewBeneficiary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMovement(false)}
                  className="py-2 px-4 rounded-xl border border-stone-300 text-stone-600 font-bold hover:bg-stone-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm"
                >
                  Enregistrer l'Écriture
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
