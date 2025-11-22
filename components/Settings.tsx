
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { translations, Language } from '../utils/i18n';
import { 
  User as UserIcon, Settings as SettingsIcon, Shield, Bell, Smartphone, 
  LogOut, Trash2, Moon, Sun, Globe, Type, Save, Camera, Download, Database, Monitor,
  HelpCircle, Info, Rocket, Map as MapIcon, MessageCircle, Heart, AlertTriangle, ChevronDown
} from 'lucide-react';

interface SettingsProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  currentLang: Language;
  theme: 'light' | 'dark';
}

type SettingsTab = 'profile' | 'preferences' | 'security' | 'admin' | 'about';

const Settings: React.FC<SettingsProps> = ({ currentUser, onUpdateUser, onLogout, currentLang, theme }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Local state for form editing
  const [formData, setFormData] = useState<User>(currentUser);
  
  // Admin Data
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const t = (key: keyof typeof translations.en) => {
      return translations[currentLang][key] || translations['en'][key];
  };

  useEffect(() => {
    setFormData(currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'admin' && (currentUser.role === 'admin' || currentUser.role === 'trainer')) {
        loadUsers();
    }
  }, [activeTab, currentUser.role]);

  const loadUsers = async () => {
      const users = await authService.getAllUsers();
      setAllUsers(users);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
        const updated = await authService.updateUser(formData);
        onUpdateUser(updated);
        setSuccessMsg(t('save_changes') + ' success!');
        setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
      if (window.confirm(t('delete_warning'))) {
          authService.deleteUser(currentUser.id);
          onLogout();
      }
  };

  const handleAdminDeleteUser = async (id: string) => {
      if (window.confirm("Admin: Delete this user?")) {
          await authService.deleteUser(id);
          loadUsers();
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const headingColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textMuted = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const cardBg = theme === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-gray-800 border-gray-700 text-white';
  const inputBg = theme === 'light' ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-700 text-white';

  const renderProfile = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-6">
            <div className="relative group">
                <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${theme === 'light' ? 'bg-gray-200 border-gray-300' : 'bg-gray-700 border-gray-600'}`}>
                    {formData.avatarUrl ? (
                        <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center ${textMuted}`}>
                            <UserIcon size={40} />
                        </div>
                    )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500 transition shadow-lg">
                    <Camera size={16} className="text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
            </div>
            <div>
                <h3 className={`text-xl font-bold ${headingColor}`}>{currentUser.name}</h3>
                <p className={`text-sm ${textMuted}`}>{currentUser.role.toUpperCase()}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className={`block text-sm font-medium mb-1 ${textMuted}`}>{t('full_name')}</label>
                <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none border ${inputBg}`}
                />
            </div>
            <div>
                <label className={`block text-sm font-medium mb-1 ${textMuted}`}>{t('email')}</label>
                <input 
                    type="email" 
                    value={formData.email} 
                    disabled
                    className={`w-full rounded-lg p-3 cursor-not-allowed border opacity-70 ${inputBg}`}
                />
            </div>
        </div>
    </div>
  );

  const renderPreferences = () => (
      <div className="space-y-8 animate-fade-in">
          {/* Theme */}
          <div>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${headingColor}`}><Moon size={20} /> {t('appearance')}</h3>
              <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => setFormData({...formData, preferences: {...formData.preferences!, theme: 'dark'}})}
                    className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition ${formData.preferences?.theme === 'dark' ? 'border-blue-500 bg-blue-500/10 text-blue-500' : theme === 'light' ? 'border-gray-200 text-gray-600' : 'border-gray-700 bg-gray-800 text-gray-400'}`}
                  >
                      <Moon size={20} /> {t('dark_mode')}
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, preferences: {...formData.preferences!, theme: 'light'}})}
                    className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition ${formData.preferences?.theme === 'light' ? 'border-blue-500 bg-blue-500/10 text-blue-500' : theme === 'light' ? 'border-gray-200 text-gray-600' : 'border-gray-700 bg-gray-800 text-gray-400'}`}
                  >
                      <Sun size={20} /> {t('light_mode')}
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, preferences: {...formData.preferences!, theme: 'system'}})}
                    className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition ${formData.preferences?.theme === 'system' ? 'border-blue-500 bg-blue-500/10 text-blue-500' : theme === 'light' ? 'border-gray-200 text-gray-600' : 'border-gray-700 bg-gray-800 text-gray-400'}`}
                  >
                      <Monitor size={20} /> {t('system_mode')}
                  </button>
              </div>
          </div>

          {/* Language */}
          <div>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${headingColor}`}><Globe size={20} /> {t('language')}</h3>
              <select 
                value={formData.preferences?.language}
                onChange={(e) => setFormData({...formData, preferences: {...formData.preferences!, language: e.target.value as 'en'|'ta'}})}
                className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${inputBg}`}
              >
                  <option value="en">English (Default)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
              </select>
          </div>

           {/* Text Size */}
           <div>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${headingColor}`}><Type size={20} /> {t('accessibility')}</h3>
              <div className={`flex items-center justify-between p-4 rounded-xl border ${cardBg}`}>
                  <span className={`text-xs ${textMuted}`}>{t('small')}</span>
                  <input 
                    type="range" 
                    min="0" max="2" step="1"
                    value={formData.preferences?.textSize === 'small' ? 0 : formData.preferences?.textSize === 'large' ? 2 : 1}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        const size = val === 0 ? 'small' : val === 2 ? 'large' : 'medium';
                        setFormData({...formData, preferences: {...formData.preferences!, textSize: size}});
                    }}
                    className="w-2/3 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className={`text-xl font-bold ${headingColor}`}>{t('large')}</span>
              </div>
          </div>
      </div>
  );

  const renderSecurity = () => (
      <div className="space-y-8 animate-fade-in">
          {/* Login History */}
          <div>
             <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${headingColor}`}><Shield size={20} /> {t('login_history')}</h3>
             <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
                 <table className="w-full text-sm text-left">
                     <thead className={`text-xs uppercase ${theme === 'light' ? 'bg-gray-100 text-gray-500' : 'bg-gray-900/50 text-gray-400'}`}>
                         <tr>
                             <th className="px-6 py-3">{t('device_ip')}</th>
                             <th className="px-6 py-3">{t('date_time')}</th>
                         </tr>
                     </thead>
                     <tbody className={textMuted}>
                         {formData.loginHistory && formData.loginHistory.length > 0 ? (
                             formData.loginHistory.map((entry) => (
                                 <tr key={entry.id} className={`border-b ${theme === 'light' ? 'border-gray-200 hover:bg-gray-50' : 'border-gray-700 hover:bg-gray-700/50'}`}>
                                     <td className={`px-6 py-4 font-medium ${headingColor}`}>
                                         <div className="flex items-center gap-2">
                                             <Smartphone size={16} /> {entry.ip}
                                         </div>
                                     </td>
                                     <td className="px-6 py-4">
                                         {new Date(entry.timestamp).toLocaleString()}
                                     </td>
                                 </tr>
                             ))
                         ) : (
                             <tr><td colSpan={2} className="p-4 text-center">No history available</td></tr>
                         )}
                     </tbody>
                 </table>
             </div>
          </div>
          
          {/* Danger Zone */}
          <div className={`border rounded-xl p-6 ${theme === 'light' ? 'bg-red-50 border-red-200' : 'bg-red-900/10 border-red-900/50'}`}>
              <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2"><Trash2 size={20} /> {t('danger_zone')}</h3>
              <p className={`text-sm mb-4 ${theme === 'light' ? 'text-red-600' : 'text-gray-400'}`}>{t('delete_warning')}</p>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-bold"
              >
                  {t('delete_account')}
              </button>
          </div>
      </div>
  );

  const renderAdmin = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className={`text-lg font-bold flex items-center gap-2 ${headingColor}`}><Database size={20} /> {t('user_management')}</h3>
            <button onClick={() => authService.downloadDB()} className="text-blue-400 text-sm hover:underline flex items-center gap-1">
                <Download size={14}/> {t('export_db')}
            </button>
          </div>
          
          <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
                 <table className="w-full text-sm text-left">
                     <thead className={`text-xs uppercase ${theme === 'light' ? 'bg-gray-100 text-gray-500' : 'bg-gray-900/50 text-gray-400'}`}>
                         <tr>
                             <th className="px-6 py-3">User</th>
                             <th className="px-6 py-3">Role</th>
                             <th className="px-6 py-3">Joined</th>
                             <th className="px-6 py-3 text-right">Actions</th>
                         </tr>
                     </thead>
                     <tbody className={textMuted}>
                         {allUsers.map((u) => (
                             <tr key={u.id} className={`border-b ${theme === 'light' ? 'border-gray-200 hover:bg-gray-50' : 'border-gray-700 hover:bg-gray-700/50'}`}>
                                 <td className="px-6 py-4">
                                     <div className={`font-bold ${headingColor}`}>{u.name}</div>
                                     <div className="text-xs">{u.email}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' || u.role === 'trainer' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
                                         {u.role}
                                     </span>
                                 </td>
                                 <td className="px-6 py-4">
                                     {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                     <button 
                                        onClick={() => handleAdminDeleteUser(u.id)}
                                        disabled={u.role === 'admin'} 
                                        className={`p-2 rounded-lg transition ${u.role === 'admin' ? 'text-gray-400 cursor-not-allowed' : 'text-red-400 hover:bg-red-900/30'}`}
                                     >
                                         <Trash2 size={16} />
                                     </button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
          </div>
      </div>
  );

  const renderAbout = () => (
    <div className="space-y-8 animate-fade-in">
        {/* Brand Hero */}
        <div className={`text-center p-8 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-b from-blue-50 to-white border border-blue-100' : 'bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700'}`}>
             <div className="inline-block p-4 bg-white rounded-2xl shadow-lg mb-4">
                 <span className="text-4xl font-bold tracking-tight text-black">
                    <span className="text-pink-500">D</span><span className="text-blue-600">3</span>xplore
                 </span>
             </div>
             <h2 className={`text-2xl font-bold mb-2 ${headingColor}`}>D3xplore Learning Platform</h2>
             <p className={`max-w-2xl mx-auto ${textMuted}`}>
                Start your journey to becoming a DSA Champion with interactive 3D visualizations, step-by-step concept breakdowns, and personalized learning paths.
                Upgrade your problem-solving mindset, sharpen your logic, and crack top tech interviews with confidence.
             </p>
        </div>

        {/* What is D3xplore */}
        <div>
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${headingColor}`}><Info className="text-blue-500"/> What is D3xplore?</h3>
            <div className={`p-6 rounded-xl border ${cardBg}`}>
                <p className="leading-relaxed">
                    A next-generation learning platform designed to make Data Structures & Algorithms simple, visual, interactive, and enjoyable.
                    Instead of reading long theory, learners can see algorithms in motion and understand how they work line by line.
                </p>
            </div>
        </div>

        {/* FAQs */}
        <div>
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${headingColor}`}><HelpCircle className="text-green-500"/> Frequently Asked Questions</h3>
            <div className="space-y-3">
                {[
                    { q: "How do I use the Visualizer?", a: "Select an algorithm from the Dashboard or Sidebar. You can use the controls to play, pause, and step through animations. You can also input custom data in the sidebar." },
                    { q: "Can I save my progress?", a: "Yes, your progress, notes, and settings are automatically saved to your local database." },
                    { q: "Is there a mobile app?", a: "The mobile app is currently in development (Phase 2 Roadmap)." },
                    { q: "How do I report a bug?", a: "You can report bugs by emailing support@d3xplore.ai or using the AI Chat Assistant." }
                ].map((item, i) => (
                    <details key={i} className={`group p-4 rounded-xl border ${cardBg} open:bg-blue-50 dark:open:bg-blue-900/10 transition`}>
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                            <span>{item.q}</span>
                            <span className="transition group-open:rotate-180">
                                <ChevronDown size={20} className={textMuted} />
                            </span>
                        </summary>
                        <div className={`text-sm mt-3 ${textMuted} leading-relaxed`}>
                            {item.a}
                        </div>
                    </details>
                ))}
            </div>
        </div>

        {/* Key Features */}
        <div>
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${headingColor}`}><Rocket className="text-purple-500"/> Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    "Interactive 3D Visualizations for all major DSA topics",
                    "Step-by-step execution flow with time & space complexity",
                    "Multi-language support (Java, Python, C, C++, JavaScript, Go)",
                    "AI-powered learning assistant for code explanations",
                    "Built-in chat assistant for real-time guidance",
                    "Structured beginner to advanced DSA roadmap",
                    "Coding exercises, practice problems & quizzes",
                    "Progress tracking & performance analytics"
                ].map((feature, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800/50'}`}>
                        <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                        <span className={`text-sm ${textMuted}`}>{feature}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Roadmap */}
        <div>
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${headingColor}`}><MapIcon className="text-orange-500"/> Future Roadmap</h3>
            <div className={`p-6 rounded-xl border ${cardBg} space-y-3`}>
                 {[
                    "🎧 Voice-based AI mentor",
                    "📱 Mobile app for Android & iOS",
                    "🤖 Automated mock interviews with AI evaluation",
                    "🧪 Contest mode & leaderboard",
                    "🏆 Gamification & reward XP system"
                 ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3">
                         <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-600 uppercase">Coming Soon</div>
                         <span className={textMuted}>{item}</span>
                     </div>
                 ))}
            </div>
        </div>

        {/* Dev Note */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl flex gap-3">
            <AlertTriangle className="text-yellow-500 shrink-0" />
            <div>
                <h4 className="font-bold text-yellow-500 text-sm uppercase mb-1">Development Stage Note</h4>
                <p className={`text-sm ${theme === 'light' ? 'text-yellow-700' : 'text-yellow-200/70'}`}>
                    D3xplore is currently in active development. Some features may be in beta. We welcome your feedback to help us grow.
                </p>
            </div>
        </div>

        {/* Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                 <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${headingColor}`}><MessageCircle size={20}/> Support & Help</h3>
                 <ul className={`space-y-2 text-sm ${textMuted}`}>
                     <li>• Chat with AI Support Assistant (Bottom-right)</li>
                     <li>• Email: <a href="mailto:support@d3xplore.ai" className="text-blue-500 hover:underline">support@d3xplore.ai</a></li>
                     <li>• Visit FAQs section</li>
                 </ul>
             </div>
             <div>
                 <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${headingColor}`}><Heart size={20}/> Our Mission</h3>
                 <p className={`text-sm ${textMuted}`}>
                    To make learning Data Structures & Algorithms accessible, visual, and enjoyable for every student & developer — whether beginner or advanced.
                 </p>
             </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
             <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition transform">
                 Start Learning Free
             </button>
        </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col md:flex-row p-6 gap-6 max-w-6xl mx-auto w-full">
       {/* Sidebar */}
       <div className="w-full md:w-64 flex-shrink-0">
           <h2 className={`text-2xl font-bold mb-6 ${headingColor}`}>{t('settings')}</h2>
           <nav className="space-y-2">
               <button 
                 onClick={() => setActiveTab('profile')}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'profile' ? 'bg-blue-600 text-white' : `${textMuted} ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-800'}`}`}
               >
                   <UserIcon size={20} /> {t('profile')}
               </button>
               <button 
                 onClick={() => setActiveTab('preferences')}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'preferences' ? 'bg-blue-600 text-white' : `${textMuted} ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-800'}`}`}
               >
                   <SettingsIcon size={20} /> {t('preferences')}
               </button>
               <button 
                 onClick={() => setActiveTab('security')}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'security' ? 'bg-blue-600 text-white' : `${textMuted} ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-800'}`}`}
               >
                   <Shield size={20} /> {t('security')}
               </button>
               
               <button 
                 onClick={() => setActiveTab('about')}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'about' ? 'bg-green-600 text-white' : `${textMuted} ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-800'}`}`}
               >
                   <HelpCircle size={20} /> {t('help_about')}
               </button>
               
               {(currentUser.role === 'admin' || currentUser.role === 'trainer') && (
                   <div className={`pt-4 mt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'}`}>
                       <button 
                            onClick={() => setActiveTab('admin')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'admin' ? 'bg-purple-600 text-white' : `${textMuted} ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-800'}`}`}
                        >
                            <Database size={20} /> {t('admin_panel')}
                        </button>
                   </div>
               )}
           </nav>
       </div>

       {/* Main Content */}
       <div className={`flex-1 border rounded-2xl p-8 relative h-full overflow-y-auto ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
           {activeTab !== 'about' && (
               <div className={`flex justify-between items-center mb-8 pb-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                <h2 className={`text-xl font-bold capitalize ${headingColor}`}>{t(activeTab as any)}</h2>
                <div className="flex gap-3">
                        <button onClick={onLogout} className={`px-4 py-2 text-sm font-medium ${textMuted} hover:text-red-500`}>
                            {t('logout')}
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? t('saving') : <><Save size={18}/> {t('save_changes')}</>}
                        </button>
                </div>
               </div>
           )}

           {successMsg && (
               <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full shadow-xl text-sm font-bold animate-fade-in-up z-50">
                   {successMsg}
               </div>
           )}

           {activeTab === 'profile' && renderProfile()}
           {activeTab === 'preferences' && renderPreferences()}
           {activeTab === 'security' && renderSecurity()}
           {activeTab === 'admin' && renderAdmin()}
           {activeTab === 'about' && renderAbout()}

       </div>
    </div>
  );
};

export default Settings;
