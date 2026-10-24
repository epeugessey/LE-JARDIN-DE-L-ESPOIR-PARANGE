import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  LogIn, 
  KeyRound, 
  UserCheck 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const { isEn } = useLanguage();

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const cleanId = loginId.trim().toLowerCase();
    const cleanPass = password.trim();

    setTimeout(() => {
      // Expected: ID = "jardindelarenaissance" (or legacy "jardindelespoir"), MP = "ELVIVICTO"
      if ((cleanId === 'jardindelarenaissance' || cleanId === 'jardindelespoir') && cleanPass === 'ELVIVICTO') {
        sessionStorage.setItem('jde_admin_show_alert_bubble', 'true');
        if (rememberSession) {
          sessionStorage.setItem('jde_admin_auth', 'true');
          localStorage.setItem('jde_admin_session_auth', 'true');
        } else {
          sessionStorage.setItem('jde_admin_auth', 'true');
        }
        setIsLoading(false);
        setErrorMsg(null);
        setLoginId('');
        setPassword('');
        onLoginSuccess();
        onClose();
      } else {
        setIsLoading(false);
        setErrorMsg(
          isEn 
            ? 'Invalid identifier or password. Access is restricted to authorized NGO administrators.'
            : 'Identifiant ou mot de passe incorrect. Accès strictement réservé à la direction de l\'ONG.'
        );
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 text-white bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
              <Lock className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Accès Sécurisé</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-white tracking-tight">
                Espace Administration
              </h3>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <div className="p-6 sm:p-7 space-y-5">
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              <span>Authentification requise</span>
            </p>
            <p className="text-[11px] text-amber-800">
              Veuillez saisir les identifiants officiels de l'ONG Le Jardin de l'Espoir : Parange Côte d'Ivoire pour accéder au panneau de gestion.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-in shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Identifiant (ID)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="Ex: jardindelespoir"
                  autoComplete="username"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-sm text-stone-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition-all"
                />
                <UserCheck className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Mot de passe (MP)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-sm text-stone-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 p-0.5 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                />
                <span>Mémoriser la session</span>
              </label>
              <span className="text-[11px] text-stone-400 italic">Protection 256-bit</span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Vérification des accès...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-amber-400" />
                    <span>Déverrouiller l'Espace Admin</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
