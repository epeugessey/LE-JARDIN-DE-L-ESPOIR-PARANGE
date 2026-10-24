import { AccompanimentRecord, EventRegistration, EventItem, TrainingRegistrationRequest } from '../types';

/**
 * Escapes fields for standard CSV formatting (RFC 4180 compliant with semicolon for French Excel compatibility)
 */
function escapeCsv(value: any): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Downloads a string as a blob file with UTF-8 BOM
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob(['\uFEFF' + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate Excel XML (.xls) formatted document that opens natively in Microsoft Excel and LibreOffice
 */
function generateExcelXml(sheetName: string, headers: string[], rows: (string | number)[][]): string {
  const headerCells = headers.map(h => `<Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join('');
  
  const rowCells = rows.map(row => {
    const cells = row.map(cell => {
      const isNum = typeof cell === 'number';
      const type = isNum ? 'Number' : 'String';
      return `<Cell><Data ss:Type="${type}">${escapeXml(String(cell ?? ''))}</Data></Cell>`;
    }).join('');
    return `<Row>${cells}</Row>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#059669"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#059669" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escapeXml(sheetName)}">
  <Table>
   <Row ss:Height="24">
    ${headerCells}
   </Row>
   ${rowCells}
  </Table>
 </Worksheet>
</Workbook>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Filter items by month if specified (YYYY-MM format)
 */
function isDateInMonth(dateStr: string | undefined, monthFilter?: string): boolean {
  if (!monthFilter || monthFilter === 'all') return true;
  if (!dateStr) return false;
  return dateStr.startsWith(monthFilter);
}

// -------------------------------------------------------------
// ACCOMPANIMENT REQUESTS EXPORT
// -------------------------------------------------------------

export function exportAccompanimentsToCSV(accompaniments: AccompanimentRecord[], monthFilter?: string): void {
  const filtered = accompaniments.filter(a => isDateInMonth(a.createdAt || a.requestDate, monthFilter));
  
  const headers = [
    'ID Suivi',
    'Date de Demande',
    'Bénéficiaire (Nom / Code)',
    'Type d\'Accompagnement',
    'Canal de Contact',
    'Urgence / Gravité',
    'Statut',
    'Localisation / Région',
    'Professionnel Assigné',
    'Date Dernier Contact',
    'Prochain Rendez-vous',
    'Nombre Séances Réalisées',
    'Notes Cliniques / Suivi'
  ];

  const rows = filtered.map(item => [
    escapeCsv(item.id),
    escapeCsv((item.createdAt || item.requestDate) ? new Date(item.createdAt || item.requestDate).toLocaleDateString('fr-FR') : ''),
    escapeCsv(item.beneficiaryName || item.fullName || 'Anonyme'),
    escapeCsv(item.type || item.serviceRequested || 'Accompagnement'),
    escapeCsv(item.channel || item.preferredContact || 'Téléphone'),
    escapeCsv(item.urgency || item.urgencyLevel || 'normale'),
    escapeCsv(item.status),
    escapeCsv(item.location || item.city || 'Côte d\'Ivoire'),
    escapeCsv(item.assignedVolunteer || item.assignedReferent || item.assignedPsychologist || 'Non assigné'),
    escapeCsv(item.lastContactDate ? new Date(item.lastContactDate).toLocaleDateString('fr-FR') : ''),
    escapeCsv(item.nextAppointmentDate ? new Date(item.nextAppointmentDate).toLocaleDateString('fr-FR') : ''),
    escapeCsv(item.sessionsCompleted ?? 0),
    escapeCsv(item.notes || '')
  ]);

  const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const filename = `reporting-demandes-accompagnement-${monthFilter || 'global'}-${new Date().toISOString().slice(0, 10)}.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportAccompanimentsToExcel(accompaniments: AccompanimentRecord[], monthFilter?: string): void {
  const filtered = accompaniments.filter(a => isDateInMonth(a.createdAt || a.requestDate, monthFilter));

  const headers = [
    'ID Suivi',
    'Date Demande',
    'Bénéficiaire',
    'Type d\'Accompagnement',
    'Canal Contact',
    'Niveau Urgence',
    'Statut Dossier',
    'Localisation',
    'Référent Assigné',
    'Dernier Contact',
    'Prochain RDV',
    'Séances Réalisées',
    'Notes Cliniques'
  ];

  const rows = filtered.map(item => [
    item.id,
    (item.createdAt || item.requestDate) ? new Date(item.createdAt || item.requestDate).toLocaleDateString('fr-FR') : '',
    item.beneficiaryName || item.fullName || 'Anonyme',
    item.type || item.serviceRequested || 'Accompagnement',
    item.channel || item.preferredContact || 'Téléphone',
    item.urgency || item.urgencyLevel || 'normale',
    item.status,
    item.location || item.city || 'Côte d\'Ivoire',
    item.assignedVolunteer || item.assignedReferent || item.assignedPsychologist || 'Non assigné',
    item.lastContactDate ? new Date(item.lastContactDate).toLocaleDateString('fr-FR') : '',
    item.nextAppointmentDate ? new Date(item.nextAppointmentDate).toLocaleDateString('fr-FR') : '',
    item.sessionsCompleted ?? 0,
    item.notes || ''
  ]);

  const xmlContent = generateExcelXml('Accompagnements', headers, rows);
  const filename = `reporting-demandes-accompagnement-${monthFilter || 'global'}-${new Date().toISOString().slice(0, 10)}.xls`;
  downloadFile(xmlContent, filename, 'application/vnd.ms-excel;charset=utf-8;');
}

// -------------------------------------------------------------
// EVENT REGISTRATIONS EXPORT
// -------------------------------------------------------------

export function exportEventRegistrationsToCSV(
  registrations: EventRegistration[], 
  events: EventItem[] = [], 
  monthFilter?: string
): void {
  const eventMap = new Map(events.map(e => [e.id, e]));
  const filtered = registrations.filter(r => isDateInMonth(r.registeredAt, monthFilter));

  const headers = [
    'ID Inscription',
    'Date Inscription',
    'Événement ID',
    'Titre Événement',
    'Date Événement',
    'Nom Participant',
    'Email',
    'Téléphone',
    'Nombre de Places',
    'Statut Inscription',
    'Besoins Spécifiques / Message'
  ];

  const rows = filtered.map(reg => {
    const evt = eventMap.get(reg.eventId);
    return [
      escapeCsv(reg.id),
      escapeCsv(reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString('fr-FR') : ''),
      escapeCsv(reg.eventId),
      escapeCsv(evt ? evt.title : reg.eventId),
      escapeCsv(evt ? evt.date : ''),
      escapeCsv(reg.fullName || reg.userName || 'Participant'),
      escapeCsv(reg.email || ''),
      escapeCsv(reg.phone || ''),
      escapeCsv(reg.numberOfPeople ?? reg.seats ?? 1),
      escapeCsv(reg.status),
      escapeCsv(reg.notes || '')
    ];
  });

  const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const filename = `reporting-inscriptions-evenements-${monthFilter || 'global'}-${new Date().toISOString().slice(0, 10)}.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportEventRegistrationsToExcel(
  registrations: EventRegistration[], 
  events: EventItem[] = [], 
  monthFilter?: string
): void {
  const eventMap = new Map(events.map(e => [e.id, e]));
  const filtered = registrations.filter(r => isDateInMonth(r.registeredAt, monthFilter));

  const headers = [
    'ID Inscription',
    'Date Inscription',
    'Événement ID',
    'Titre Événement',
    'Date Événement',
    'Nom Participant',
    'Email',
    'Téléphone',
    'Nombre de Places',
    'Statut Inscription',
    'Besoins / Notes'
  ];

  const rows = filtered.map(reg => {
    const evt = eventMap.get(reg.eventId);
    return [
      reg.id,
      reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString('fr-FR') : '',
      reg.eventId,
      evt ? evt.title : reg.eventId,
      evt ? evt.date : '',
      reg.fullName || reg.userName || 'Participant',
      reg.email || '',
      reg.phone || '',
      reg.numberOfPeople ?? reg.seats ?? 1,
      reg.status,
      reg.notes || ''
    ];
  });

  const xmlContent = generateExcelXml('Inscriptions_Evenements', headers, rows);
  const filename = `reporting-inscriptions-evenements-${monthFilter || 'global'}-${new Date().toISOString().slice(0, 10)}.xls`;
  downloadFile(xmlContent, filename, 'application/vnd.ms-excel;charset=utf-8;');
}

// -------------------------------------------------------------
// TRAINING REGISTRATIONS EXPORT
// -------------------------------------------------------------

export function exportTrainingsToCSV(registrations: TrainingRegistrationRequest[], monthFilter?: string): void {
  const filtered = registrations.filter(r => isDateInMonth(r.requestedAt, monthFilter));

  const headers = [
    'ID Demande',
    'Date Demande',
    'Nom Professionnel',
    'Établissement / Institution',
    'Ville',
    'Email',
    'Téléphone',
    'Code Module',
    'Titre de la Formation',
    'Nombre de Participants',
    'Statut Dossier',
    'Message / Besoins',
    'Notes Administrateur'
  ];

  const rows = filtered.map(item => [
    escapeCsv(item.id),
    escapeCsv(item.requestedAt ? new Date(item.requestedAt).toLocaleDateString('fr-FR') : ''),
    escapeCsv(item.name),
    escapeCsv(item.institution),
    escapeCsv(item.city),
    escapeCsv(item.email),
    escapeCsv(item.phone),
    escapeCsv(item.moduleCode),
    escapeCsv(item.moduleTitle),
    escapeCsv(item.participantsCount),
    escapeCsv(item.status),
    escapeCsv(item.message || ''),
    escapeCsv(item.notes || '')
  ]);

  const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const filename = `reporting-formations-${monthFilter || 'global'}-${new Date().toISOString().slice(0, 10)}.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportTrainingsToExcel(registrations: TrainingRegistrationRequest[], monthFilter?: string): void {
  const filtered = registrations.filter(r => isDateInMonth(r.requestedAt, monthFilter));

  const headers = [
    'ID Demande',
    'Date Demande',
    'Nom Professionnel',
    'Institution / Établissement',
    'Ville',
    'Email',
    'Téléphone',
    'Code Module',
    'Intitulé Formation',
    'Participants Prévus',
    'Statut',
    'Message Soignant',
    'Notes Administrateur'
  ];

  const rows = filtered.map(item => [
    item.id,
    item.requestedAt ? new Date(item.requestedAt).toLocaleDateString('fr-FR') : '',
    item.name,
    item.institution,
    item.city,
    item.email,
    item.phone,
    item.moduleCode,
    item.moduleTitle,
    item.participantsCount,
    item.status,
    item.message || '',
    item.notes || ''
  ]);

  const xmlContent = generateExcelXml('Formations_Soignants', headers, rows);
  const filename = `reporting-formations-${monthFilter || 'global'}-${new Date().toISOString().slice(0, 10)}.xls`;
  downloadFile(xmlContent, filename, 'application/vnd.ms-excel;charset=utf-8;');
}
