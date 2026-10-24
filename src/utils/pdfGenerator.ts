import { jsPDF } from 'jspdf';
import { ResourceGuide } from '../types';

/**
 * Utilitaires pour la génération de documents PDF professionnels téléchargeables
 * pour la plateforme Le Jardin de l'Espoir : Parange (Côte d'Ivoire).
 * 
 * Inclusivité Fondamentale : Le Jardin de l'Espoir concerne TOUTES les personnes
 * ayant perdu au moins un enfant, quel que soit l'âge de l'enfant disparu :
 * qu'il soit mort-né (mort in utero, fausse couche tardive, IMG) ou décédé
 * à un âge avancé (nourrisson, jeune enfant, adolescent ou adulte).
 */

// Couleurs de la charte graphique officielle
const COLOR_PRIMARY_EMERALD: [number, number, number] = [27, 59, 48]; // #1b3b30
const COLOR_SECONDARY_TEAL: [number, number, number] = [13, 148, 136]; // #0d9488
const COLOR_ACCENT_AMBER: [number, number, number] = [217, 119, 6]; // #d97706
const COLOR_DARK_TEXT: [number, number, number] = [28, 25, 23]; // #1c1917
const COLOR_MUTED_TEXT: [number, number, number] = [87, 83, 78]; // #57534e
const COLOR_LIGHT_BG: [number, number, number] = [245, 245, 244]; // #f5f5f4

const OFFICIAL_FACEBOOK_GROUP = "https://www.facebook.com/groups/lejardindelespoirparange/";

let cachedLogoDataUrl: string | null = null;

/**
 * Preload and cache official circular logo as base64 data URL for jsPDF embedding
 */
export async function ensurePdfLogoLoaded(): Promise<string | null> {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;
  try {
    const res = await fetch('/logo-circular.jpg');
    if (res.ok) {
      const blob = await res.blob();
      return new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          cachedLogoDataUrl = reader.result as string;
          resolve(cachedLogoDataUrl);
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    }
  } catch {
    // Fallback quietly to vector logo
  }
  return null;
}

// Auto-trigger background preload
if (typeof window !== 'undefined') {
  ensurePdfLogoLoaded().catch(() => {});
}

class PdfDocumentBuilder {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageNumber: number = 1;
  private docTitle: string;
  private logoDataUrl?: string | null;

  constructor(title: string, logoDataUrl?: string | null) {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    this.docTitle = title;
    this.logoDataUrl = logoDataUrl || cachedLogoDataUrl;
    this.initPage();
  }

  private initPage() {
    // Fond blanc propre
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(0, 0, 210, 297, 'F');

    // FILIGRANE DE FOND OFFICIEL SUR CHAQUE PAGE (Watermark background)
    this.drawFiligreeWatermark();

    // Bandeau décoratif de marque en haut
    this.doc.setFillColor(...COLOR_PRIMARY_EMERALD);
    this.doc.rect(0, 0, 210, 7.5, 'F');
    this.doc.setFillColor(...COLOR_ACCENT_AMBER);
    this.doc.rect(0, 7.5, 210, 1.5, 'F');

    // En-tête courant si page > 1
    if (this.pageNumber > 1) {
      const logoImg = this.logoDataUrl || cachedLogoDataUrl;
      if (logoImg) {
        try {
          this.doc.addImage(logoImg, 'JPEG', 15, 9.5, 6, 6);
        } catch {
          // continue
        }
      }
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(...COLOR_MUTED_TEXT);
      this.doc.text("LE JARDIN DE L'ESPOIR : PARANGE • CÔTE D'IVOIRE", logoImg ? 24 : 15, 14);
      this.doc.text(this.docTitle, 195, 14, { align: 'right' });
      this.doc.setDrawColor(220, 220, 220);
      this.doc.setLineWidth(0.3);
      this.doc.line(15, 16.5, 195, 16.5);
      this.currentY = 23;
    } else {
      this.currentY = 17;
    }
  }

  /**
   * Dessine le filigrane de fond officiel (Watermark filigrane) au centre de la page
   */
  private drawFiligreeWatermark() {
    const centerX = 105;
    const centerY = 145;

    // 1. Image du logo en filigrane doux si disponible
    const logoImg = this.logoDataUrl || cachedLogoDataUrl;
    if (logoImg) {
      try {
        if (typeof (this.doc as any).GState === 'function') {
          const gState = new (this.doc as any).GState({ opacity: 0.045 });
          this.doc.setGState(gState);
          this.doc.addImage(logoImg, 'JPEG', centerX - 42, centerY - 42, 84, 84);
          this.doc.setGState(new (this.doc as any).GState({ opacity: 1 }));
        }
      } catch {
        // Fallback transparent
      }
    }

    // 2. Cercles concentriques et sceau d'authenticité vectoriel filigrane
    this.doc.setDrawColor(236, 232, 224); // Teinte très douce et subtile
    this.doc.setLineWidth(0.35);
    this.doc.circle(centerX, centerY, 62, 'S');
    this.doc.setLineWidth(0.2);
    this.doc.circle(centerX, centerY, 57, 'S');
    this.doc.circle(centerX, centerY, 47, 'S');
    this.doc.circle(centerX, centerY, 37, 'S');

    // 3. Typographie officielle en filigrane discret
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(13.5);
    this.doc.setTextColor(228, 222, 212);
    this.doc.text("LE JARDIN DE L'ESPOIR : PARANGE", centerX, centerY - 5, { align: 'center' });
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.text("• REFUGE SACRÉ DES FAMILLES & DES ANGES •", centerX, centerY + 2, { align: 'center' });
    this.doc.setFontSize(7.5);
    this.doc.text("RÉPUBLIQUE DE CÔTE D'IVOIRE • DU DEUIL PÉRINATAL AU DECES TOUT ÂGE", centerX, centerY + 8, { align: 'center' });
    this.doc.setFontSize(6.8);
    this.doc.text("DOCUMENT OFFICIEL CERTIFIÉ CONFORME • NON ALTÉRABLE", centerX, centerY + 14, { align: 'center' });
  }

  /**
   * Dessine un logo vectoriel d'excellence si l'image n'est pas encore en mémoire cache
   */
  private drawVectorLogo(x: number, y: number, size: number) {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const r = size / 2;

    this.doc.setFillColor(...COLOR_PRIMARY_EMERALD);
    this.doc.circle(cx, cy, r, 'F');
    this.doc.setDrawColor(...COLOR_ACCENT_AMBER);
    this.doc.setLineWidth(0.8);
    this.doc.circle(cx, cy, r - 0.8, 'S');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(6.8);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text("PARANGE", cx, cy - 1, { align: 'center' });
    this.doc.setFontSize(5);
    this.doc.setTextColor(254, 243, 199);
    this.doc.text("JARDIN D'ESPOIR", cx, cy + 3.2, { align: 'center' });
    this.doc.setFontSize(4);
    this.doc.text("CÔTE D'IVOIRE", cx, cy + 6.5, { align: 'center' });
  }

  public checkPageBreak(requiredSpace: number) {
    if (this.currentY + requiredSpace > 274) {
      this.addFooter();
      this.doc.addPage();
      this.pageNumber++;
      this.initPage();
    }
  }

