import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Users, 
  Building2, 
  Calendar, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Download, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  FileSpreadsheet, 
  MessageSquare, 
  Clock, 
  Send
} from 'lucide-react';
import { TrainingRegistrationRequest } from '../../types';
import { exportTrainingsToCSV, exportTrainingsToExcel } from '../../utils/monthlyReportingExport';

interface AdminTrainingsManagerProps {
  trainings: TrainingRegistrationRequest[];
  onAddTraining?: (training: TrainingRegistrationRequest) => void;
  onUpdateStatus: (id: string, status: TrainingRegistrationRequest['status']) => void;
  onUpdateNotes?: (id: string, notes: string) => void;
  onDeleteTraining?: (id: string) => void;
}

export const AdminTrainingsManager: React.FC<AdminTrainingsManagerProps> = ({
  trainings,
  onAddTraining,
  onUpdateStatus,
  onUpdateNotes,
  onDeleteTraining
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedTraining, setSelectedTraining] = useState<TrainingRegistrationRequest | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // New Training modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newForm, setNewForm] = useState<Partial<TrainingRegistrationRequest>>({
    name: '',
    institution: '',
    email: '',
    phone: '',
    city: 'Abidjan',
    moduleCode: 'MOD-01',
    moduleTitle: 'Annonce d’un décès périnatal et premiers gestes soignants',
    participantsCount: 5,
    message: '',
    status: 'en_attente',
    notes: ''
  });

  // Filtered registrations
  const filteredTrainings = useMemo(() => {
    return trainings.filter(item => {
      const matchSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.moduleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchMonth = selectedMonth === 'all' || (item.requestedAt && item.requestedAt.startsWith(selectedMonth));

      return matchSearch && matchStatus && matchMonth;
    });
  }, [trainings, searchTerm, statusFilter, selectedMonth]);

  // Months available for reporting
  const availableMonths = useMemo(() => {
    const setMonths = new Set<string>();
    trainings.forEach(t => {
      if (t.requestedAt) {
        setMonths.add(t.requestedAt.slice(0, 7));
      }
    });
    return Array.from(setMonths).sort().reverse();
  }, [trainings]);

  // Statistics
  const stats = useMemo(() => {
    const total = trainings.length;
    const pending = trainings.filter(t => t.status === 'en_attente').length;
    const confirmed = trainings.filter(t => t.status === 'confirme' || t.status === 'en_cours').length;
    const totalParticipants = trainings.reduce((acc, curr) => acc + (curr.participantsCount || 1), 0);
    return { total, pending, confirmed, totalParticipants };
  }, [trainings]);

  const handleSaveNotes = (id: string) => {
    if (onUpdateNotes) {
      onUpdateNotes(id, tempNotes);
    }
    setEditingNotesId(null);
  };

  const handleCreateTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.institution || !newForm.email) return;

    const newReq: TrainingRegistrationRequest = {
      id: `tr-${Date.now().toString(36)}`,
      name: newForm.name || '',
      institution: newForm.institution || '',
      email: newForm.email || '',
      phone: newForm.phone || '',
      city: newForm.city || 'Abidjan',
      moduleCode: newForm.moduleCode || 'MOD-01',
      moduleTitle: newForm.moduleTitle || 'Formation Deuil Périnatal',
      participantsCount: Number(newForm.participantsCount) || 1,
      message: newForm.message || '',
      requestedAt: new Date().toISOString(),
      status: (newForm.status as any) || 'en_attente',
      notes: newForm.notes || ''
    };

    if (onAddTraining) {
      onAddTraining(newReq);
    }
    setShowAddModal(false);
    setNewForm({
      name: '',
      institution: '',
      email: '',
      phone: '',
      city: 'Abidjan',
      moduleCode: 'MOD-01',
      moduleTitle: 'Annonce d’un décès périnatal et premiers gestes soignants',
      participantsCount: 5,
      message: '',
      status: 'en_attente',
      notes: ''
    });
  };

  const getCleanPhone = (phone: string) => phone.replace(/[^\d+]/g, '');

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              Académie & Relais Hospitaliers
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Gestion des Formations & Soignants</h2>
            <p className="text-emerald-100 text-sm mt-1 max-w-2xl">
              Suivi des candidatures, sensibilisations hospitalières (CHU, cliniques, maternités) et export mensuel des cohortes formées.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-semibold text-sm hover:bg-emerald-50 transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Inscrire une institution
            </button>
            <button
              onClick={() => exportTrainingsToExcel(filteredTrainings, selectedMonth)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition shadow-sm"
              title="Exporter vers Excel (.xls)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={() => exportTrainingsToCSV(filteredTrainings, selectedMonth)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-medium text-sm transition"
              title="Exporter en CSV"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
            <div className="text-xs text-emerald-200">Total Demandes</div>
            <div className="text-2xl font-extrabold mt-0.5">{stats.total}</div>
          </div>
          <div className="bg-amber-500/20 backdrop-blur-md rounded-xl p-3 border border-amber-300/30">
            <div className="text-xs text-amber-200">En Attente d'Action</div>
            <div className="text-2xl font-extrabold text-amber-100 mt-0.5">{stats.pending}</div>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-md rounded-xl p-3 border border-emerald-300/30">
            <div className="text-xs text-emerald-200">Confirmées / En cours</div>
            <div className="text-2xl font-extrabold text-emerald-100 mt-0.5">{stats.confirmed}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
            <div className="text-xs text-emerald-200">Soignants / Relais Prévus</div>
            <div className="text-2xl font-extrabold mt-0.5">{stats.totalParticipants}</div>
          </div>
        </div>
      </div>

      {/* Filter and Export Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, hôpital, ville, module..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">⏳ En attente</option>
              <option value="confirme">✅ Confirmé</option>
              <option value="en_cours">🔄 En cours</option>
              <option value="termine">🎓 Terminé</option>
              <option value="annule">❌ Annulé</option>
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Toutes périodes</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0">
          <span>{filteredTrainings.length} demande(s) affichée(s)</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4">Professionnel & Structure</th>
                <th className="py-3.5 px-4">Module Demandé</th>
                <th className="py-3.5 px-4">Effectif</th>
                <th className="py-3.5 px-4">Date Demande</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Contact Direct</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTrainings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <GraduationCap className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="font-medium">Aucune demande de formation trouvée</p>
                    <p className="text-xs text-slate-400 mt-1">Modifiez vos critères de recherche ou ajoutez une inscription.</p>
                  </td>
                </tr>
              ) : (
                filteredTrainings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[220px]">{item.institution}</span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 flex-shrink-0 text-slate-400" />
                        <span>{item.city}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded mb-1">
                        {item.moduleCode}
                      </span>
                      <div className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 max-w-[260px]">
                        {item.moduleTitle}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        {item.participantsCount} pers.
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.requestedAt ? new Date(item.requestedAt).toLocaleDateString('fr-FR') : 'Non renseigné'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          item.status === 'confirme'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                            : item.status === 'en_cours'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                            : item.status === 'termine'
                            ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
                            : item.status === 'annule'
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                        }`}
                      >
                        <option value="en_attente">⏳ En attente</option>
                        <option value="confirme">✅ Confirmé</option>
                        <option value="en_cours">🔄 En cours</option>
                        <option value="termine">🎓 Terminé</option>
                        <option value="annule">❌ Annulé</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {item.phone && (
                          <a
                            href={`tel:${getCleanPhone(item.phone)}`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
                            title="Appeler"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {item.phone && (
                          <a
                            href={`https://wa.me/${getCleanPhone(item.phone)}?text=${encodeURIComponent(`Bonjour ${item.name}, nous faisons suite à votre demande de formation Deuil Périnatal avec l'ONG Les Amis de Raphaël.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:hover:bg-emerald-900 transition"
                            title="Contacter sur WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {item.email && (
                          <a
                            href={`mailto:${item.email}?subject=${encodeURIComponent(`Formation Deuil Périnatal - ${item.moduleTitle}`)}`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
                            title="Envoyer un email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedTraining(item)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-100 dark:bg-slate-800 rounded-lg transition"
                        >
                          Détails
                        </button>
                        {onDeleteTraining && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer la demande de ${item.name} ?`)) {
                                onDeleteTraining(item.id);
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

      {/* Details & Notes Modal */}
      {selectedTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 rounded">
                  {selectedTraining.moduleCode}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedTraining.moduleTitle}
                </h3>
                <p className="text-xs text-slate-500">ID Demande: {selectedTraining.id}</p>
              </div>
              <button
                onClick={() => setSelectedTraining(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pt-2 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-400">Demandeur</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedTraining.name}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Établissement</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedTraining.institution}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Ville</div>
                  <div className="text-slate-700 dark:text-slate-300">{selectedTraining.city}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Participants Prévus</div>
                  <div className="font-bold text-emerald-600">{selectedTraining.participantsCount} professionnels</div>
                </div>
              </div>

              <div className="pt-3">
                <div className="text-xs text-slate-400 mb-1">Message & Objectifs Spécifiques</div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-slate-700 dark:text-slate-300 italic">
                  "{selectedTraining.message || 'Aucun message particulier fourni.'}"
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Notes Internes ONG</div>
                  {editingNotesId !== selectedTraining.id && (
                    <button
                      onClick={() => {
                        setEditingNotesId(selectedTraining.id);
                        setTempNotes(selectedTraining.notes || '');
                      }}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Modifier
                    </button>
                  )}
                </div>

                {editingNotesId === selectedTraining.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                      placeholder="Ajouter des notes (formateur assigné, convention, date arrêtée...)"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-3 py-1 text-xs text-slate-600 bg-slate-100 rounded-lg"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleSaveNotes(selectedTraining.id)}
                        className="px-3 py-1 text-xs text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-emerald-50/50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900">
                    {selectedTraining.notes || 'Aucune note interne renseignée.'}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedTraining(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Training Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Inscrire une structure hospitalière
            </h3>
            <form onSubmit={handleCreateTraining} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nom du référent soignant *
                </label>
                <input
                  type="text"
                  required
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  placeholder="Ex: Dr. Kouassi, Mme Bamba (Sage-femme)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Établissement / Service *
                </label>
                <input
                  type="text"
                  required
                  value={newForm.institution}
                  onChange={(e) => setNewForm({ ...newForm, institution: e.target.value })}
                  placeholder="Ex: CHU de Treichville, Maternité Sainte-Marie"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    placeholder="contact@hopital.ci"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    placeholder="+225 07..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={newForm.city}
                    onChange={(e) => setNewForm({ ...newForm, city: e.target.value })}
                    placeholder="Abidjan, Bouaké..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Participants prévus
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newForm.participantsCount}
                    onChange={(e) => setNewForm({ ...newForm, participantsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Module de Formation
                </label>
                <select
                  value={newForm.moduleCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    let title = 'Annonce d’un décès périnatal et premiers gestes soignants';
                    if (code === 'MOD-02') title = 'L’arbre des souvenirs : Créer des rituels et des empreintes tangibles';
                    if (code === 'MOD-03') title = 'Psychopathologie du deuil périnatal et écoute empathique';
                    setNewForm({ ...newForm, moduleCode: code, moduleTitle: title });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                >
                  <option value="MOD-01">MOD-01 : Annonce décès périnatal & premiers gestes</option>
                  <option value="MOD-02">MOD-02 : L'arbre des souvenirs & empreintes tangibles</option>
                  <option value="MOD-03">MOD-03 : Psychopathologie & écoute empathique</option>
                </select>
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-sm"
                >
                  Enregistrer la candidature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
