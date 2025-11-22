
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { translations, Language } from '../utils/i18n';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, ArrowRight, AlertCircle, CheckCircle2, Database, Globe } from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const D3Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
     {/* Blue Depth (Left/Bottom) */}
     <path d="M20 25 V 75 C 20 90 35 95 60 95 H 75 L 65 85 H 50 C 40 85 30 80 30 65 V 35 L 20 25 Z" fill="#0044cc" />
     
     {/* Pink Depth (Top/Right) */}
     <path d="M20 25 H 75 C 90 25 95 35 95 60 V 85 L 85 75 V 60 C 85 45 80 35 65 35 H 30 L 20 25 Z" fill="#ec4899" />

     {/* Main Face (White) */}
     <path d="M25 30 H 70 C 82 30 85 38 85 60 V 80 L 60 80 C 45 80 30 80 30 65 V 30 L 25 30 Z" fill="white" />

     {/* Holes */}
     <circle cx="45" cy="65" r="10" fill="#0044cc" />
     <circle cx="70" cy="50" r="10" fill="#ec4899" />
  </svg>
);

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Language Toggle for Auth Page
  const [lang, setLang] = useState<Language>('en');

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);

  const t = (key: keyof typeof translations.en) => {
    return translations[lang][key] || translations['en'][key];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const user = await authService.login(email, password);
        // If user has language preference, it will apply after login in App.tsx
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => onLogin(user), 1000);
      } else {
        // Validations
        if (password !== confirmPassword) throw new Error("Passwords do not match");
        if (password.length < 6) throw new Error("Password must be at least 6 characters");
        
        const user = await authService.signup(name, email, password, role);
        // Auto-set preference to current selected lang
        user.preferences = { ...user.preferences!, language: lang };
        await authService.updateUser(user);

        setSuccess('Account created successfully!');
        setTimeout(() => onLogin(user), 1000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={() => setLang(l => l === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full text-gray-300 hover:text-white border border-gray-700"
          >
              <Globe size={16} /> {lang === 'en' ? 'தமிழ்' : 'English'}
          </button>
      </div>

      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="p-8 pb-0 text-center">
           <div className="inline-block mb-4 drop-shadow-xl">
              <D3Logo className="w-20 h-20" />
           </div>
           <h2 className="text-3xl font-bold text-white mb-2">
              <span className="text-pink-500">D</span><span className="text-blue-600">3</span>xplore
           </h2>
           <p className="text-gray-400 text-sm">
             {isLogin ? t('login_title') : t('signup_title')}
           </p>
        </div>

        {/* Tabs */}
        <div className="flex p-2 mx-8 mt-6 bg-gray-900/50 rounded-lg">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            {t('login_btn')}
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            {t('signup_btn')}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-shake">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={16} /> {success}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-medium ml-1">{t('full_name')}</label>
              <div className="relative">
                <UserIcon size={18} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium ml-1">
              {isLogin ? t('email') : t('email')}
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder={t('email_placeholder')}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium ml-1">{t('password')}</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-3 pl-10 pr-10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500 hover:text-white">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium ml-1">{t('confirm_password')}</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                    required={!isLogin}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium ml-1">{t('role_label')}</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                >
                  <option value="student">{t('role_student')}</option>
                  <option value="trainer">{t('role_trainer')}</option>
                </select>
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-600/30 transform transition active:scale-95 flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
               <>
                 {isLogin ? t('login_btn') : t('create_account')} <ArrowRight size={18} />
               </>
            )}
          </button>

          {isLogin && (
             <div className="text-center mt-4">
                 <a href="#" className="text-xs text-gray-400 hover:text-blue-400">{t('forgot_password')}</a>
             </div>
          )}
        </form>
      </div>
      
      {/* Footer Info */}
      <div className="absolute bottom-4 text-center w-full text-xs text-gray-500 flex flex-col items-center gap-2">
        <p>{t('demo_access')} <span className="font-mono text-gray-400">dsaid</span> / <span className="font-mono text-gray-400">dsapass</span></p>
      </div>
    </div>
  );
};

export default AuthPage;