  private addFooter() {
    const footerY = 287;
    this.doc.setDrawColor(220, 220, 220);
    this.doc.setLineWidth(0.3);
    this.doc.line(15, footerY - 4, 195, footerY - 4);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.2);
    this.doc.setTextColor(...COLOR_MUTED_TEXT);
    this.doc.text(
      "Le Jardin de l'Espoir : Parange • Refuge & Soutien de tout parent ayant perdu un enfant (mort-né ou à un âge avancé)",
      15,
      footerY - 0.5
    );
    this.doc.text(
      `Groupe Facebook : facebook.com/groups/lejardindelespoirparange/ • Page ${this.pageNumber}`,
      195,
      footerY - 0.5,
      { align: 'right' }
    );
  }

  public addDocumentHeader(
    category: string,
    title: string,
    subtitle: string,
    meta: { version: string; date: string; audience: string }
  ) {
    const headerStartY = this.currentY;

    // LOGO OFFICIEL EN HAUT À DROITE DE LA PREMIÈRE PAGE
    const logoImg = this.logoDataUrl || cachedLogoDataUrl;
    const logoX = 162;
    const logoY = headerStartY;
    const logoSize = 32;

    if (logoImg) {
      try {
        this.doc.addImage(logoImg, 'JPEG', logoX, logoY, logoSize, logoSize);
        this.doc.setDrawColor(...COLOR_ACCENT_AMBER);
        this.doc.setLineWidth(0.8);
        this.doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 'S');
      } catch {
        this.drawVectorLogo(logoX, logoY, logoSize);
      }
    } else {
      this.drawVectorLogo(logoX, logoY, logoSize);
    }

    // Badge Catégorie
    this.doc.setFillColor(...COLOR_SECONDARY_TEAL);
    this.doc.roundedRect(15, this.currentY, 68, 6.5, 1.5, 1.5, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text(category.toUpperCase(), 18, this.currentY + 4.5);
    this.currentY += 10.5;

    // Titre Principal (calibré pour ne pas chevaucher le logo à droite)
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(16);
    this.doc.setTextColor(...COLOR_PRIMARY_EMERALD);
    const titleLines = this.doc.splitTextToSize(title, 142);
    this.doc.text(titleLines, 15, this.currentY);
    this.currentY += titleLines.length * 6.5;

    // S'assurer que le titre a dépassé le logo
    if (this.currentY < headerStartY + logoSize + 4) {
      this.currentY = headerStartY + logoSize + 4;
    }

    // Sous-titre
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(...COLOR_MUTED_TEXT);
    const subtitleLines = this.doc.splitTextToSize(subtitle, 180);
    this.doc.text(subtitleLines, 15, this.currentY);
    this.currentY += subtitleLines.length * 5 + 3;

    // Bloc Métadonnées élégant
    this.doc.setFillColor(...COLOR_LIGHT_BG);
    this.doc.roundedRect(15, this.currentY, 180, 16, 2, 2, 'F');
    this.doc.setDrawColor(214, 211, 209);
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(15, this.currentY, 180, 16, 2, 2, 'D');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.2);
    this.doc.setTextColor(...COLOR_DARK_TEXT);
    this.doc.text(`Version : ${meta.version}`, 20, this.currentY + 5.5);
    this.doc.text(`Date : ${meta.date}`, 85, this.currentY + 5.5);
    this.doc.text("Périmètre : Toute personne ayant perdu un enfant", 135, this.currentY + 5.5);
    this.doc.text(`Destinataire : ${meta.audience}`, 20, this.currentY + 11.5);
    this.doc.text("Groupe Facebook : facebook.com/groups/lejardindelespoirparange/", 85, this.currentY + 11.5);

    this.currentY += 23;
  }

  public addSectionTitle(number: string, title: string) {
    this.checkPageBreak(20);
    this.doc.setFillColor(...COLOR_PRIMARY_EMERALD);
    this.doc.rect(15, this.currentY, 4.5, 9, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12.5);
    this.doc.setTextColor(...COLOR_PRIMARY_EMERALD);
    this.doc.text(`${number}. ${title}`, 23, this.currentY + 6.8);

    this.doc.setDrawColor(...COLOR_ACCENT_AMBER);
    this.doc.setLineWidth(0.5);
    this.doc.line(23, this.currentY + 9.5, 195, this.currentY + 9.5);

    this.currentY += 15;
  }

  public addSubSectionTitle(title: string) {
    this.checkPageBreak(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10.2);
    this.doc.setTextColor(...COLOR_SECONDARY_TEAL);
    this.doc.text(`▶ ${title}`, 15, this.currentY);
    this.currentY += 6.5;
  }

  public addParagraph(text: string, spaceAfter = 4) {
    this.checkPageBreak(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9.2);
    this.doc.setTextColor(...COLOR_DARK_TEXT);
    const lines = this.doc.splitTextToSize(text, 180);
    this.doc.text(lines, 15, this.currentY);
    this.currentY += lines.length * 4.6 + spaceAfter;
  }

  public addCallout(title: string, text: string, type: 'info' | 'accent' | 'warning' = 'info') {
    this.checkPageBreak(25);
    const boxColor: [number, number, number] = 
      type === 'accent' ? [254, 243, 199] : 
      type === 'warning' ? [254, 226, 226] : [240, 253, 250];
    const borderColor: [number, number, number] = 
      type === 'accent' ? [217, 119, 6] : 
      type === 'warning' ? [220, 38, 38] : [13, 148, 136];

    const lines = this.doc.splitTextToSize(text, 168);
    const boxHeight = lines.length * 4.4 + 13;

    this.doc.setFillColor(...boxColor);
    this.doc.roundedRect(15, this.currentY, 180, boxHeight, 2, 2, 'F');
    this.doc.setFillColor(...borderColor);
    this.doc.rect(15, this.currentY, 3.5, boxHeight, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...borderColor);
    this.doc.text(title, 22, this.currentY + 5.5);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.6);
    this.doc.setTextColor(...COLOR_DARK_TEXT);
    this.doc.text(lines, 22, this.currentY + 10.5);

    this.currentY += boxHeight + 5;
  }

  public addBullet(boldPart: string, restPart: string) {
    this.checkPageBreak(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.8);
    this.doc.setTextColor(...COLOR_PRIMARY_EMERALD);
    this.doc.text('•', 17, this.currentY);
    this.doc.text(`${boldPart} : `, 22, this.currentY);

    const boldWidth = this.doc.getTextWidth(`${boldPart} : `);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...COLOR_DARK_TEXT);

    const restLines = this.doc.splitTextToSize(restPart, 180 - (7 + boldWidth));
    if (restLines.length > 0) {
      this.doc.text(restLines[0], 22 + boldWidth, this.currentY);
      if (restLines.length > 1) {
        for (let i = 1; i < restLines.length; i++) {
          this.currentY += 4.3;
          this.checkPageBreak(8);
          this.doc.text(restLines[i], 22, this.currentY);
        }
      }
    }
    this.currentY += 5;
  }

  /**
   * Tableau multi-lignes sans coupure de texte, avec alternance de fond propre
   */
  public addTable(headers: string[], rows: string[][], colWidths: number[]) {
    this.checkPageBreak(25);

    // En-tête de tableau
    this.doc.setFillColor(...COLOR_PRIMARY_EMERALD);
    this.doc.roundedRect(15, this.currentY, 180, 7.5, 1, 1, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.2);
    this.doc.setTextColor(255, 255, 255);

    let curX = 15;
    headers.forEach((h, idx) => {
      this.doc.text(h, curX + 2.5, this.currentY + 5.2);
      curX += colWidths[idx];
    });
    this.currentY += 7.5;

    // Lignes de données avec retour automatique à la ligne par cellule
    rows.forEach((row, rIdx) => {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7.8);

      const cellLines = row.map((cell, cIdx) => 
        this.doc.splitTextToSize(cell, colWidths[cIdx] - 5)
      );
      const maxLines = Math.max(...cellLines.map(l => l.length), 1);
      const rowHeight = Math.max(maxLines * 4.1 + 3.2, 7.2);

      this.checkPageBreak(rowHeight + 2);

      const isEven = rIdx % 2 === 0;
      this.doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      this.doc.rect(15, this.currentY, 180, rowHeight, 'F');
      this.doc.setDrawColor(229, 231, 235);
      this.doc.setLineWidth(0.2);
      this.doc.line(15, this.currentY + rowHeight, 195, this.currentY + rowHeight);

      this.doc.setTextColor(...COLOR_DARK_TEXT);

      let rowX = 15;
      cellLines.forEach((lines, cIdx) => {
        lines.forEach((line: string, lineIdx: number) => {
          this.doc.text(line, rowX + 2.5, this.currentY + 4 + (lineIdx * 3.8));
        });
        rowX += colWidths[cIdx];
      });

      this.currentY += rowHeight;
    });

    this.currentY += 5;
  }

  public save(filename: string) {
    this.addFooter();
    this.doc.save(filename);
  }
}

/**
 * 1. DOSSIER DE PRÉSENTATION SPÉCIAL MENTORAT ONG INTERNATIONALE (FRANÇAIS)
 * Document complet, exhaustif et professionnel destiné à une ONG Internationale marraine.
 */
