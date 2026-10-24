import React, { useState, useMemo } from 'react';
import { 
  HeartHandshake, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Download, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  FileSpreadsheet, 
  UserCheck, 
  MessageCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  LifeBuoy
} from 'lucide-react';
import { AccompanimentRecord } from '../../types';
import { exportAccompanimentsToCSV, exportAccompanimentsToExcel } from '../../utils/monthlyReportingExport';

interface AdminHelpRequestsManagerProps {
  accompaniments: AccompanimentRecord[];
  onAddAccompaniment?: (record: AccompanimentRecord) => void;
  onUpdateStatus: (id: string, status: AccompanimentRecord['status']) => void;
  onUpdateUrgency?: (id: string, urgency: 'critique' | 'haute' | 'normale' | 'faible') => void;
  onAssignReferent?: (id: string, referentName: string) => void;
  onUpdateNotes?: (id: string, notes: string) => void;
  onDeleteAccompaniment?: (id: string) => void;
}

export const AdminHelpRequestsManager: React.FC<AdminHelpRequestsManagerProps> = ({
  accompaniments,
  onAddAccompaniment,
  onUpdateStatus,
  onUpdateUrgency,
  onAssignReferent,
  onUpdateNotes,
  onDeleteAccompaniment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const [selectedItem, setSelectedItem] = useState<AccompanimentRecord | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Add new request modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newForm, setNewForm] = useState<Partial<AccompanimentRecord>>({
    beneficiaryName: '',
    type: 'soutien_psychologique',
    urgency: 'haute',
    status: 'en_attente',
    channel: 'telephone',
    location: 'Abidjan',
    assignedReferent: '',
    notes: ''
  });

  // Extract available months for monthly reporting
  const availableMonths = useMemo(() => {
    const setMonths = new Set<string>();
    accompaniments.forEach(a => {
      if (a.createdAt) {
        setMonths.add(a.createdAt.slice(0, 7));
      }
    });
    return Array.from(setMonths).sort().reverse();
  }, [accompaniments]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return accompaniments.filter(item => {
      const matchSearch = 
        (item.beneficiaryName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.assignedReferent || item.assignedVolunteer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.notes || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchUrgency = urgencyFilter === 'all' || item.urgency === urgencyFilter;
      const matchType = typeFilter === 'all' || item.type === typeFilter;
      const matchMonth = selectedMonth === 'all' || (item.createdAt && item.createdAt.startsWith(selectedMonth));

      return matchSearch && matchStatus && matchUrgency && matchType && matchMonth;
    });
  }, [accompaniments, searchTerm, statusFilter, urgencyFilter, typeFilter, selectedMonth]);

  // Statistics
  const stats = useMemo(() => {
    const total = accompaniments.length;
    const criticalOrHigh = accompaniments.filter(a => a.urgency === 'critique' || a.urgency === 'haute').length;
    const pending = accompaniments.filter(a => a.status === 'en_attente').length;
    const ongoing = accompaniments.filter(a => a.status === 'en_cours').length;
    const closed = accompaniments.filter(a => a.status === 'cloture').length;
    return { total, criticalOrHigh, pending, ongoing, closed };
  }, [accompaniments]);

  const handleSaveNotes = (id: string) => {
    if (onUpdateNotes) {
      onUpdateNotes(id, tempNotes);
    }
    setEditingNotesId(null);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.beneficiaryName) return;

    const newRecord: AccompanimentRecord = {
      id: `acc-${Date.now().toString(36)}`,
      fullName: newForm.beneficiaryName || 'Famille',
      beneficiaryName: newForm.beneficiaryName,
      phone: '',
      city: newForm.location || 'Abidjan',
      userRole: 'parange',
      situationType: 'Deuil périnatal',
      serviceRequested: newForm.type || 'Soutien Psychologique',
      preferredContact: (newForm.channel as any) || 'telephone',
      urgencyLevel: (newForm.urgency as any) || 'haute',
      requestDate: new Date().toISOString(),
      type: newForm.type || 'soutien_psychologique',
      urgency: newForm.urgency || 'normale',
      status: (newForm.status as any) || 'en_attente',
      channel: newForm.channel || 'telephone',
      location: newForm.location || 'Abidjan',
      assignedReferent: newForm.assignedReferent || 'Dr. Akissi Marie (Psychologue)',
      assignedVolunteer: newForm.assignedReferent || 'Dr. Akissi Marie (Psychologue)',
      assignedPsychologist: newForm.assignedReferent || 'Dr. Akissi Marie (Psychologue)',
      createdAt: new Date().toISOString(),
      lastContactDate: new Date().toISOString(),
      sessionsCompleted: 0,
      notes: newForm.notes || ''
    };

    if (onAddAccompaniment) {
      onAddAccompaniment(newRecord);
    }
    setShowAddModal(false);
    setNewForm({
      beneficiaryName: '',
      type: 'soutien_psychologique',
      urgency: 'haute',
      status: 'en_attente',
      channel: 'telephone',
      location: 'Abidjan',
      assignedReferent: '',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-pink-700 to-purple-800 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm mb-2">
              <LifeBuoy className="w-3.5 h-3.5" />
              Pôle Urgences & Accompagnements
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Gestion des Demandes d'Aide & Suivi</h2>
            <p className="text-rose-100 text-sm mt-1 max-w-2xl">
              Prise en charge personnalisée des parents endeuillés : écoute d'urgence, boîtes souvenirs (GSP), aide financière d'urgence et suivi psychologique.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-rose-900 font-semibold text-sm hover:bg-rose-50 transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Nouvelle demande d'aide
            </button>
            <button
              onClick={() => exportAccompanimentsToExcel(filteredRecords, selectedMonth)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition shadow-sm"
              title="Exporter vers Excel (.xls)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={() => exportAccompanimentsToCSV(filteredRecords, selectedMonth)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900/80 hover:bg-rose-900 text-white font-medium text-sm transition"
              title="Exporter en CSV"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
            <div className="text-xs text-rose-200">Total Demandes</div>
            <div className="text-2xl font-extrabold mt-0.5">{stats.total}</div>
          </div>
          <div className="bg-red-500/30 backdrop-blur-md rounded-xl p-3 border border-red-300/40">
            <div className="text-xs text-red-200">Urgences Hautes / Critiques</div>
            <div className="text-2xl font-extrabold text-red-100 mt-0.5">{stats.criticalOrHigh}</div>
          </div>
          <div className="bg-amber-500/20 backdrop-blur-md rounded-xl p-3">
            <div className="text-xs text-amber-200">En Attente de Référent</div>
            <div className="text-2xl font-extrabold text-amber-100 mt-0.5">{stats.pending}</div>
          </div>
          <div className="bg-blue-500/20 backdrop-blur-md rounded-xl p-3">
            <div className="text-xs text-blue-200">Suivis en Cours</div>
            <div className="text-2xl font-extrabold text-blue-100 mt-0.5">{stats.ongoing}</div>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-md rounded-xl p-3">
            <div className="text-xs text-emerald-200">Dossiers Clôturés</div>
            <div className="text-2xl font-extrabold text-emerald-100 mt-0.5">{stats.closed}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par famille, ville, référent assigné..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">Toutes urgences</option>
              <option value="critique">🚨 Critique</option>
              <option value="haute">⚠️ Haute</option>
              <option value="normale">⚪ Normale</option>
              <option value="faible">🟢 Faible</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">Tous statuts</option>
              <option value="en_attente">⏳ En attente</option>
              <option value="en_cours">🔄 En cours</option>
              <option value="cloture">✅ Clôturé</option>
              <option value="archive">📁 Archivé</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">Tous types d'aide</option>
              <option value="soutien_psychologique">Psychologique</option>
              <option value="kit_memoire">Boîte à Souvenirs (GSP)</option>
              <option value="groupe_parole">Groupe de Parole</option>
              <option value="aide_financiere">Aide Financière / Obsèques</option>
              <option value="ecoute_telephonique">Écoute Téléphonique</option>
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">Toutes périodes</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0">
          <span>{filteredRecords.length} dossier(s) trouvé(s)</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4">Famille / Bénéficiaire</th>
                <th className="py-3.5 px-4">Type de Demande</th>
                <th className="py-3.5 px-4">Urgence</th>
                <th className="py-3.5 px-4">Référent Attitré</th>
                <th className="py-3.5 px-4">Statut Dossier</th>
                <th className="py-3.5 px-4">Date & Lieu</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <HeartHandshake className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="font-medium">Aucun dossier d'accompagnement ne correspond à vos filtres</p>
                    <p className="text-xs text-slate-400 mt-1">Vous pouvez réinitialiser vos filtres ou ajouter une demande.</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {item.beneficiaryName || 'Famille Anonyme'}
                        {item.urgency === 'critique' && (
                          <span className="animate-pulse flex h-2 w-2 rounded-full bg-red-600" title="Urgence critique" />
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="capitalize">{item.channel || 'Téléphone'}</span>
                        {item.sessionsCompleted !== undefined && (
                          <span className="text-slate-400">• {item.sessionsCompleted} séance(s)</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                        {item.type === 'soutien_psychologique' ? '🧠 Psychologique' :
                         item.type === 'kit_memoire' ? '🎁 Boîte Souvenir (GSP)' :
                         item.type === 'groupe_parole' ? '👥 Groupe Parole' :
                         item.type === 'aide_financiere' ? '🤝 Aide Financière' : item.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.urgency === 'critique'
                          ? 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
                          : item.urgency === 'haute'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {item.urgency === 'critique' && <ShieldAlert className="w-3 h-3" />}
                        {item.urgency ? item.urgency.toUpperCase() : 'NORMALE'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {item.assignedReferent || item.assignedVolunteer || 'Non assigné'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          item.status === 'en_cours'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300'
                            : item.status === 'cloture'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                            : item.status === 'archive'
                            ? 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        <option value="en_attente">⏳ En attente</option>
                        <option value="en_cours">🔄 En cours</option>
                        <option value="cloture">✅ Clôturé</option>
                        <option value="archive">📁 Archivé</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : 'Récent'}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.location || 'Abidjan'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-800 rounded-lg transition"
                        >
                          Détails
                        </button>
                        {onDeleteAccompaniment && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer le dossier de ${item.beneficiaryName} ?`)) {
                                onDeleteAccompaniment(item.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-500 rounded-lg transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 rounded">
                  Dossier #{selectedItem.id}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedItem.beneficiaryName || 'Famille Anonyme'}
                </h3>
                <p className="text-xs text-slate-500">Créé le {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString('fr-FR') : 'Récent'}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pt-2 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-400">Type de prise en charge</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedItem.type}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Canal de premier contact</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{selectedItem.channel || 'Téléphone'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Localisation géographique</div>
                  <div className="text-slate-700 dark:text-slate-300">{selectedItem.location || 'Non précisé'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Séances complétées</div>
                  <div className="font-bold text-rose-600">{selectedItem.sessionsCompleted || 0} séance(s)</div>
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Référent assigné</div>
                  {onAssignReferent && (
                    <button
                      onClick={() => {
                        const newRef = prompt('Nom du psychologue ou référent:', selectedItem.assignedReferent || '');
                        if (newRef !== null) {
                          onAssignReferent(selectedItem.id, newRef);
                          setSelectedItem({ ...selectedItem, assignedReferent: newRef, assignedVolunteer: newRef });
                        }
                      }}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Changer référent
                    </button>
                  )}
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl font-medium text-slate-800 dark:text-slate-200">
                  {selectedItem.assignedReferent || selectedItem.assignedVolunteer || 'Aucun soignant/référent assigné'}
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Notes Cliniques & Synthèse</div>
                  {editingNotesId !== selectedItem.id && (
                    <button
                      onClick={() => {
                        setEditingNotesId(selectedItem.id);
                        setTempNotes(selectedItem.notes || '');
                      }}
                      className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Modifier les notes
                    </button>
                  )}
                </div>

                {editingNotesId === selectedItem.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      rows={4}
                      className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                      placeholder="Notes d'entretien, observations, préconisations..."
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-3 py-1 text-xs text-slate-600 bg-slate-100 rounded-lg"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => {
                          handleSaveNotes(selectedItem.id);
                          setSelectedItem({ ...selectedItem, notes: tempNotes });
                        }}
                        className="px-3 py-1 text-xs text-white bg-rose-600 hover:bg-rose-500 rounded-lg font-semibold"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-rose-50/50 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-100 dark:border-rose-900 leading-relaxed">
                    {selectedItem.notes || 'Aucune observation enregistrée.'}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Help Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Enregistrer une nouvelle demande d'aide
            </h3>
            <form onSubmit={handleCreateRequest} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nom de la famille ou bénéficiaire *
                </label>
                <input
                  type="text"
                  required
                  value={newForm.beneficiaryName}
                  onChange={(e) => setNewForm({ ...newForm, beneficiaryName: e.target.value })}
                  placeholder="Ex: Famille Touré, M. et Mme Koffi..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Type d'accompagnement
                  </label>
                  <select
                    value={newForm.type}
                    onChange={(e) => setNewForm({ ...newForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                  >
                    <option value="soutien_psychologique">Soutien Psychologique</option>
                    <option value="kit_memoire">Boîte à Souvenirs (GSP)</option>
                    <option value="groupe_parole">Groupe de Parole</option>
                    <option value="aide_financiere">Aide Financière / Obsèques</option>
                    <option value="ecoute_telephonique">Écoute Téléphonique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Degré d'urgence
                  </label>
                  <select
                    value={newForm.urgency}
                    onChange={(e) => setNewForm({ ...newForm, urgency: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                  >
                    <option value="critique">🚨 Critique (Détresse aiguë)</option>
                    <option value="haute">⚠️ Haute</option>
                    <option value="normale">⚪ Normale</option>
                    <option value="faible">🟢 Faible</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Ville / Région
                  </label>
                  <input
                    type="text"
                    value={newForm.location}
                    onChange={(e) => setNewForm({ ...newForm, location: e.target.value })}
                    placeholder="Abidjan (Cocody, Yopougon...)"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Canal initial
                  </label>
                  <select
                    value={newForm.channel}
                    onChange={(e) => setNewForm({ ...newForm, channel: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                  >
                    <option value="telephone">Ligne d'Urgence (Téléphone)</option>
                    <option value="whatsapp">WhatsApp ONG</option>
                    <option value="site_web">Formulaire Site Web</option>
                    <option value="hopital">Signalement Hôpital / CHU</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Notes initiales & Circonstances
                </label>
                <textarea
                  rows={3}
                  value={newForm.notes}
                  onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
                  placeholder="Décrivez les besoins de la famille, le terme de la grossesse, les personnes contactées..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-sm"
                >
                  Créer le dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
