import React, { useState } from 'react';
import { Heart, ShieldCheck, CheckCircle2, Sparkles, Phone, Smartphone, CreditCard, HelpCircle, Download } from 'lucide-react';
import { BUDGET_ITEMS } from '../data/mockData';
import { PlatformConfig, DonationRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  telechargerDossierMentoratONGInternationalePDF, 
  downloadInternationalNGOMentorshipPitchPDF_EN,
  telechargerRecuFiscalDonPDF
} from '../utils/pdfGenerator';

interface DonationViewProps {
  platformConfig?: PlatformConfig;
  onAddDonation?: (donation: DonationRecord) => void;
}

export const DonationView: React.FC<DonationViewProps> = ({ platformConfig, onAddDonation }) => {
  const { isEn } = useLanguage();
  const phone1 = platformConfig?.phonePrimary || '07 59 87 21 61';
  const phone2 = platformConfig?.phoneSecondary || '05 75 23 93 12';
  const [currency, setCurrency] = useState<'FCFA' | 'EUR'>('FCFA');
  const [selectedAmount, setSelectedAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange' | 'mtn' | 'card'>('wave');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const amount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleSelectPredefined = (val: number) => {
    setSelectedAmount(val);
    setCustomAmount('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    const newDonation: DonationRecord = {
      id: `don-${Date.now()}`,
      donorName: donorName.trim() || (isEn ? 'Anonymous Benefactor' : 'Bienfaiteur(trice) Anonyme'),
      donorPhone: donorPhone.trim() || 'Non renseigné',
      donorEmail: donorEmail.trim() || 'Non renseigné',
      donorCity: "Côte d'Ivoire / Diaspora",
      amount: amount,
      currency: currency,
      paymentMethod: paymentMethod,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      purpose: 'Parrainage solidaire d\'un parent endeuillé (Séances psy & Kits)',
      status: 'confirme',
      message: 'Don enregistré sur la plateforme'
    };

    if (onAddDonation) {
      onAddDonation(newDonation);
    }

    try {
      const saved = localStorage.getItem('jde_donations_records');
      const list = saved ? JSON.parse(saved) : [];
      localStorage.setItem('jde_donations_records', JSON.stringify([newDonation, ...list]));
    } catch (err) {
      console.warn('Could not save donation to localStorage', err);
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
            <span>{isEn ? 'Solidarity Campaign • Côte d\'Ivoire & Diaspora' : 'Campagne de Solidarité • Côte d\'Ivoire & Diaspora'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-stone-900 font-serif-accent tracking-tight">
            {isEn ? 'Sponsor a Grieving Parent' : 'Parrainez un Parange'}
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            {isEn
              ? 'In Côte d\'Ivoire, private psychotherapy sessions cost between 15,000 and 30,000 FCFA, an inaccessible luxury for a parent devastated by grief. Your donation funds free psychological sessions and mobile outreach clinics.'
              : 'En Côte d\'Ivoire, une thérapie privée coûte 15 000 à 30 000 FCFA la séance, un luxe inaccessible pour une mère ou un père terrassé par le deuil. Votre don offre des séances gratuites et finance nos consultations mobiles solidaires.'}
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-xl text-center max-w-2xl mx-auto space-y-5 animate-in fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-accent">
              {isEn 
                ? `Thank you from the bottom of our hearts, ${donorName || 'dear benefactor'}!`
                : `Infiniment merci, ${donorName || 'cher(e) bienfaiteur(trice)'} !`}
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {isEn
                ? <>Your sponsorship of <strong>{amount.toLocaleString('fr-FR')} {currency}</strong> via {paymentMethod.toUpperCase()} brings immediate comfort and a caring presence to a grieving parent in Côte d'Ivoire.</>
                : <>Votre parrainage de <strong>{amount.toLocaleString('fr-FR')} {currency}</strong> via {paymentMethod.toUpperCase()} offre un souffle de réconfort et une présence chaleureuse à un parent ivoirien éprouvé.</>}
            </p>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 text-left space-y-2">
              <div className="font-bold text-stone-900">
                {isEn ? 'Instructions to complete your transfer:' : 'Instructions pour valider le transfert :'}
              </div>
              {paymentMethod === 'wave' && (
                <p>
                  {isEn 
                    ? <>Open your <strong>Wave</strong> app and confirm payment to Le Jardin de l'Espoir : Parange CI merchant account at <strong>+225 07 89 20 40 50</strong>.</>
                    : <>Ouvrez votre application <strong>Wave</strong> et confirmez le paiement vers le compte marchand Le Jardin de l'Espoir : Parange CI au <strong>+225 07 89 20 40 50</strong>.</>}
                </p>
              )}
              {paymentMethod === 'orange' && (
                <p>
                  {isEn
                    ? <>Dial <strong>#144*62#</strong> or use Orange Money to the official NGO number: <strong>07 89 20 40 50</strong>.</>
                    : <>Composez <strong>#144*62#</strong> ou utilisez Orange Money vers le numéro officiel ONG : <strong>07 89 20 40 50</strong>.</>}
                </p>
              )}
              {paymentMethod === 'mtn' && (
                <p>
                  {isEn
                    ? <>Dial <strong>*133#</strong> or use MoMo to the official NGO number: <strong>05 89 20 40 50</strong>.</>
                    : <>Composez <strong>*133#</strong> ou utilisez MoMo vers le numéro officiel ONG : <strong>05 89 20 40 50</strong>.</>}
                </p>
              )}
              {paymentMethod === 'card' && (
                <p>
                  {isEn
                    ? <>A secure receipt and confirmation link has been sent to <strong>{donorEmail || 'your email'}</strong>.</>
                    : <>Un reçu et lien de confirmation sécurisé Stripe/Virement vous a été adressé à <strong>{donorEmail || 'votre email'}</strong>.</>}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const ref = `DON-${Date.now().toString().slice(-6)}`;
                  telechargerRecuFiscalDonPDF(
                    donorName || (isEn ? 'Anonymous Benefactor' : 'Bienfaiteur(trice) Anonyme'),
                    amount,
                    paymentMethod.toUpperCase(),
                    ref
                  );
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isEn ? 'Download Certified Tax Receipt (PDF)' : 'Télécharger mon Reçu Fiscal Officiel (PDF Certifié)'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                {isEn ? 'Make another donation' : 'Faire un autre don'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Donation Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Currency switch */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                    {isEn ? 'Currency:' : 'Devise :'}
                  </span>
                  <div className="flex p-1 rounded-xl bg-stone-100 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => { setCurrency('FCFA'); setSelectedAmount(10000); }}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        currency === 'FCFA' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600'
                      }`}
                    >
                      FCFA (XOF)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCurrency('EUR'); setSelectedAmount(25); }}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        currency === 'EUR' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600'
                      }`}
                    >
                      Euros (€ - Diaspora)
                    </button>
                  </div>
                </div>

                {/* Amount presets */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    {isEn ? 'Select your sponsorship amount:' : 'Montant de votre parrainage solidaire :'}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {currency === 'FCFA' ? (
                      [
                        { val: 5000, desc: isEn ? '1 support session' : '1 séance de soutien' },
                        { val: 10000, desc: isEn ? 'Refreshment & support group' : 'Collation & accueil GSP' },
                        { val: 25000, desc: isEn ? 'Full cycle for a Parange' : 'Cycle complet Parange' },
                        { val: 50000, desc: isEn ? 'Mobile community day' : 'Journée mobile quartier' }
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.val}
                          onClick={() => handleSelectPredefined(item.val)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            selectedAmount === item.val && !customAmount
                              ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                              : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                          }`}
                        >
                          <div className="text-sm font-bold">{item.val.toLocaleString('fr-FR')} FCFA</div>
                          <div className="text-[11px] text-stone-500 font-normal">{item.desc}</div>
                        </button>
                      ))
                    ) : (
                      [
                        { val: 10, desc: '~6 500 FCFA' },
                        { val: 25, desc: '~16 000 FCFA' },
                        { val: 50, desc: '~33 000 FCFA' },
                        { val: 100, desc: '~65 000 FCFA' }
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.val}
                          onClick={() => handleSelectPredefined(item.val)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            selectedAmount === item.val && !customAmount
                              ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                              : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                          }`}
                        >
                          <div className="text-sm font-bold">{item.val} €</div>
                          <div className="text-[11px] text-stone-500 font-normal">{item.desc}</div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Custom Amount */}
                  <div className="mt-3">
                    <input
                      type="number"
                      min="500"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder={isEn ? `Other custom amount (${currency})...` : `Autre montant libre (${currency})...`}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    {isEn ? 'Secure payment method:' : 'Mode de paiement sécurisé :'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'wave', label: 'Wave', icon: Smartphone, color: 'text-sky-600' },
                      { id: 'orange', label: 'Orange Money', icon: Smartphone, color: 'text-orange-600' },
                      { id: 'mtn', label: 'MTN MoMo', icon: Smartphone, color: 'text-yellow-600' },
                      { id: 'card', label: isEn ? 'Card / Wire' : 'Carte / Virement', icon: CreditCard, color: 'text-emerald-700' }
                    ].map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          type="button"
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            paymentMethod === m.id
                              ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                              : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${m.color}`} />
                          <span className="text-[11px]">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Donor details */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {isEn ? 'Your full name *' : 'Votre prénom et nom *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder={isEn ? "E.g.: Awa Diallo" : "Ex: Awa Diallo"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        {isEn ? 'Mobile Money Phone Number (+225) *' : 'Numéro Mobile Money (+225) *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        placeholder="Ex: 07 00 11 22 33"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        {isEn ? 'Email address (for tax receipt)' : 'Adresse courriel (pour reçu)'}
                      </label>
                      <input
                        type="email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white/20" />
                  <span>
                    {isEn 
                      ? `Confirm my donation of ${amount.toLocaleString('fr-FR')} ${currency}`
                      : `Valider mon don de ${amount.toLocaleString('fr-FR')} ${currency}`}
                  </span>
                </button>
              </form>
            </div>

            {/* Transparency & Budget info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? 'Transparency & Rigorous Governance' : 'Transparence & Rigueur Financière'}</span>
                </div>
                <h3 className="text-xl font-bold font-serif-accent">
                  {isEn ? 'Projected Solidarity Budget: 17,980,000 FCFA' : 'Budget Prévisionnel Solidaire : 17 980 000 FCFA'}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {isEn
                    ? 'Le Jardin de l\'Espoir : Parange commits to publishing annual audited accounts. Every contribution directly serves grieving parents and children across Côte d\'Ivoire.'
                    : 'Le Jardin de l\'Espoir : Parange s\'engage à publier ses comptes annuels audités. Chaque centime sert directement la cause des parents et des enfants.'}
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  {BUDGET_ITEMS.map((item, idx) => (
                    <div key={idx} className="border-b border-stone-800 pb-2">
                      <div className="flex justify-between font-medium">
                        <span className="text-stone-300">{item.label}</span>
                        <span className="font-mono text-emerald-400 font-bold">{item.percentage}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        {item.amountFCFA.toLocaleString('fr-FR')} FCFA
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-stone-400 italic">
                  {isEn 
                    ? '* Funded by memberships, individual donations, and institutional partners.'
                    : '* Financement assuré par les cotisations, les dons de particuliers et les partenaires institutionnels.'}
                </div>
              </div>

              {/* Direct bank / contact */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 text-xs text-stone-600 space-y-3">
                <h4 className="font-bold text-stone-900 text-sm">
                  {isEn ? 'Are you an enterprise or philanthropic foundation?' : 'Vous êtes une entreprise ou une fondation ?'}
                </h4>
                <p>
                  {isEn
                    ? 'To set up an institutional CSR partnership or sponsor medical & psychological equipment for our mobile outreach vans:'
                    : 'Pour mettre en place un partenariat de mécénat institutionnel ou financer l\'équipement de nos consultations mobiles :'}
                </p>
                <div className="font-medium text-stone-900">
                  {isEn ? 'Email: ' : 'Courriel : '}<strong>partenariats@lejardindelespoir-ci.org</strong>
                </div>
                <div className="font-medium text-stone-900">
                  {isEn ? 'Direct Solidarity Line: ' : 'Ligne Direction & Solidarité : '}<strong>+225 {phone1} / {phone2}</strong>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isEn) {
                        downloadInternationalNGOMentorshipPitchPDF_EN();
                      } else {
                        telechargerDossierMentoratONGInternationalePDF();
                      }
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-stone-950" />
                    <span>{isEn ? 'Download Mentorship & Partnership Proposal (PDF)' : 'Télécharger le Dossier de Présentation & Mentorat (PDF)'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