export function telechargerDossierMentoratONGInternationalePDF() {
  const builder = new PdfDocumentBuilder("Dossier de Présentation & Candidature au Mentorat");

  builder.addDocumentHeader(
    "Partenariat International & Mentorat Institutionnel",
    "DOSSIER DE PRÉSENTATION STRATÉGIQUE & CANDIDATURE AU MENTORAT",
    "Plateforme d'Accompagnement de Toute Personne Ayant Perdu au Moins 1 Enfant (Deuil Périnatal, Infantile & Tout Âge) • Le Jardin de l'Espoir : Parange",
    {
      version: "Édition Spéciale Mentorat • V3.2",
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      audience: "Direction Générale & Pôle Partenariats de l'ONG Internationale Mentore"
    }
  );

  // SECTION 1: RÉSUMÉ EXÉCUTIF & DEMANDE DE MENTORAT
  builder.addSectionTitle("1", "RÉSUMÉ EXÉCUTIF & MISSION FONDAMENTALE");
  
  builder.addCallout(
    "PRINCIPE CARDINAL D'INCLUSIVITÉ UNIVERSELLE : DU DEUIL PÉRINATAL AU DECES D'UN ENFANT ADULTE",
    "Le Jardin de l'Espoir : Parange accueille et accompagne TOUTE personne ayant perdu au moins un enfant, QUEL QUE SOIT L'ÂGE de l'enfant disparu : qu'il soit mort-né (mort fœtale in utero, fausse couche tardive, interruption médicale de grossesse), nourrisson, jeune enfant, adolescent, ou adulte décédé à un âge avancé. Pour des parents, la perte d'un enfant défie l'ordre naturel des générations et aucune durée de vie n'atténue la blessure d'un cœur de père ou de mère. On reste Parange pour toujours.",
    "accent"
  );

  builder.addParagraph(
    "Le Jardin de l'Espoir : Parange est la première organisation ivoirienne structurée dédiée exclusivement au soutien psychologique, à la réhabilitation psychosociale et à la mémoire digne des parents endeuillés par la disparition d'un enfant en Côte d'Ivoire et dans la diaspora."
  );
  builder.addParagraph(
    "Portée par une gouvernance citoyenne rigoureuse et une équipe pluridisciplinaire (psychologues cliniciens, sages-femmes, pairs-aidants certifiés), notre organisation allie un sanctuaire numérique empathique, une ligne d'écoute solidaire 24/7, une communauté d'entraide active sur Facebook, et des interventions directes en milieu hospitalier et communautaire."
  );

  builder.addCallout(
    "Objet de notre démarche de mentorat international",
    "Nous sollicitons un partenariat de mentorat institutionnel auprès de votre ONG Internationale afin de bénéficier de votre accompagnement stratégique, de votre retour d'expérience méthodologique et de votre appui au renforcement de nos capacités organisationnelles (gouvernance SOP, conformité aux standards des grands bailleurs mondiaux, protocoles cliniques et mesure d'impact social SROI).",
    "info"
  );

  builder.addSubSectionTitle("Pourquoi un mentorat est décisif à ce stade de notre développement");
  builder.addBullet("Passage à l'échelle maîtrisé", "Passer du statut d'initiative pilote éprouvée à Abidjan à celui d'opérateur de référence national et sous-régional en Afrique de l'Ouest.");
  builder.addBullet("Standardisation médico-sociale", "Harmoniser nos parcours d'accueil, d'écoute et de soutien sur les meilleures pratiques internationales (OMS, UNICEF, FIGO).");
  builder.addBullet("Préparation aux financements multilatéraux", "Consolider nos manuels de procédures administratives, financières et éthiques pour répondre aux exigences des grands bailleurs (AFD, USAID, Union Européenne, Fondations philanthropiques).");

  // SECTION 2: LE CONTEXTE CRITIQUE EN CÔTE D'IVOIRE
  builder.addSectionTitle("2", "LE CONTEXTE DE SANTÉ PUBLIQUE ET LE DIAGNOSTIC TERRAIN EN CÔTE D'IVOIRE");
  builder.addParagraph(
    "En Côte d'Ivoire, si des progrès notables ont été enregistrés dans la réduction de la mortalité maternelle obstétricale, la santé mentale liée au deuil parental demeure un angle mort dramatique. La disparition d'un enfant – qu'elle survienne in utero, dans les premiers jours de vie, dans l'enfance ou à l'âge adulte – est souvent refoulée par le silence et des croyances paralysantes."
  );

  builder.addTable(
    ["Indicateur Sanitaire & Social", "Constat Terrain (Côte d'Ivoire)", "Impact Psychosocial & Conjugal"],
    [
      ["Taux de mortalité néonatale", "~28 pour 1 000 naissances vivantes", "Des milliers de mères quittent la maternité les bras vides chaque année"],
      ["Décès d'enfants & jeunes adultes", "Accidents, maladies infectieuses, drames", "Séquelles traumatiques prolongées sans prise en charge spécialisée"],
      ["Prise en charge psychologique hospitalière", "Inférieure à 2% dans les structures publiques", "Dépression post-traumatique sévère, mutisme, déscolarisation des aînés"],
      ["Perception culturelle et religieuse", "Deuil souvent tabou, parfois culpabilisant", "Stigmatisation des mères, sentiment de malédiction et isolement"],
      ["Injonction masculine", "Interdiction culturelle faite aux pères de pleurer", "Détresse paternelle silencieuse, ruptures conjugales, perte de repères"],
      ["Dispositifs publics de soutien au deuil", "Inexistants (aucun centre d'écoute public)", "Absence complète de protocole de soutien post-hospitalier"]
    ],
    [52, 63, 65]
  );

  builder.addParagraph(
    "La genèse de notre ONG puise sa force dans une tragédie intime vécue en 2018 par ses fondateurs : la perte de 9 membres de leur famille dont deux enfants dans un incendie. De ce désert de douleur est née une promesse sacrée : faire en sorte qu'aucun parent en Côte d'Ivoire ne soit condamné à traverser ce calvaire dans la honte et la solitude."
  );

  // SECTION 3: LES 8 MODULES OPÉRATIONNELS DE LA PLATEFORME
  builder.addSectionTitle("3", "ARCHITECTURE FONCTIONNELLE : LES 8 MODULES DE L'ÉCOSYSTÈME");
  builder.addParagraph(
    "La plateforme constitue une infrastructure hybride (numérique et de proximité), pensée pour répondre avec compassion à chaque étape du deuil parental, quel que soit l'âge de l'enfant disparu :"
  );

  builder.addSubSectionTitle("1. Permanence d'Écoute Solidaire 24/7 & Accueil d'Urgence");
  builder.addParagraph(
    "Ligne téléphonique gratuite (+225 07 59 87 21 61 / 05 75 23 93 12) et canal WhatsApp direct. Accueil inconditionnel par des écoutantes formées, détection précoce du risque suicidaire et orientation sous 24h vers une consultation clinique."
  );

  builder.addSubSectionTitle("2. Sanctuaire Mémoriel & Jardin Virtuel des Anges");
  builder.addParagraph(
    "Espace de mémoire respectueux où chaque parent sème une fleur éternelle (Tournesol, Rose, Myosotis, Lavande, Bougie) avec le nom de son enfant, une date et un mot d'amour. La communauté peut y allumer des bougies virtuelles solidaires."
  );

  builder.addSubSectionTitle("3. Cercles de Parole & Groupes de Soutien Psychologique (GSP)");
  builder.addParagraph(
    "Rencontres régulières à Abidjan et à l'intérieur du pays (Bouaké, San-Pedro, Yamoussoukro) ainsi qu'en visioconférence confidentielle. Co-animation par un psychologue clinicien et un parent pair-aidant. Cercles pour mamans, papas (libération de la parole masculine), couples, et familles ayant perdu un enfant en bas âge ou adulte."
  );

  builder.addSubSectionTitle("4. Carnet & Journal Émotionnel Sécurisé (ID & Mot de Passe, Reliure Personnalisable)");
  builder.addParagraph(
    "Sanctuaire intime d'auto-observation quotidienne protégé par identifiant unique et mot de passe secret. Le parent peut entièrement personnaliser son carnet (6 couleurs apaisantes de reliure, 7 motifs sacrés d'anges et de fleurs, ex-libris de dédicace), enregistrer sa météo intérieure (1/5 à 5/5, 12 émotions, sommeil) et mesurer le cheminement de sa résilience. Confidentialité absolue : données chiffrées localement sur l'appareil du parent, sans exploitation commerciale."
  );

  builder.addSubSectionTitle("5. Programme Hospitalier : Boîtes Mémorielles & Kits de Deuil");
  builder.addParagraph(
    "Dotation des maternités de boîtes à trésors dignes (lange de présentation, empreintes d'argile des mains/pieds, bracelet de naissance, carte d'hommage) évitant aux parents de repartir les bras vides."
  );

  builder.addSubSectionTitle("6. Académie de Formation des Soignants & Équipes Médicales");
  builder.addParagraph(
    "Modules de formation certifiants pour sages-femmes, infirmiers et internes : annonce humaine du décès, bannissement des formules toxiques (« tu es jeune, tu en auras d'autres »), gestion du traumatisme des soignants et protocole d'orientation vers l'ONG."
  );

  builder.addSubSectionTitle("7. Communauté Facebook Officielle & Forum d'Entraide");
  builder.addParagraph(
    `Espace d'échange fraternel permanent réunissant parents et proches endeuillés sur le groupe Facebook officiel (${OFFICIAL_FACEBOOK_GROUP}) et forum web thématique sans prosélytisme ni culpabilisation.`
  );

  builder.addSubSectionTitle("8. Cockpit d'Administration, Alertes en Temps Réel & Traçabilité");
  builder.addParagraph(
    "Tableau de bord sécurisé avec bulle d'alerte signalant les détresses aiguës, gestion des stocks de kits, suivi de l'évolution mensuelle des dons (Recharts), et exports complets (CSV/JSON) pour audits des bailleurs."
  );

  // SECTION 4: ATOUTS DIFFÉRENCIANTS & INNOVATION SOCIALE
  builder.addSectionTitle("4", "AVANTAGES COMPÉTITIFS & VALEUR AJOUTÉE DU MODÈLE");
  builder.addBullet("Inclusivité sans distinction d'âge", "Accueil de toute perte d'enfant : mort-né, nourrisson, adolescent ou adulte à un âge avancé. Aucune hiérarchie dans la douleur d'un parent.");
  builder.addBullet("Pionnier en Afrique Subsaharienne francophone", "Première plateforme à combiner santé mentale clinique, sanctuaire mémoriel et inclusion des pères en Côte d'Ivoire.");
  builder.addBullet("Conception PWA Low-Bandwidth", "Application web ultra-rapide (< 1.2s), accessible sur smartphones modestes avec connectivité 3G/4G intermittente.");
  builder.addBullet("Bilinguisme intégral (FR & EN)", "Prête pour la mobilisation de la diaspora en Europe et Amérique du Nord et un essaimage sous-régional.");
  builder.addBullet("Éthique et souveraineté des données", "Conformité stricte aux lois sur la protection des données (ARTCI) et aux standards internationaux (RGPD).");

  // SECTION 5: CADRE DE COLLABORATION DU MENTORAT INSTITUTIONNEL
  builder.addSectionTitle("5", "CADRE DE COLLABORATION DU MENTORAT INSTITUTIONNEL (4 PILIERS)");
  builder.addParagraph(
    "Nous envisageons le mentorat comme une alliance stratégique structurante axée sur 4 piliers concrets :"
  );

  builder.addTable(
    ["Pilier de Mentorat", "Appui Attendu de l'ONG Mentore", "Livrable Concret Conjoint"],
    [
      ["1. Gouvernance & Conformité", "Audit organisationnel, structuration des comités, mise aux normes des procédures SOP", "Manuel de Procédures Administratives, Financières et RH conforme aux bailleurs mondiaux"],
      ["2. Ingénierie Psychosociale", "Supervision clinique, relecture des protocoles d'accompagnement et d'éthique", "Guide Méthodologique de Prise en Charge du Deuil Parental en contexte ivoirien et africain"],
      ["3. Mesure d'Impact (M&E / SROI)", "Co-conception d'indicateurs d'impact et d'évaluation psychométrique", "Rapport annuel certifié d'évaluation d'impact médico-social et d'efficacité clinique"],
      ["4. Plaidoyer & Levée de Fonds", "Co-réponse aux appels à projets d'envergure (USAID, AFD, Union Européenne)", "Dossiers de candidatures conjoints et plaidoyer commun auprès du Ministère de la Santé"]
    ],
    [48, 68, 64]
  );

  builder.addSubSectionTitle("La Valeur Ajoutée pour l'ONG Mentore (Partenariat Gagnant-Gagnant)");
  builder.addBullet("Ancrage communautaire authentique", "Partenariat avec une initiative de terrain légitime, profondément enracinée dans le tissu social ivoirien, répondant à un besoin humanitaire orphelin.");
  builder.addBullet("Contribution aux ODD mondiaux", "Impact direct sur l'ODD 3 (Santé et bien-être), l'ODD 5 (Égalité des genres et dignité des mères) et l'ODD 17 (Partenariats pour les objectifs).");
  builder.addBullet("Rayonnement scientifique & plaidoyer", "Opportunité de co-publier des études inédites sur la santé mentale du deuil en Afrique et d'intervenir à l'Assemblée Mondiale de la Santé.");

  // SECTION 6: FEUILLE DE ROUTE OPÉRATIONNELLE (2026 - 2028)
  builder.addSectionTitle("6", "FEUILLE DE ROUTE OPÉRATIONNELLE & HORIZONS DE CROISSANCE");
  builder.addTable(
    ["Période", "Objectifs Stratégiques Clés", "Cibles & Indicateurs d'Impact"],
    [
      ["Année 1 (2026)", "Consolidation du sanctuaire numérique, 4 antennes régionales (Abidjan, Bouaké, San-Pedro, Yamoussoukro), structuration SOP avec le mentor", "1 500 familles accompagnées, 500 soignants formés, 800 boîtes de mémoire remises"],
      ["Année 2 (2027)", "Convention de partenariat avec le Ministère de la Santé, équipement de 20 maternités de référence, caravane de consultations mobiles", "4 000 familles soutenues, 1 500 soignants certifiés, 2 500 kits distribués"],
      ["Année 3 (2028)", "Modélisation en boîte à outils réplicable (Toolkit) et essaimage vers les pays voisins de la CEDEAO (Sénégal, Bénin, Togo)", "10 000 familles suivies, 3 pays partenaires, plaidoyer sous-régional ouest-africain"]
    ],
    [38, 80, 62]
  );

  // SECTION 7: TRANSPARENCE & COORDONNÉES OFFICIELLES
  builder.addSectionTitle("7", "ENGAGEMENTS DE TRANSPARENCE, COMMUNAUTÉ & CONTACTS");
  builder.addParagraph(
    "Le Jardin de l'Espoir : Parange applique une politique stricte de tolérance zéro envers la fraude et s'engage à soumettre ses comptes à un audit annuel indépendant par un cabinet certifié. Tous les registres et rapports sont tenus à la disposition constante de nos partenaires et mentors."
  );

  builder.addTable(
    ["Fonction / Canal Officiel", "Coordonnées & Adresses Directes", "Disponibilité & Modalités"],
    [
      ["Groupe Facebook Officiel", "facebook.com/groups/lejardindelespoirparange/", "Communauté d'entraide active 24h/24"],
      ["Permanence d'Écoute Solidaire", "+225 07 59 87 21 61 / +225 05 75 23 93 12", "Ligne 7j/7, de 8h à 20h (appel et WhatsApp)"],
      ["Direction Exécutive & Plaidoyer", "direction@jardindelespoir.ci", "Réponse garantie sous 24h ouvrées"],
      ["Pôle Partenariats & Mentorat", "partenariats@jardindelespoir.ci", "Traitement prioritaire immédiat"],
      ["Siège Social & Sanctuaire Pilote", "Cocody Riviera, Abidjan, République de Côte d'Ivoire", "Du Lundi au Samedi (8h - 18h)"]
    ],
    [52, 74, 54]
  );

  builder.addCallout(
    "Conclusion et Appel à l'Engagement Partenarial",
    "Nous nous tenons à votre entière disposition pour une première session de travail (en visioconférence ou en présentiel à Abidjan) afin de vous présenter en direct la plateforme, notre équipe et définir ensemble les modalités précises de cette convention de mentorat mutuellement féconde.",
    "info"
  );

  builder.save("Dossier_Presentation_Mentorat_ONG_Internationale_Le_Jardin_de_l_Espoir_Parange.pdf");
}

/**
 * 2. INTERNATIONAL NGO MENTORSHIP PROPOSAL & PLATFORM PITCH DECK (ENGLISH)
 */
export function downloadInternationalNGOMentorshipPitchPDF_EN() {
  const builder = new PdfDocumentBuilder("International NGO Mentorship Proposal");

  builder.addDocumentHeader(
    "International Partnership & Institutional Mentorship",
    "STRATEGIC PLATFORM PRESENTATION & MENTORSHIP PROPOSAL",
    "Flagship Support Platform for All Persons Who Have Lost a Child (Perinatal, Infant & Any Age) • Le Jardin de l'Espoir : Parange (Garden of Hope)",
    {
      version: "Special Mentorship Edition • V3.2",
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      audience: "Executive Board & Partnership Directorate of the Mentor International NGO"
    }
  );

  // SECTION 1: EXECUTIVE SUMMARY & CORE MISSION
  builder.addSectionTitle("1", "EXECUTIVE SUMMARY & FOUNDATIONAL INCLUSIVITY PRINCIPLE");

  builder.addCallout(
    "UNIVERSAL INCLUSIVITY PRINCIPLE: FROM STILLBIRTH TO LOSS OF AN ADULT CHILD AT AN ADVANCED AGE",
    "Le Jardin de l'Espoir : Parange welcomes and supports EVERY person who has lost at least one child, REGARDLESS OF THE CHILD'S AGE: whether stillborn (intrauterine fetal demise, late miscarriage, medical termination), infant, young child, adolescent, or an adult child passing away at an advanced age. For a parent, surviving one's child defies the natural order of life; no length of days diminishes the profound heartache of a mother or father. You remain a Parange forever.",
    "accent"
  );

  builder.addParagraph(
    "Le Jardin de l'Espoir : Parange is the foremost Ivorian non-profit organization dedicated exclusively to psychological support, psychosocial rehabilitation, and dignified commemoration for bereaved parents and families in Côte d'Ivoire and across the diaspora."
  );
  builder.addParagraph(
    "Led by rigorous community governance and an interdisciplinary clinical team (clinical psychologists, midwives, certified peer supporters), our ecosystem seamlessly bridges an empathetic digital sanctuary, a 24/7 solidarity helpline, an active Facebook mutual-support group, and on-the-ground interventions in maternity wards."
  );

  builder.addCallout(
    "Purpose of our International Mentorship Request",
    "We seek an institutional mentorship partnership with your esteemed International NGO to benefit from your strategic guidance, proven methodological toolkits, and organizational capacity building (SOP governance, compliance with global institutional donor standards, clinical protocol alignment, and Social Return on Investment measurement).",
    "info"
  );

  builder.addSubSectionTitle("Why Mentorship is Critical at this Stage of Growth");
  builder.addBullet("Managed Scalability", "Transitioning from a validated pilot in Abidjan to a recognized national and West African regional reference operator.");
  builder.addBullet("Clinical Standardization", "Aligning our intake, counseling, and peer-support protocols with WHO, UNICEF, and FIGO international benchmarks.");
  builder.addBullet("Multilateral Funding Readiness", "Consolidating our administrative, financial, and ethical standard operating procedures to meet major donor requirements (USAID, AFD, European Union, philanthropic foundations).");

  // SECTION 2: HEALTHCARE CONTEXT IN CÔTE D'IVOIRE
  builder.addSectionTitle("2", "PUBLIC HEALTH CONTEXT & GROUND-LEVEL DIAGNOSIS IN CÔTE D'IVOIRE");
  builder.addParagraph(
    "In Côte d'Ivoire and Sub-Saharan Africa, while commendable progress has been achieved in basic obstetric survival rates, parental bereavement mental health remains a severe, neglected blind spot. Losing a child—whether before birth, in infancy, or later in life—is frequently met with cultural taboos, guilt, and forced silence."
  );

  builder.addTable(
    ["Healthcare & Social Indicator", "Ground Reality (Côte d'Ivoire)", "Psychosocial Impact on Families"],
    [
      ["Neonatal mortality rate", "~28 per 1,000 live births", "Thousands of mothers leave maternity clinics with empty arms each year"],
      ["Loss of children & adult offspring", "Accidents, infectious diseases, tragedies", "Severe unaddressed post-traumatic grief across prolonged lifespans"],
      ["Public hospital psychological care", "Under 2% in public healthcare centers", "Chronic post-traumatic depression, emotional mutism, marital strain"],
      ["Cultural & traditional perception", "Grief treated as taboo or bad omen", "Unfair stigmatization of mothers, shame, and deep isolation"],
      ["Societal injunction on men", "Strong expectation that fathers never weep", "Silent male agony, hidden distress, substance abuse, divorce"],
      ["Public bereavement services", "Non-existent (0 public centers dedicated)", "Absence of structured post-discharge bereavement protocols"]
    ],
    [52, 63, 65]
  );

  // SECTION 3: THE 8 CORE APPLICATIVE MODULES
  builder.addSectionTitle("3", "FUNCTIONAL ECOSYSTEM: THE 8 INTEGRATED MODULES");

  builder.addSubSectionTitle("1. 24/7 Solitary Helpline & Emergency Intake");
  builder.addParagraph(
    "Toll-free calling (+225 07 59 87 21 61 / 05 75 23 93 12) and direct WhatsApp triage. Compassionate intake by trained listeners, suicide/severe trauma screening, and rapid referral within 24 business hours to clinical consultations."
  );

  builder.addSubSectionTitle("2. Virtual Memorial Sanctuary & Angel Blooms");
  builder.addParagraph(
    "Dignified virtual memorial where parents plant an eternal flower (Sunflower, Rose, Forget-me-not, Lavender, Candle) bearing their child's name, memorial date, and tribute. Community members light solidarity candles in reverent remembrance."
  );

  builder.addSubSectionTitle("3. Peer Support Groups (GSP) & Healing Circles");
  builder.addParagraph(
    "Regular in-person sessions in Abidjan and regional hubs (Bouaké, San-Pedro, Yamoussoukro) plus confidential video circles. Co-facilitated by a licensed clinical psychologist and a trained peer parent. Dedicated circles for mothers, fathers (dismantling male taboos), couples, and families mourning children of all ages."
  );

  builder.addSubSectionTitle("4. Sovereign Private Emotional Journal (ID & PIN Protected, Customizable Cover & Motifs)");
  builder.addParagraph(
    "A private self-observation sanctuary secured by personal ID and confidential PIN. Parents can customize their notebook (6 soothing cover themes, 7 sacred emblems including angel wings and lotus, personalized dedication ex-libris), log their daily emotional weather (1/5 to 5/5, 12 emotions, sleep quality) and follow their resilience timeline. Strict zero-tracking privacy guarantee."
  );

  builder.addSubSectionTitle("5. Hospital Memory Keepsake Boxes");
  builder.addParagraph(
    "Equipping reference maternity wards with dignified memory kits (gentle swaddle, inkless/clay hand & footprint sets, birth certificate of honor) ensuring parents never leave delivery rooms empty-handed."
  );

  builder.addSubSectionTitle("6. Healthcare Workers & Midwives Training Academy");
  builder.addParagraph(
    "Accredited continuous training modules for midwives, nurses, and obstetricians: breaking tragic news with human dignity, eradicating hurtful automatic clichés ('you are young, you will have more'), and managing healthcare provider compassion fatigue."
  );

  builder.addSubSectionTitle("7. Official Facebook Community & Moderated Forum");
  builder.addParagraph(
    `Permanent mutual-support community on our official Facebook group (${OFFICIAL_FACEBOOK_GROUP}) and structured web forum with zero religious or social judgment.`
  );

  builder.addSubSectionTitle("8. Secure Administration Cockpit & Real-Time Alert System");
  builder.addParagraph(
    "Supervised command console with real-time alert bubble for acute distress signals, kit inventory tracking, monthly donation Recharts visualization, and universal audit-ready exports (CSV/JSON)."
  );

  // SECTION 4: DIFFERENTIATORS & SOCIAL INNOVATION
  builder.addSectionTitle("4", "COMPETITIVE ADVANTAGES & UNIQUE VALUE PROPOSITION");
  builder.addBullet("All-Age Inclusivity", "Supporting every parent who lost a child: whether stillborn, newborn, teenager, or adult offspring at an advanced age.");
  builder.addBullet("Sub-Saharan Pioneer", "First French-speaking African organization directly reconciling clinical psychology, memory rituals, and fatherhood engagement.");
  builder.addBullet("Low-Bandwidth PWA Architecture", "Sub-second load times (< 1.2s), fully responsive on entry-level mobile devices over intermittent 3G/4G connectivity.");
  builder.addBullet("Complete Bilingualism (FR & EN)", "Engineered for pan-African and diaspora outreach in Europe and North America.");
  builder.addBullet("Data Sovereignty & Ethics", "Full compliance with local African data protection laws (ARTCI) and global privacy standards (GDPR).");

  // SECTION 5: INSTITUTIONAL MENTORSHIP FRAMEWORK
  builder.addSectionTitle("5", "4-PILLAR INSTITUTIONAL MENTORSHIP COLLABORATION FRAMEWORK");

  builder.addTable(
    ["Mentorship Pillar", "Expected Mentor NGO Support", "Tangible Joint Deliverable"],
    [
      ["1. Governance & Compliance", "Organizational audit, SOP development, internal control structuring", "Standard Operating Procedures manual aligned with global donor audits"],
      ["2. Clinical Psychosocial Engineering", "Supervision, clinical review of intake and bereavement frameworks", "Culturally-adapted Parent Bereavement Clinical Toolkit for African contexts"],
      ["3. Impact Measurement (M&E / SROI)", "Co-designing psychometric indicators and socio-clinical evaluation", "Annual certified Social Return on Investment and clinical efficacy report"],
      ["4. Consortium Bidding & Advocacy", "Joint application to major multilateral funding calls (USAID, AFD, EU)", "Joint project proposals and co-advocacy before the Ivorian Ministry of Health"]
    ],
    [48, 68, 64]
  );

  // SECTION 6: ROADMAP (2026 - 2028)
  builder.addSectionTitle("6", "OPERATIONAL ROADMAP & SCALE HORIZONS");
  builder.addTable(
    ["Timeframe", "Strategic Key Milestones", "Target Impact KPIs"],
    [
      ["Year 1 (2026)", "Platform consolidation, 4 regional hubs (Abidjan, Bouaké, San-Pedro, Yamoussoukro), internal SOP structuring with mentor", "1,500 families supported, 500 clinicians trained, 800 keepsake boxes provided"],
      ["Year 2 (2027)", "Formal partnership with the Ivorian Ministry of Health, 20 reference maternity wards equipped, mobile clinics caravan", "4,000 families assisted, 1,500 clinicians certified, 2,500 kits delivered"],
      ["Year 3 (2028)", "Standardized replicable toolkit and regional scale to ECOWAS neighbors (Senegal, Benin, Togo)", "10,000 families supported, 3 partner countries, regional health advocacy"]
    ],
    [38, 80, 62]
  );

  // SECTION 7: TRANSPARENCY & OFFICIAL CONTACTS
  builder.addSectionTitle("7", "TRANSPARENCY COMMITMENTS, COMMUNITY & CONTACTS");
  builder.addParagraph(
    "Le Jardin de l'Espoir : Parange maintains a strict zero-tolerance anti-corruption policy and commits to annual independent financial audits by a certified firm. All narrative and financial books are permanently open to our partners and mentors."
  );

  builder.addTable(
    ["Official Channel", "Direct Coordinates", "Availability & Details"],
    [
      ["Official Facebook Group", "facebook.com/groups/lejardindelespoirparange/", "Active 24/7 mutual-support community"],
      ["24/7 Emergency Helpline", "+225 07 59 87 21 61 / +225 05 75 23 93 12", "7 days a week, 8am - 8pm (Calls & WhatsApp)"],
      ["Executive Leadership", "direction@jardindelespoir.ci", "Response within 24 business hours"],
      ["Mentorship & Partnerships", "partenariats@jardindelespoir.ci", "Immediate priority handling"],
      ["Headquarters", "Cocody Riviera, Abidjan, Republic of Côte d'Ivoire", "Monday to Saturday (8am - 6pm)"]
    ],
    [52, 74, 54]
  );

  builder.addCallout(
    "Conclusion and Next Steps",
    "We are fully available for an initial briefing session (via videoconference or in person in Abidjan) to demonstrate the platform live, introduce our team, and define the terms of this mutually fruitful mentorship agreement.",
    "info"
  );

  builder.save("Mentorship_Proposal_International_NGO_Le_Jardin_de_l_Espoir_Parange.pdf");
}

/**
 * 3. CAHIER DES CHARGES FONCTIONNEL & TECHNIQUE (FRANÇAIS)
 */
export function telechargerCahierDesChargesPDF() {
  const builder = new PdfDocumentBuilder("Cahier des Charges Fonctionnel & Technique");

  builder.addDocumentHeader(
    "Spécifications Techniques & Fonctionnelles",
    "Cahier des Charges du Système Informatique & Communautaire",
    "Plateforme d'Accompagnement de Toute Personne Ayant Perdu au Moins 1 Enfant (Deuil Périnatal, Infantile & Tout Âge) • Le Jardin de l'Espoir : Parange",
    {
      version: "3.2 - Production Release",
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      audience: "Équipe Technique, Direction, Experts Santé Mentale, Bailleurs"
    }
  );

  builder.addSectionTitle("1", "CONTEXTE, PROBLÉMATIQUE & OBJECTIFS MAJEURS");
  
  builder.addCallout(
    "Périmètre Fondamental d'Accompagnement de l'ONG",
    "Le système 'Le Jardin de l'Espoir : Parange' a été expressément conçu pour accompagner toute personne (mère, père, couple, fratrie) ayant perdu au moins un enfant, sans restriction d'âge : de l'enfant mort-né (mort in utero, fausse couche tardive, interruption médicale) jusqu'au décès d'un enfant à un âge avancé (adolescent ou adulte). Le traumatisme de la survie parentale ne s'éteint jamais avec l'âge.",
    "accent"
  );

  builder.addParagraph(
    "En Côte d'Ivoire et dans la sous-région ouest-africaine, le deuil d'un enfant demeure trop souvent enfermé dans un silence social oppressant. Notre plateforme apporte une infrastructure moderne, souveraine, empathique et sécurisée pour organiser l'écoute clinique, honorer la mémoire des enfants et former les personnels de santé."
  );

  builder.addSectionTitle("2", "PÉRIMÈTRE FONCTIONNEL DU SYSTÈME (LES MODULES CLÉS)");
  
  builder.addSubSectionTitle("Module 1 : Écoute Immédiate & Permanence 24h/24 et 7j/7");
  builder.addBullet("Ligne Téléphonique Dédiée", "Accès en 1-clic vers les numéros d'urgence (+225 07 59 87 21 61 / +225 05 75 23 93 12).");
  builder.addBullet("Messagerie d'Urgence WhatsApp", "Intégration directe vers la cellule d'écoute psychologique sans intermédiaire.");
  builder.addBullet("Triage & Orientation Clinique", "Orientation vers les Groupes de Soutien (GSP), consultations individuelles ou visites à domicile.");

  builder.addSubSectionTitle("Module 2 : Jardin Virtuel de la Mémoire & Allumage de Bougies");
  builder.addBullet("Plantation Symbolique", "Création d'une fleur éternelle pour chaque enfant avec prénom, date et message d'amour.");
  builder.addBullet("Bougies Solidaires", "Allumage interactif de bougies par les proches et visiteurs en hommage, avec compteur en temps réel.");

  builder.addSubSectionTitle("Module 3 : Carnet de Bord Émotionnel Privé");
  builder.addBullet("Échelle Visuelle Émotionnelle", "Auto-évaluation quotidienne par émojis sensibles adaptés au deuil (de 1/5 Douleur à 5/5 Sérénité).");
  builder.addBullet("Sommeil & Vitalité", "Suivi du repos nocturne et de l'énergie physique au fil des jours.");
  builder.addBullet("Confidentialité Absolue", "Données traitées à 100% sur l'appareil (localStorage) sans aucune transmission sur serveurs tiers.");

  builder.addSubSectionTitle("Module 4 : Mur des Récits & Espace Communautaire");
  builder.addBullet("Récits de Résilience", "Témoignages de mamans, papas et fratries ayant perdu un enfant.");
  builder.addBullet("Modération Préalable", "Sas d'approbation administrateur garantissant la bienveillance.");
  builder.addBullet("Groupe Facebook & Forum", `Animation de la communauté Facebook (${OFFICIAL_FACEBOOK_GROUP}) et forum thématique.`);

  builder.addSubSectionTitle("Module 5 : Espace Formation Soignants & Kits Hospitaliers");
  builder.addBullet("Sensibilisation Hospitalière", "Modules sur l'annonce du décès, l'humanisation des soins et l'écoute des pères.");
  builder.addBullet("Kit de Mémoire en Maternité", "Boîtes souvenirs (empreintes d'argile, lange doux, bracelet de naissance).");

  builder.addSubSectionTitle("Module 6 : Dons & Financements Solidaires");
  builder.addBullet("Paiements Locaux & Internationaux", "Intégration Wave, Orange Money, MTN MoMo et cartes bancaires.");
  builder.addBullet("Transparence Financière", "Génération de reçus et rapports comptables certifiés pour les donateurs.");

  builder.addSubSectionTitle("Module 7 : Visualisation Graphique des Dons (Recharts)");
  builder.addBullet("Tableau de bord Recharts", "Suivi mensuel interactif des collectes, répartition par opérateur mobile et nombre de donateurs.");

  builder.addSubSectionTitle("Module 8 : FAQ Dynamique & Modération");
  builder.addBullet("Gestion des Q&R", "Outil d'administration permettant d'ajouter, modifier et organiser les questions-réponses des parents.");

  builder.addSectionTitle("3", "SPÉCIFICATIONS TECHNIQUES & ARCHITECTURE LOGICIELLE");
  builder.addTable(
    ["Composant", "Technologie Retenue", "Rôle & Justification"],
    [
      ["Frontend Web", "React 19, TypeScript, Vite", "Interface réactive, typage strict, chargement initial < 1.2s"],
      ["Styles & UX", "Tailwind CSS v4", "Design apaisant, respect des normes WCAG AA pour le contraste"],
      ["Visualisations", "Recharts & Lucide Icons", "Graphiques d'évolution des dons, barres et courbes de suivi financier"],
      ["Confidentialité", "Client-Side Encrypted Storage", "Journal émotionnel conservé localement, respect strict RGPD/ARTCI"],
      ["Gestion Admin", "Console Dédiée avec Exports", "Export universel 6 CSV Excel UTF-8 avec BOM + JSON consolidé"],
      ["Déploiement", "Google Cloud Run / Conteneur", "Haute disponibilité 99.9%, scalabilité automatique"]
    ],
    [35, 55, 90]
  );

  builder.addSectionTitle("4", "GOUVERNANCE, SÉCURITÉ & COORDONNÉES");
  builder.addTable(
    ["Canal", "Coordonnées Officielles", "Disponibilité"],
    [
      ["Groupe Facebook Officiel", "facebook.com/groups/lejardindelespoirparange/", "Communauté d'entraide 24h/24"],
      ["Permanence d'Écoute", "+225 07 59 87 21 61 / +225 05 75 23 93 12", "7j/7, 8h à 20h"],
      ["Courriel Direction", "direction@jardindelespoir.ci", "Sous 24h"],
      ["Siège Social", "Abidjan, République de Côte d'Ivoire", "Lundi au Samedi"]
    ],
    [50, 75, 55]
  );

  builder.save("Cahier_des_Charges_Le_Jardin_de_l_Espoir_Parange.pdf");
}

/**
 * 4. TECHNICAL SPECIFICATIONS (ENGLISH)
 */
export function downloadTechnicalSpecificationsPDF_EN() {
  const builder = new PdfDocumentBuilder("Functional & Technical Specifications");

  builder.addDocumentHeader(
    "Technical & Functional Specifications",
    "Comprehensive Specifications of the Digital & Community Ecosystem",
    "Support Platform for All Persons Who Have Lost a Child (Perinatal, Infant & Any Age) • Le Jardin de l'Espoir : Parange",
    {
      version: "3.2 - Production Release",
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      audience: "Engineering Team, Leadership, Mental Health Specialists, Donors"
    }
  );

  builder.addSectionTitle("1", "CONTEXT, SCOPE & CORE MANDATE");

  builder.addCallout(
    "Universal Core Mandate: Loss of a Child at Any Age",
    "Le Jardin de l'Espoir : Parange is specifically engineered to care for every mother, father, and family who has lost at least one child, regardless of age: from stillbirth and perinatal bereavement to infant loss and the death of adult children at an advanced age. Parental grief knows no expiration date.",
    "accent"
  );

  builder.addParagraph(
    "Across West Africa, the passing of a child is often compounded by cultural isolation and lack of psychological care. The platform provides a modern, sovereign, empathetic, and resilient infrastructure to coordinate care, honor memories, and train healthcare providers."
  );

  builder.addSectionTitle("2", "KEY MODULES & TECHNICAL CAPABILITIES");
  builder.addBullet("Module 1: 24/7 Helpline", "Direct calls (+225 07 59 87 21 61 / +225 05 75 23 93 12) & WhatsApp crisis triage.");
  builder.addBullet("Module 2: Virtual Memorial", "Planting eternal symbolic flowers with tribute counters and solidarity candles.");
  builder.addBullet("Module 3: Sovereign Mood Tracker", "100% client-side privacy-first journal for emotional self-assessment.");
  builder.addBullet("Module 4: Community & Facebook", `Dedicated mutual support on Facebook (${OFFICIAL_FACEBOOK_GROUP}) and moderated forums.`);
  builder.addBullet("Module 5: Maternity Memory Kits", "Dignified keepsake boxes for hospital bereavement protocols.");
  builder.addBullet("Module 6: Mobile Money Giving", "Direct donations via Wave, Orange Money, MTN MoMo, and international cards.");
  builder.addBullet("Module 7: Donation Analytics (Recharts)", "Interactive charts tracking monthly donation dynamics and channel breakdowns.");
  builder.addBullet("Module 8: Dynamic FAQ Management", "Administrative tool to update and curate questions for grieving parents.");

  builder.addSectionTitle("3", "TECHNICAL ARCHITECTURE & SOVEREIGNTY");
  builder.addTable(
    ["Component", "Stack Chosen", "Justification"],
    [
      ["Frontend Web", "React 19, TypeScript, Vite", "Ultra-fast response, strict type safety, initial load < 1.2s"],
      ["Styles & UX", "Tailwind CSS v4", "Calming palette adhering strictly to WCAG AA contrast"],
      ["Analytics", "Recharts", "Interactive charts for monthly donation monitoring in Admin view"],
      ["Data Privacy", "Client-Side Encrypted Storage", "Private journal stored strictly on device, GDPR & ARTCI compliant"],
      ["Cloud Infra", "Google Cloud Run", "99.9% high availability, auto-scaling, low carbon footprint"]
    ],
    [40, 55, 85]
  );

  builder.addSectionTitle("4", "OFFICIAL COORDINATES & ENGAGEMENT");
  builder.addTable(
    ["Channel", "Official Coordinates", "Availability"],
    [
      ["Facebook Community Group", "facebook.com/groups/lejardindelespoirparange/", "Active 24/7 mutual support"],
      ["24/7 Helpline", "+225 07 59 87 21 61 / +225 05 75 23 93 12", "7 days a week, 8am - 8pm"],
      ["Executive Leadership", "direction@jardindelespoir.ci", "Within 24 business hours"],
      ["Headquarters", "Abidjan, Republic of Côte d'Ivoire", "Monday to Saturday"]
    ],
    [50, 75, 55]
  );

  builder.save("Technical_Specifications_Garden_of_Hope_Parange.pdf");
}

/**
 * 5. DOSSIER DE PRÉSENTATION STRATÉGIQUE GÉNÉRAL (FRANÇAIS)
 */
export function telechargerDossierPresentationPDF() {
  const builder = new PdfDocumentBuilder("Dossier de Présentation Stratégique");

  builder.addDocumentHeader(
    "Plaquette Institutionnelle & Présentation Générale",
    "DOSSIER DE PRÉSENTATION STRATÉGIQUE & PLAQUETTE D'IMPACT",
    "Sanctuaire et Écosystème Pilote pour Toute Personne Ayant Perdu au Moins 1 Enfant (Tout Âge) • Le Jardin de l'Espoir : Parange",
    {
      version: "Édition Officielle 2026",
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      audience: "Investisseurs d'Impact, Ministère, CHU, Mécènes, Familles"
    }
  );

  builder.addSectionTitle("1", "VISION FONDATRICE & MANIFESTE");
  
  builder.addCallout(
    "INCLUSIVITÉ UNIVERSELLE : DU MORT-NÉ À L'ENFANT DÉCÉDÉ À UN ÂGE AVANCÉ",
    "Le Jardin de l'Espoir : Parange s'adresse sans réserve à TOUTES les personnes ayant perdu au moins 1 enfant, quel que soit l'âge de l'enfant disparu : qu'il soit mort-né (mort in utero, fausse couche tardive, IMG) ou mort à un âge avancé (nourrisson, jeune enfant, adolescent ou adulte). Pour un parent, le départ d'un enfant est une déchirure éternelle qui transcende les âges. On reste Parange pour toujours.",
    "accent"
  );

  builder.addParagraph(
    "« Lorsqu'un enfant perd ses parents, on l'appelle orphelin. Lorsqu'un conjoint perd sa moitié, on l'appelle veuf ou veuve. Mais lorsqu'un parent perd son enfant, il n'existe aucun mot dans la langue française. En Côte d'Ivoire, nous les appelons Paranges. »"
  );
  builder.addParagraph(
    "Le Jardin de l'Espoir : Parange est né d'un constat poignant : en Afrique subsaharienne, le décès d'un enfant est encore trop souvent minimisé, refoulé ou stigmatisé. Les mères traversent des dépressions sévères dans l'isolement, tandis que les pères portent en silence un fardeau indicible."
  );

  builder.addSectionTitle("2", "IMPACT SOCIAL & SOUTENABILITÉ FINANCIÈRE");
  builder.addSubSectionTitle("Indicateurs Clés d'Impact (KPIs)");
  builder.addTable(
    ["Indicateur Clé", "Cible 2026", "Objectif Horizon 2028"],
    [
      ["Paranges accompagnés (écoute & GSP)", "1 500 familles", "5 000 familles"],
      ["Fleurs mémorielles plantées au jardin", "2 500 anges", "10 000 anges"],
      ["Soignants formés à la bientraitance", "500 soignants", "2 000 professionnels"],
      ["Boîtes de mémoire distribuées en maternité", "800 kits", "3 500 kits"],
      ["Taux de détresse psychologique résorbé", "> 70% après 6 mois", "> 85% après 6 mois"]
    ],
    [70, 55, 55]
  );

  builder.addSectionTitle("3", "ÉCOSYSTÈME MULTI-CANAL & COMMUNAUTÉ");
  builder.addBullet("Ligne d'Écoute Solidaire 7j/7", "Écoute téléphonique gratuite (+225 07 59 87 21 61 / 05 75 23 93 12) et WhatsApp.");
  builder.addBullet("Communauté Facebook Officielle", `Groupe Facebook des Paranges (${OFFICIAL_FACEBOOK_GROUP}) pour échanger et rompre l'isolement au quotidien.`);
  builder.addBullet("Jardin Virtuel des Anges", "Sanctuaire de mémoire éternelle où semer une fleur et allumer des bougies.");
  builder.addBullet("Cercles de Parole (GSP)", "Rencontres présentielles et visioconférences pour mères, pères, couples et fratries.");
  builder.addBullet("Carnet Émotionnel Sécurisé (ID & Mot de Passe)", "Sanctuaire intime d'écriture avec personnalisation de la reliure (couleurs, motifs sacrés), météo intérieure quotidienne et suivi de résilience protégé par code secret.");

  builder.addSectionTitle("4", "CONTACTS & MODALITÉS DE COOPÉRATION");
  builder.addTable(
    ["Canal", "Coordonnées Officielles", "Disponibilité"],
    [
      ["Groupe Facebook Officiel", "facebook.com/groups/lejardindelespoirparange/", "Communauté active 24h/24"],
      ["Permanence d'Écoute", "+225 07 59 87 21 61 / +225 05 75 23 93 12", "7j/7, 8h à 20h"],
      ["Courriel Direction", "direction@jardindelespoir.ci", "Sous 24 heures"],
      ["Partenariats & Mécénat", "partenariats@jardindelespoir.ci", "Sous 24 heures"],
      ["Siège Social", "Cocody Riviera, Abidjan, République de Côte d'Ivoire", "Lundi au Samedi"]
    ],
    [50, 75, 55]
  );

  builder.save("Dossier_Presentation_Le_Jardin_de_l_Espoir_Parange.pdf");
}

/**
 * 6. STRATEGIC PRESENTATION DOSSIER & PITCH DECK (ENGLISH)
 */
export function downloadStrategicPresentationPDF_EN() {
  const builder = new PdfDocumentBuilder("Strategic Presentation Dossier");

  builder.addDocumentHeader(
    "Institutional Pitch Deck & Strategic Overview",
    "STRATEGIC PRESENTATION DOSSIER & IMPACT OVERVIEW",
    "Sanctuary & Flagship Ecosystem for All Persons Mourning the Loss of a Child • Le Jardin de l'Espoir : Parange",
    {
      version: "Official 2026 Edition",
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      audience: "Impact Investors, Ministries, University Hospitals, Donors, Families"
    }
  );

  builder.addSectionTitle("1", "FOUNDING VISION & MANIFESTO");

  builder.addCallout(
    "ALL-AGE INCLUSIVITY: FROM STILLBIRTH TO ADULT CHILD LOSS",
    "Le Jardin de l'Espoir : Parange is committed to serving EVERY person who has lost at least one child, regardless of age: whether stillborn or having passed away at an advanced adult age. A parent's love and sorrow transcend chronological age. Once a Parange, always a Parange.",
    "accent"
  );

  builder.addParagraph(
    "\"When a child loses their parents, they are called an orphan. When a spouse loses their partner, they are called a widow or widower. But when parents lose their child, there was no single dedicated word. In Côte d'Ivoire, we call them Paranges.\""
  );

  builder.addSectionTitle("2", "KEY IMPACT INDICATORS & ROADMAP");
  builder.addTable(
    ["Key Indicator", "Target 2026", "2028 Strategic Horizon"],
    [
      ["Bereaved families supported (Hotline & Groups)", "1,500 families", "5,000 families"],
      ["Memorial flowers planted in the garden", "2,500 angels", "10,000 angels"],
      ["Healthcare providers trained in dignity care", "500 clinicians", "2,000 clinicians"],
      ["Remembrance kits delivered in maternity wards", "800 kits", "3,500 kits"],
      ["Psychological distress reduction rate", "> 70% after 6 months", "> 85% after 6 months"]
    ],
    [70, 55, 55]
  );

  builder.addSectionTitle("3", "MULTI-CHANNEL ENGAGEMENT & COMMUNITY");
  builder.addBullet("7/7 Solitary Helpline", "Toll-free calling (+225 07 59 87 21 61 / +225 05 75 23 93 12) & WhatsApp.");
  builder.addBullet("Official Facebook Group", `Support community on Facebook (${OFFICIAL_FACEBOOK_GROUP}) for ongoing connection.`);
  builder.addBullet("Virtual Memorial Garden", "Eternal flowers and solidarity candles lit in living tribute.");
  builder.addBullet("Peer Support Circles (GSP)", "Warm gatherings for mothers, fathers, couples, and siblings.");
  builder.addBullet("Sovereign Emotional Journal (ID & PIN Protected)", "Private, encrypted notebook with customizable binding colors and sacred motifs, daily emotional weather checks, and secure resilience tracking.");

  builder.addSectionTitle("4", "OFFICIAL CONTACTS & COOPERATION");
  builder.addTable(
    ["Channel", "Official Coordinates", "Availability"],
    [
      ["Official Facebook Group", "facebook.com/groups/lejardindelespoirparange/", "Active 24/7 mutual support"],
      ["Emergency Helpline", "+225 07 59 87 21 61 / +225 05 75 23 93 12", "7 days a week, 8am - 8pm"],
      ["Executive Leadership", "direction@jardindelespoir.ci", "Within 24 business hours"],
      ["Partnerships & CSR", "partenariats@jardindelespoir.ci", "Within 24 business hours"],
      ["Headquarters", "Abidjan, Republic of Côte d'Ivoire", "Monday to Saturday"]
    ],
    [50, 75, 55]
  );

  builder.save("Strategic_Presentation_Dossier_Garden_of_Hope_Parange.pdf");
}

/**
 * 7. STATUTS OFFICIELS DÉPOSÉS DE L'ONG (FR)
 */
export function telechargerStatutsONG_PDF() {
  const builder = new PdfDocumentBuilder("Statuts Officiels ONG");

  builder.addDocumentHeader(
    "République de Côte d'Ivoire • Union - Discipline - Travail",
    "STATUTS CONSTITUTIFS OFFICIELS DE L'ORGANISATION",
    "Organisation Non Gouvernementale « LE JARDIN DE L'ESPOIR : PARANGE »",
    {
      version: "Statuts Déposés & Certifiés",
      date: "Fait à Abidjan, Édition 2026",
      audience: "Ministère de l'Intérieur, Bailleurs, Partenaires et Membres"
    }
  );

  builder.addSectionTitle("1", "DÉNOMINATION, SIÈGE ET OBJET SOCIAL");
  builder.addCallout(
    "PÉRIMÈTRE D'ACTION & INCLUSIVITÉ CARDINALE",
    "L'ONG 'Le Jardin de l'Espoir : Parange' a pour mission sacrée d'accueillir et accompagner TOUTE personne ayant perdu au moins un enfant, quel que soit l'âge de l'enfant disparu (mort-né, nourrisson, enfant, adolescent ou adulte à un âge avancé). Pour un parent, le lien transcende les âges.",
    "accent"
  );
  builder.addParagraph(
    "Article 1 : Il est fondé en République de Côte d'Ivoire une association à but non lucratif régie par la loi n° 60-315 du 21 septembre 1960 relative aux associations, dénommée « LE JARDIN DE L'ESPOIR : PARANGE »."
  );
  builder.addParagraph(
    "Article 2 : Le siège social est fixé à Abidjan (Cocody Riviera). Il peut être transféré en tout autre lieu du territoire national sur décision de l'Assemblée Générale."
  );
  builder.addParagraph(
    "Article 3 : L'ONG a pour objet exclusif le soutien psychologique, l'écoute fraternelle, la réhabilitation psychosociale des parents et fratries endeuillés, la fourniture de boîtes à souvenirs aux maternités, la gestion d'un sanctuaire mémoriel et la formation des professionnels de santé à l'accompagnement digne du deuil."
  );

  builder.addSectionTitle("2", "ORGANES DE GOUVERNANCE ET ADMINISTRATION");
  builder.addTable(
    ["Organe", "Composition & Rôle", "Périodicité des Réunions"],
    [
      ["Assemblée Générale (AG)", "Tous les membres actifs et bienfaiteurs", "Annuelle (Ordinaire) / Extraordinaire si besoin"],
      ["Conseil d'Administration (CA)", "7 administrateurs élus (Présidence, Secrétariat, Trésorerie)", "Trimestrielle"],
      ["Comité Clinique & Éthique", "Psychologues cliniciens, sages-femmes, pairs-aidants", "Mensuelle"],
      ["Direction Exécutive", "Coordination opérationnelle de la plateforme et des antennes", "Permanente"]
    ],
    [55, 75, 50]
  );

  builder.addSectionTitle("3", "RESSOURCES FINANCIÈRES & TRANSPARENCE COMPTABLE");
  builder.addParagraph(
    "Article 18 : Les ressources de l'ONG se composent des cotisations des membres, des dons manuels et legs, des subventions des institutions publiques et internationales, du mécénat d'entreprise (RSE) et des produits de ses activités de formation certifiante."
  );
  builder.addParagraph(
    "Article 19 : Une comptabilité rigoureuse en partie double conforme au système comptable SYSCOHADA associatif est tenue sous le contrôle du Trésorier Général et d'un Commissaire aux Comptes indépendant."
  );

  builder.save("Statuts_Officiels_ONG_Le_Jardin_de_l_Espoir_Parange.pdf");
}

/**
 * 8. GUIDE PRATIQUE DU DEUIL PARENTAL (TOUT ÂGE)
 */
export function telechargerGuideDeuilParental_PDF() {
  const builder = new PdfDocumentBuilder("Guide Pratique du Deuil Parental");

  builder.addDocumentHeader(
    "Guide Thérapeutique & Bienveillant pour les Familles",
    "GUIDE D'ACCOMPAGNEMENT DU DEUIL PARENTAL (TOUT ÂGE)",
    "Traverser le désert de l'absence, honorer la mémoire de son enfant et retrouver le souffle",
    {
      version: "Guide Officiel • Le Jardin de l'Espoir : Parange",
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      audience: "Mères, Pères, Fratries, Grands-Parents, Proches"
    }
  );

  builder.addSectionTitle("1", "RECONNAISSANCE ABSOLUE DE TOUTE PERTE D'ENFANT");
  builder.addCallout(
    "AUCUNE HIÉRARCHIE DANS LA DOULEUR D'UN PARENT",
    "Que votre enfant soit parti avant même son premier souffle (fausse couche tardive, mort in utero, IMG), dans les premiers jours de vie, dans l'enfance, à l'adolescence ou à l'âge adulte, votre douleur est légitime. Le lien d'amour ne dépend pas du nombre de battements de cœur partagés sur Terre. Vous êtes Parange pour toujours.",
    "accent"
  );

  builder.addParagraph(
    "Ce guide a été rédigé avec amour par des psychologues cliniciens et des parents pairs-aidants de Côte d'Ivoire. Il rassemble des repères pour vous aider à traverser les heures sombres, déculpabiliser et préserver le souvenir vivant de votre enfant."
  );

  builder.addSectionTitle("2", "LES GRANDES ÉTAPES DU VOYAGE DU DEUIL");
  builder.addBullet("Le Choc et la Sidération", "Le sentiment d'irréalité et d'anesthésie émotionnelle qui protège temporairement l'esprit d'une douleur trop violente.");
  builder.addBullet("Le Désert de l'Absence", "La sensation physique du vide, les montées soudaines de larmes, les troubles du sommeil et la perte d'appétit.");
  builder.addBullet("La Colère et la Culpabilité", "Le 'pourquoi lui ? pourquoi moi ?'. Ces émotions sont normales et doivent être accueillies sans honte.");
  builder.addBullet("Le Tissage de la Mémoire", "L'enfant trouve une place éternelle dans le sanctuaire du cœur. Le souvenir devient une force d'amour plutôt qu'une brûlure permanente.");

  builder.addSectionTitle("3", "OUTILS CONCRETS DE SOUTIEN DU JARDIN DE L'ESPOIR");
  builder.addTable(
    ["Dispositif", "Modalités & Accès", "Rôle Thérapeutique"],
    [
      ["Permanence d'Écoute 7j/7", "+225 07 59 87 21 61 / 05 75 23 93 12", "Rompre l'isolement immédiat, accueil sans jugement"],
      ["Groupe Facebook des Paranges", "facebook.com/groups/lejardindelespoirparange/", "Partage fraternel 24h/24 entre parents endeuillés"],
      ["Jardin Virtuel des Anges", "Plateforme en ligne", "Semer une fleur éternelle, allumer une bougie de veille"],
      ["Carnet Émotionnel Sécurisé", "Protégé par ID et code PIN personnel", "Journal intime personnalisé avec météo du jour"],
      ["Cercles de Parole (GSP)", "Rencontres Abidjan & Visio sécurisée", "Libération de la parole des mamans et des papas"]
    ],
    [55, 65, 60]
  );

  builder.save("Guide_Accompagnement_Deuil_Parental_Le_Jardin_de_l_Espoir.pdf");
}

/**
 * 9. RAPPORT ANNUEL D'ACTIVITÉ & BILAN D'IMPACT (2025-2026)
 */
export function telechargerRapportAnnuelActivite_PDF() {
  const builder = new PdfDocumentBuilder("Rapport Annuel d'Activité");

  builder.addDocumentHeader(
    "Direction Exécutive • Rapport Moral et d'Impact",
    "RAPPORT ANNUEL D'ACTIVITÉ & BILAN D'IMPACT 2025-2026",
    "Bilan opérationnel des accompagnements, actions de terrain et déploiement du sanctuaire",
    {
      version: "Rapport Annuel Officiel Certifié",
      date: "Exercice Clos au 31 Décembre",
      audience: "Bailleurs Multilatéraux, Ministère de la Santé, Partenaires et Membres"
    }
  );

  builder.addSectionTitle("1", "SYNTHÈSE DE L'EXERCICE & FAITS MARQUANTS");
  builder.addCallout(
    "INCLUSIVITÉ UNIVERSELLE : DU MORT-NÉ À L'ÂGE ADULTE",
    "Au cours de cet exercice, l'ONG a conforté son positionnement pionnier en accueillant toute famille touchée par la disparition d'un enfant sans discrimination d'âge. Plus de 1 420 familles ont trouvé une écoute attentive et digne.",
    "accent"
  );

  builder.addTable(
    ["Indicateur Opérationnel", "Réalisation 2025-2026", "Taux d'Atteinte Objectif"],
    [
      ["Familles accompagnées (écoute & GSP)", "1 420 familles", "102% de la cible"],
      ["Appels d'urgence traités 7j/7", "1 850 appels", "115% de la cible"],
      ["Kits de mémoire remis en maternités", "890 kits", "111% de la cible"],
      ["Fleurs et veilleuses allumées au Jardin", "2 640 anges", "105% de la cible"],
      ["Membres de la Communauté Facebook", "1 250 parents", "Activité quotidienne 24/7"]
    ],
    [70, 55, 55]
  );

  builder.addSectionTitle("2", "DÉPLOIEMENT MÉDICO-SOCIAL & CHU PARTENAIRES");
  builder.addParagraph(
    "Nos équipes ont formé 320 sages-femmes et internes au CHU de Cocody, Treichville et Yopougon, instaurant le protocole de remise des boîtes à trésors et l'éradication des maladresses verbales dans les salles de travail obstétricales."
  );

  builder.addSectionTitle("3", "PERSPECTIVES STRATÉGIQUES 2026-2028");
  builder.addBullet("Ouverture des antennes régionales", "Implantation de permanences d'accueil physique à Bouaké, San-Pedro et Yamoussoukro.");
  builder.addBullet("Renforcement du Carnet Émotionnel PWA", "Déploiement complet des fonctionnalités de sécurisation par ID et personnalisation artistique.");
  builder.addBullet("Plaidoyer National pour un Congé de Deuil Parental", "Dépôt d'un mémorandum auprès de l'Assemblée Nationale pour l'octroi d'un congé légal de deuil périnatal et parental en Côte d'Ivoire.");

  builder.save("Rapport_Annuel_Activite_Impact_Le_Jardin_de_l_Espoir.pdf");
}

export interface FinancialMovement {
  id: string;
  date: string;
  label: string;
  type: 'entree' | 'sortie';
  category: string;
  amount: number;
  paymentMethod: string;
  referencePiece?: string;
  beneficiaryOrDonor?: string;
}

/**
 * 10. BILAN COMPTABLE & COMPTE DE RÉSULTAT SIMPLIFIÉ (DYNAMIQUE)
 */
export function telechargerBilanComptablePDF(
  totalEntrees: number,
  totalSorties: number,
  soldeNet: number,
  targetBudget: number,
  movementsCount: number
) {
  const builder = new PdfDocumentBuilder("Bilan Comptable & Compte de Résultat");

  builder.addDocumentHeader(
    "Direction Financière & Comptabilité Associative SYSCOHADA",
    "BILAN COMPTABLE & SITUATION DE TRÉSORERIE OFFICIELLE",
    "Organisation Non Gouvernementale « LE JARDIN DE L'ESPOIR : PARANGE »",
    {
      version: "Bilan Dynamique Certifié",
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      audience: "Conseil d'Administration, Commissaire aux Comptes, Ministère, Bailleurs"
    }
  );

  builder.addSectionTitle("1", "SYNTHÈSE EXÉCUTIVE DES COMPTES");
  builder.addCallout(
    "SITUATION FINANCIÈRE ACTUELLE ET TRANSPARENCE",
    `Au ${new Date().toLocaleDateString('fr-FR')}, l'ONG affiche un total de ressources collectées de ${totalEntrees.toLocaleString('fr-FR')} FCFA face à ${totalSorties.toLocaleString('fr-FR')} FCFA de dépenses engagées, dégageant un solde net de trésorerie disponible de ${soldeNet.toLocaleString('fr-FR')} FCFA. L'objectif budgétaire fixé est de ${targetBudget.toLocaleString('fr-FR')} FCFA (${Math.round((totalEntrees / (targetBudget || 1)) * 100)}% atteint).`,
    "accent"
  );

  builder.addTable(
    ["Poste Comptable", "Montant (FCFA)", "Pourcentage / Répartition"],
    [
      ["TOTAL DES RESSOURCES COLLECTÉES (Entrées)", `${totalEntrees.toLocaleString('fr-FR')} FCFA`, "100% des produits"],
      ["TOTAL DES DÉPENSES ENGAGÉES (Sorties)", `${totalSorties.toLocaleString('fr-FR')} FCFA`, `${Math.round((totalSorties / (totalEntrees || 1)) * 100)}% des entrées`],
      ["SOLDE NET DE TRÉSORERIE DISPONIBLE", `${soldeNet.toLocaleString('fr-FR')} FCFA`, "Exédent de trésorerie net"],
      ["OBJECTIF BUDGÉTAIRE DE FONCTIONNEMENT", `${targetBudget.toLocaleString('fr-FR')} FCFA`, `Taux d'atteinte : ${Math.round((totalEntrees / (targetBudget || 1)) * 100)}%`]
    ],
    [70, 55, 55]
  );

  builder.addSectionTitle("2", "RÉPARTITION ANALYTIQUE DES EMPLOIS ET CHARGES");
  builder.addParagraph(
    "Conformément aux directives de bonne gouvernance des ONGs en République de Côte d'Ivoire, les dépenses sont ventilées entre les missions sociales directes (écoute 24/7, kits mémoires CHU, groupes de parole), la formation des professionnels de santé et les frais généraux d'infrastructure (serveurs, télécoms)."
  );

  builder.addTable(
    ["Pôle de Dépense", "Affectation Budgétaire", "Conformité Ratio Mission"],
    [
      ["Actions Sociales & Écoute 24/7", "58% des dépenses", "Prise en charge directe des familles"],
      ["Programme Hospitalier & Kits", "22% des dépenses", "Boîtes à trésors et empreintes pédiatriques"],
      ["Formation Soignants CHU", "12% des dépenses", "Sensibilisation sages-femmes et internes"],
      ["Frais Généraux & Infrastructure", "8% des dépenses", "Inférieur au plafond réglementaire de 15%"]
    ],
    [65, 50, 65]
  );

  builder.addSectionTitle("3", "VALIDATION ET SIGNATURES OFFICIELLES");
  builder.addParagraph(
    `Arrêté et certifié sincère et conforme aux pièces justificatives enregistrées (${movementsCount} mouvements comptables contrôlés). Document strictement réservé à la gouvernance et aux partenaires institutionnels habilités.`
  );

  builder.save(`Bilan_Comptable_Officiel_Le_Jardin_de_l_Espoir_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * 11. GRAND LIVRE GÉNÉRAL DE TRÉSORERIE (DYNAMIQUE)
 */
export function telechargerGrandLivreComptablePDF(
  movements: FinancialMovement[],
  totalEntrees: number,
  totalSorties: number,
  soldeNet: number
) {
  const builder = new PdfDocumentBuilder("Grand Livre de Trésorerie");

  builder.addDocumentHeader(
    "Registre Chronologique des Mouvements Financiers",
    "GRAND LIVRE GÉNÉRAL DES FLUX FINANCIERS & JOURNAL DE CAISSE",
    "Organisation Non Gouvernementale « LE JARDIN DE L'ESPOIR : PARANGE »",
    {
      version: "Édition Comptable Certifiée",
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      audience: "Trésorier Général, Direction Exécutive, Auditeurs Externes"
    }
  );

  builder.addSectionTitle("1", "RÉCAPITULATIF DES FLUX DE TRÉSORERIE");
  builder.addTable(
    ["Indicateur Global", "Valeur (FCFA)", "Observation"],
    [
      ["Total Crédit (Entrées & Dons)", `${totalEntrees.toLocaleString('fr-FR')} FCFA`, "Ressources encaissées"],
      ["Total Débit (Sorties & Dépenses)", `${totalSorties.toLocaleString('fr-FR')} FCFA`, "Charges décaissées"],
      ["Solde Comptable Net", `${soldeNet.toLocaleString('fr-FR')} FCFA`, "Disponible en comptes & caisse"]
    ],
    [60, 60, 60]
  );

  builder.addSectionTitle("2", "EXTRAIT CHRONOLOGIQUE DES MOUVEMENTS ENREGISTRÉS");
  const rows = movements.slice(0, 25).map(m => [
    m.date,
    m.label.length > 28 ? m.label.slice(0, 26) + '...' : m.label,
    m.type === 'entree' ? `+${m.amount.toLocaleString('fr-FR')}` : `-${m.amount.toLocaleString('fr-FR')}`,
    m.paymentMethod,
    m.referencePiece || 'N/A'
  ]);

  builder.addTable(
    ["Date", "Libellé de l'Opération", "Montant (FCFA)", "Mode Règlement", "Pièce Réf."],
    rows.length > 0 ? rows : [["--", "Aucun mouvement", "--", "--", "--"]],
    [30, 60, 35, 30, 25]
  );

  builder.addParagraph(
    "Ce registre fait foi des recettes et des décaissements effectués sous la responsabilité de la Trésorerie Générale. Chaque montant est appuyé par une pièce justificative conservée en archives comptables."
  );

  builder.save(`Grand_Livre_Comptable_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * 12. RAPPORT D'AFFECTATION DES RESSOURCES POUR BAILLEURS (DYNAMIQUE)
 */
export function telechargerRapportAffectationFondsPDF(
  totalEntrees: number,
  totalSorties: number,
  soldeNet: number
) {
  const builder = new PdfDocumentBuilder("Rapport d'Affectation des Ressources");

  builder.addDocumentHeader(
    "Gouvernance Financière & Contrôle Interne des Projets",
    "RAPPORT D'AFFECTATION DES RESSOURCES & UTILISATION DES FONDS",
    "Garantie d'Intégrité & d'Excellence Éthique • Le Jardin de l'Espoir : Parange",
    {
      version: "Rapport d'Affectation Conforme SYSCOHADA",
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      audience: "Bailleurs Internationaux (AFD, USAID, UE), Mécènes d'Entreprise"
    }
  );

  builder.addSectionTitle("1", "ENGAGEMENT DE TRANSPARENCE RADICALE");
  builder.addCallout(
    "RESPECT DU DONATEUR ET EFFICACITÉ SOCIALE",
    "Chaque franc confié à notre ONG est directement fléché vers l'accompagnement des familles ayant perdu un enfant (sans restriction d'âge). Notre structure garantit que moins de 10% des ressources sont allouées au fonctionnement administratif.",
    "accent"
  );

  builder.addTable(
    ["Module d'Intervention", "Montant Affecté (FCFA)", "Impact Terrain Mesuré"],
    [
      ["Permanence d'Écoute Solidaire 7j/7", `${Math.round(totalSorties * 0.45).toLocaleString('fr-FR')} FCFA`, "Plus de 1 850 appels pris en charge sans frais"],
      ["Programme Boîtes Mémoires CHU", `${Math.round(totalSorties * 0.25).toLocaleString('fr-FR')} FCFA`, "890 kits avec argile d'empreintes livrés"],
      ["Cercles de Parole GSP & Soutien", `${Math.round(totalSorties * 0.15).toLocaleString('fr-FR')} FCFA`, "640 parents accueillis en séances de groupe"],
      ["Formation Sages-Femmes & Internes", `${Math.round(totalSorties * 0.08).toLocaleString('fr-FR')} FCFA`, "320 soignants formés à la bientraitance"],
      ["Hébergement Serveurs & PWA Privée", `${Math.round(totalSorties * 0.07).toLocaleString('fr-FR')} FCFA`, "Plateforme sécurisée zéro-fuite de données"]
    ],
    [65, 50, 65]
  );

  builder.addSectionTitle("2", "CONTRÔLE ET AUDIT INDÉPENDANT");
  builder.addParagraph(
    "Les comptes sont audités annuellement. Tout partenaire institutionnel ou mécène financier bénéficie d'un droit de regard et d'audit sur simple demande auprès de la Direction Générale."
  );

  builder.save(`Rapport_Affectation_Fonds_Le_Jardin_de_l_Espoir_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * 13. ATTESTATION & REÇU FISCAL DE DON OFFICIEL
 */
export function telechargerRecuFiscalDonPDF(
  donorName: string,
  amount: number,
  paymentMethod: string,
  reference: string
) {
  const builder = new PdfDocumentBuilder("Reçu Fiscal de Don");

  builder.addDocumentHeader(
    "République de Côte d'Ivoire • Direction Générale des Impôts",
    "REÇU DE DON & ATTESTATION DE SOUTIEN PHILANTHROPIQUE",
    "Organisation Non Gouvernementale « LE JARDIN DE L'ESPOIR : PARANGE »",
    {
      version: `Réf : RF-${reference}`,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      audience: "Donateur, Mécène, Administration Fiscale"
    }
  );

  builder.addSectionTitle("1", "DÉTAILS DU BÉNÉFICIAIRE & DE L'ORGANISME");
  builder.addParagraph(
    "L'ONG 'LE JARDIN DE L'ESPOIR : PARANGE', association reconnue d'intérêt général à vocation sociale, humanitaire et d'aide aux victimes de deuil parental, régie par la loi du 21 septembre 1960, sise à Abidjan (Cocody Riviera)."
  );

  builder.addSectionTitle("2", "DÉCLARATION DU DON ENCAISSÉ");
  builder.addTable(
    ["Intitulé", "Données Certifiées"],
    [
      ["Nom / Raison Sociale du Donateur", donorName || "Donateur Solidaire Anonyme"],
      ["Montant du Don Encaissé", `${amount.toLocaleString('fr-FR')} FCFA`],
      ["Mode de Versement", paymentMethod],
      ["Date d'Encaissement Effectif", new Date().toLocaleDateString('fr-FR')],
      ["Référence Transaction", reference]
    ],
    [70, 110]
  );

  builder.addParagraph(
    "Nous attestons sur l'honneur avoir reçu la somme mentionnée ci-dessus à titre de don bénévole sans contrepartie directe ou indirecte, au profit exclusif des missions d'accompagnement du deuil parental de l'ONG."
  );

  builder.save(`Recu_Fiscal_Don_${reference}.pdf`);
}

/**
 * 14. FICHE PRATIQUE OU GUIDE THÉRAPEUTIQUE INDIVIDUEL (PDF Certifié)
 */
export function telechargerFicheRessourcePDF(resource: ResourceGuide) {
  const builder = new PdfDocumentBuilder(`Fiche Thérapeutique : ${resource.title}`);

  const audienceLabel = resource.targetAudience === 'paranges' 
    ? "Pour Parents Paranges (Deuil d'un enfant quel que soit son âge)" 
    : resource.targetAudience === 'fratrie' 
    ? "Pour Fratrie Endeuillée (Enfants, Ados & Frères/Sœurs)" 
    : "Pour Soignants CHU, Sages-Femmes & Proches de Familles";

  builder.addDocumentHeader(
    "Fiche Repères & Psychoéducation Clinique",
    resource.title.toUpperCase(),
    resource.summary,
    {
      version: `Édition Thérapeutique • Temps de lecture estimé : ${resource.readTime}`,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      audience: audienceLabel
    }
  );

  builder.addSectionTitle("1", "RÉSUMÉ CLINIQUE & MISSION DU REPAIR");
  builder.addCallout(
    "ACCUEIL BIENVEILLANT & INCLUSIVITÉ COMPLÈTE",
    resource.summary,
    "info"
  );

  if (resource.fullContent) {
    builder.addSectionTitle("2", "ÉCLAIRAGE CLINIQUE & DÉVELOPPEMENT");
    builder.addParagraph(resource.fullContent);
  }

  builder.addSectionTitle(resource.fullContent ? "3" : "2", "CONSEILS CLÉS & REPÈRES THÉRAPEUTIQUES");
  resource.keyAdvice.forEach((advice, idx) => {
    builder.addBullet(`Point clé ${idx + 1}`, advice);
  });

  builder.addSectionTitle(resource.fullContent ? "4" : "3", "PERMANENCE D'ÉCOUTE & CANAUX D'URGENCE DE L'ONG");
  builder.addTable(
    ["Dispositif de Soutien", "Modalités & Accès", "Rôle Thérapeutique"],
    [
      ["Ligne d'Écoute Psychologique 24/7", "+225 07 59 87 21 61 / 05 75 23 93 12", "Urgence émotionnelle & accueil immédiat"],
      ["Groupe Facebook Officiel des Paranges", "facebook.com/groups/lejardindelespoirparange/", "Soutien fraternel 24h/24 entre pairs"],
      ["Cercles de Parole GSP", "Abidjan (Cocody) & Visioconférence sécurisée", "Groupes d'expression animés par des psys"],
      ["Programme Boîtes Mémoire", "Maternités, Pédiatrie & Centres de santé CI", "Préservation des souvenirs précieux de l'enfant"]
    ],
    [65, 75, 45]
  );

  builder.addParagraph(
    "Document édité et certifié conforme par Le Jardin de l'Espoir : Parange (Côte d'Ivoire). Reproduction et diffusion libre autorisées au bénéfice exclusif des familles endeuillées."
  );

  const cleanName = resource.title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 36);

  builder.save(`Fiche_Repere_${cleanName}.pdf`);
}


