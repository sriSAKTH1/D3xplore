
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Code, Cpu, GraduationCap, LogOut, UserCircle, BookOpen, Settings as SettingsIcon, LayoutGrid, ChevronLeft, ChevronRight, Search, Filter, Sparkles, X, PanelRightClose, PanelRightOpen, Network, GitBranch, Layers, Box, Database } from 'lucide-react';
import { ViewState, AlgorithmType, User, VisualizationModule, DifficultyLevel } from './types';
import Visualizer from './components/Visualizer';
import CodeEditor from './components/CodeEditor';
import ChatWidget from './components/ChatWidget';
import LiveSession from './components/LiveSession';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import Notes from './components/Notes';
import Settings from './components/Settings';
import TrainerPanel from './components/TrainerPanel';
import AlgorithmEducation from './components/AlgorithmEducation';
import { authService } from './services/authService';
import { contentService } from './services/contentService';
import { translations, Language } from './utils/i18n';

// --- Layout Components (D3Logo, SidebarItem) ... kept same as before ---
const D3Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M20 25 V 75 C 20 90 35 95 60 95 H 75 L 65 85 H 50 C 40 85 30 80 30 65 V 35 L 20 25 Z" fill="#0044cc" />
     <path d="M20 25 H 75 C 90 25 95 35 95 60 V 85 L 85 75 V 60 C 85 45 80 35 65 35 H 30 L 20 25 Z" fill="#ec4899" />
     <path d="M25 30 H 70 C 82 30 85 38 85 60 V 80 L 60 80 C 45 80 30 80 30 65 V 30 L 25 30 Z" fill="white" />
     <circle cx="45" cy="65" r="10" fill="#0044cc" />
     <circle cx="70" cy="50" r="10" fill="#ec4899" />
  </svg>
);

const SidebarItem = ({ icon: Icon, label, active, onClick, theme, collapsed }: any) => (
  <button onClick={onClick} className={`flex items-center gap-3 w-full py-3 rounded-lg transition-all duration-300 group relative ${collapsed ? 'justify-center px-2' : 'px-4'} ${active ? 'bg-blue-600 text-white shadow-lg' : theme === 'light' ? 'text-gray-600 hover:bg-gray-100 hover:text-blue-600' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`} title={collapsed ? label : ''}>
    <Icon size={20} className="shrink-0" />
    {!collapsed && <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300">{label}</span>}
    {collapsed && (<div className={`absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap shadow-xl border border-gray-700 transition-opacity`}>{label}</div>)}
  </button>
);

// ... (BOILERPLATES and getAlgorithmCode kept same) ...
const BOILERPLATES = {
  python: `class Solution:\n    def solve(self): pass`,
  c: `#include <stdio.h>\nvoid solve() {}`,
  cpp: `#include <iostream>\nusing namespace std;\nclass Solution { public: void solve() {} };`,
  java: `public class Solution {\n    public void solve() {}\n}`
};
const getAlgorithmCode = (type: AlgorithmType, difficulty: DifficultyLevel): string => {
  // ... (Code generation logic could be expanded, but keeping simple for now)
  return `// Code for ${type}`; 
};

const getModuleIcon = (type: AlgorithmType) => {
    switch(type) {
        case AlgorithmType.SORTING: return Cpu;
        case AlgorithmType.GRAPH: return Network;
        case AlgorithmType.TREE:
        case AlgorithmType.BST: return GitBranch;
        case AlgorithmType.STACK:
        case AlgorithmType.HEAP: return Layers;
        case AlgorithmType.DP: return Box;
        case AlgorithmType.ADVANCED: return Database;
        default: return Code;
    }
};


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [activeAlgo, setActiveAlgo] = useState<AlgorithmType>(AlgorithmType.BASIC);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [practiceLanguage, setPracticeLanguage] = useState<'python' | 'c' | 'cpp' | 'java'>('python');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCodePanelOpen, setIsCodePanelOpen] = useState(false);
  
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Easy');
  const [dashboardModules, setDashboardModules] = useState<VisualizationModule[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [filterVisualType, setFilterVisualType] = useState<string>('All Types');
  
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');

  // Firebase Auth Listener
  useEffect(() => {
    authService.init((loggedInUser) => {
      if (loggedInUser) {
        handleLoginSuccess(loggedInUser);
      } else {
        setUser(null);
        if (view !== ViewState.AUTH && view !== ViewState.LANDING) {
            setView(ViewState.LANDING);
        }
      }
    });
  }, []);

  useEffect(() => {
    const loadContent = async () => {
        if (view === ViewState.DASHBOARD) {
            const mods = await contentService.getModules();
            setDashboardModules(mods);
        }
    };
    loadContent();
  }, [view]);

  // Theme Logic
  useEffect(() => {
    const root = document.body;
    if (view === ViewState.LANDING || view === ViewState.AUTH) {
        root.classList.remove('bg-gray-50', 'text-gray-900');
        root.classList.add('bg-gray-900', 'text-white');
        return;
    }
    const userPref = user?.preferences?.theme || 'dark';
    let effectiveTheme = userPref;
    if (userPref === 'system') effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setCurrentTheme(effectiveTheme as 'dark' | 'light');
    if (effectiveTheme === 'light') { root.classList.remove('bg-gray-900', 'text-white'); root.classList.add('bg-gray-50', 'text-gray-900'); } 
    else { root.classList.remove('bg-gray-50', 'text-gray-900'); root.classList.add('bg-gray-900', 'text-white'); }
  }, [user?.preferences?.theme, view]);

  useEffect(() => { if (user?.preferences?.language) setCurrentLang(user.preferences.language as Language); }, [user?.preferences?.language]);

  const t = (key: keyof typeof translations.en) => translations[currentLang][key] || translations['en'][key];

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'admin' || loggedInUser.role === 'trainer') setView(ViewState.TRAINER);
    else setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => { authService.logout(); }; 
  const changeView = (newView: ViewState) => { if (newView === ViewState.TRAINER && (user?.role !== 'trainer' && user?.role !== 'admin')) { alert("Access Denied"); return; } setView(newView); };

  const bgCard = currentTheme === 'light' ? 'bg-white border-gray-200 text-gray-900 shadow-sm' : 'bg-gray-800 border-gray-700 text-white';
  const textMuted = currentTheme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const headingColor = currentTheme === 'light' ? 'text-gray-900' : 'text-white';

  const renderContent = () => {
    const filteredModules = dashboardModules.filter(m => {
        return (m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
               (filterCategory === 'All' || m.baseType === filterCategory) &&
               (filterDifficulty === 'All' || m.difficulty === filterDifficulty) &&
               (filterVisualType === 'All Types' || m.visualizationType === filterVisualType);
    });
    
    switch (view) {
      case ViewState.DASHBOARD:
         return (
             <div className="h-full overflow-y-auto scroll-smooth">
                <div className="p-8 space-y-10 animate-fade-in max-w-7xl mx-auto pb-24">
                   {/* Welcome Banner */}
                   <div className={`w-full p-8 rounded-2xl border shadow-lg relative overflow-hidden flex items-center justify-between ${currentTheme === 'light' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400' : 'bg-gradient-to-r from-blue-900 to-purple-900 border-blue-800 text-white'}`}>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4">Welcome back, {user?.name.split(' ')[0]}! 👋</h2>
                            <p className="opacity-90 max-w-3xl text-sm md:text-base leading-relaxed">
                                Start your journey to becoming a DSA Champion with interactive 3D visualizations, step-by-step concept breakdowns, and personalized learning paths.
                                Upgrade your problem-solving mindset, sharpen your logic, and crack top tech interviews with confidence.
                            </p>
                        </div>
                   </div>
                   
                   {/* Stats & Filters */}
                   <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                             <div className={`p-4 rounded-xl border text-center ${bgCard}`}>
                                 <div className="text-2xl font-bold">{dashboardModules.length}</div>
                                 <div className={`text-xs ${textMuted}`}>Total Modules</div>
                             </div>
                             <div className={`p-4 rounded-xl border text-center ${bgCard}`}>
                                 <div className="text-2xl font-bold">8</div>
                                 <div className={`text-xs ${textMuted}`}>Categories</div>
                             </div>
                             <div className={`p-4 rounded-xl border text-center ${bgCard}`}>
                                 <div className="text-2xl font-bold">{dashboardModules.filter(m => m.difficulty === 'Beginner').length}</div>
                                 <div className={`text-xs ${textMuted}`}>Beginner</div>
                             </div>
                             <div className={`p-4 rounded-xl border text-center ${bgCard}`}>
                                 <div className="text-2xl font-bold text-yellow-500">{user?.stats?.streak || 0} 🔥</div>
                                 <div className={`text-xs ${textMuted}`}>Day Streak</div>
                             </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${inputBg(currentTheme)}`}>
                                <Search size={16} className="text-gray-400"/>
                                <input type="text" placeholder="Search algorithms..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent outline-none text-sm w-full md:w-48"/>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${inputBg(currentTheme)}`}>
                                <Filter size={16} className="text-gray-400"/>
                                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-transparent outline-none text-sm cursor-pointer">
                                    <option value="All">All Categories</option>
                                    <option value={AlgorithmType.SORTING}>Sorting</option>
                                    <option value={AlgorithmType.GRAPH}>Graphs</option>
                                    <option value={AlgorithmType.TREE}>Trees</option>
                                    <option value={AlgorithmType.DP}>Dynamic Prog.</option>
                                </select>
                            </div>
                        </div>
                   </div>

                   {/* Content Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredModules.map((module) => {
                            const IconComp = getModuleIcon(module.baseType);
                            return (
                            <div key={module.id} onClick={() => { setActiveAlgo(module.baseType); changeView(ViewState.VISUALIZER); }} className={`p-6 rounded-xl border cursor-pointer transition group hover:border-blue-500 flex flex-col justify-between h-full hover:shadow-xl ${bgCard}`}>
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-lg transition group-hover:bg-blue-600 group-hover:text-white ${currentTheme === 'light' ? 'bg-blue-50 text-blue-600' : 'bg-blue-900/50 text-blue-400'}`}>
                                            <IconComp size={24} />
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${module.difficulty === 'Beginner' ? 'bg-green-900/30 text-green-400' : module.difficulty === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'}`}>
                                            {module.difficulty}
                                        </span>
                                    </div>
                                    <h3 className={`font-bold text-lg mb-2 ${headingColor}`}>{module.title}</h3>
                                    <p className={`text-sm ${textMuted} line-clamp-2`}>{module.description}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                                     <span className={`text-xs font-bold flex items-center gap-1 ${textMuted}`}>
                                         <Sparkles size={12} className="text-purple-500" /> {module.visualizationType}
                                     </span>
                                     <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-blue-600 transition text-white">
                                         <ChevronRight size={16} />
                                     </div>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>
             </div>
         );
      case ViewState.VISUALIZER:
         return (
             <div className="flex flex-col h-full overflow-hidden animate-fade-in">
                 {/* Header */}
                 <div className={`h-16 border-b flex items-center justify-between px-6 shrink-0 z-10 ${currentTheme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                      <div className="flex items-center gap-4">
                          <button onClick={() => changeView(ViewState.DASHBOARD)} className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${textMuted}`}><ChevronLeft size={20}/></button>
                          <h2 className={`text-xl font-bold ${headingColor}`}>Visualizer Studio</h2>
                      </div>
                      <button onClick={() => setIsCodePanelOpen(!isCodePanelOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition border ${isCodePanelOpen ? 'bg-blue-600 text-white border-blue-600' : `${currentTheme === 'light' ? 'bg-white text-gray-700 border-gray-300' : 'bg-gray-800 text-gray-300 border-gray-600'}`}`}>{isCodePanelOpen ? <PanelRightOpen size={18} /> : <PanelRightClose size={18}/>}</button>
                 </div>
                 {/* Content */}
                 <div className="flex-1 flex min-h-0 overflow-hidden relative">
                      <div className="flex-1 overflow-y-auto scroll-smooth">
                           <div className="p-6 max-w-6xl mx-auto flex flex-col gap-8 min-h-full">
                               <div className={`rounded-2xl overflow-hidden shadow-xl border ${currentTheme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'}`}>
                                   <Visualizer type={activeAlgo} difficulty={difficulty} onDifficultyChange={setDifficulty} />
                               </div>
                               <div className="pb-10"><AlgorithmEducation type={activeAlgo} difficulty={difficulty} /></div>
                           </div>
                      </div>
                      {/* Code Panel */}
                      <div className={`border-l flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out ${currentTheme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-900'} ${isCodePanelOpen ? 'w-full md:w-[450px] translate-x-0 opacity-100' : 'w-0 translate-x-full opacity-0'}`}>
                          <div className="h-full flex flex-col overflow-hidden">
                              <div className="flex-1 min-h-0"><CodeEditor key={`${activeAlgo}-${difficulty}-${practiceLanguage}`} language={practiceLanguage} initialCode={getAlgorithmCode(activeAlgo, difficulty)} /></div>
                          </div>
                      </div>
                 </div>
             </div>
         );
      case ViewState.EDITOR:
         return <div className="h-full p-6 animate-fade-in flex flex-col"><div className="flex-1 min-h-0"><CodeEditor key={practiceLanguage} language={practiceLanguage} initialCode={BOILERPLATES[practiceLanguage]} /></div></div>;
      case ViewState.NOTES: return <Notes userId={user?.id || 'guest'} />;
      case ViewState.SETTINGS: return user ? (<Settings currentUser={user} onUpdateUser={(u) => setUser(u)} onLogout={handleLogout} currentLang={currentLang} theme={currentTheme} />) : null;
      case ViewState.TRAINER: return user ? (<div className="h-full overflow-y-auto custom-scrollbar"><TrainerPanel user={user} /></div>) : null;
      default: return null;
    }
  };

  const inputBg = (theme: string) => theme === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-gray-800 border-gray-700 text-white';

  if (view === ViewState.LANDING) return <LandingPage onGetStarted={() => setView(ViewState.AUTH)} />;
  if (!user || view === ViewState.AUTH) return <AuthPage onLogin={handleLoginSuccess} />;

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${currentTheme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-white'}`}>
       {/* Sidebar */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} border-r flex flex-col justify-between p-4 hidden md:flex z-10 transition-all duration-300 ease-in-out ${currentTheme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'}`}>
         <div>
            <div className="flex items-center mb-10 mt-2 justify-between px-2">
                <div className="flex items-center gap-3"><D3Logo className="w-10 h-10 shrink-0 drop-shadow-lg" />{!isSidebarCollapsed && <span className={`text-xl font-bold ${headingColor}`}><span className="text-pink-500">D</span><span className="text-blue-600">3</span>xplore</span>}</div>
                <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className={`p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition`}>{isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button>
            </div>
            <nav className="space-y-2">
                <SidebarItem icon={LayoutDashboard} label={t('dashboard')} active={view === ViewState.DASHBOARD} onClick={() => changeView(ViewState.DASHBOARD)} theme={currentTheme} collapsed={isSidebarCollapsed} />
                <SidebarItem icon={Cpu} label={t('visualizer')} active={view === ViewState.VISUALIZER} onClick={() => changeView(ViewState.VISUALIZER)} theme={currentTheme} collapsed={isSidebarCollapsed} />
                <SidebarItem icon={Code} label={t('practice')} active={view === ViewState.EDITOR} onClick={() => changeView(ViewState.EDITOR)} theme={currentTheme} collapsed={isSidebarCollapsed} />
                <SidebarItem icon={BookOpen} label={t('notes')} active={view === ViewState.NOTES} onClick={() => changeView(ViewState.NOTES)} theme={currentTheme} collapsed={isSidebarCollapsed} />
                {(user.role === 'trainer' || user.role === 'admin') && (<SidebarItem icon={GraduationCap} label={t('trainer')} active={view === ViewState.TRAINER} onClick={() => changeView(ViewState.TRAINER)} theme={currentTheme} collapsed={isSidebarCollapsed} />)}
                <SidebarItem icon={SettingsIcon} label={t('settings')} active={view === ViewState.SETTINGS} onClick={() => changeView(ViewState.SETTINGS)} theme={currentTheme} collapsed={isSidebarCollapsed} />
            </nav>
         </div>
         <div className={`${isSidebarCollapsed ? 'px-2' : 'px-4'}`}><button onClick={handleLogout} className="w-full flex items-center gap-3 py-3 rounded-lg text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors justify-center px-2"><LogOut size={20} /></button></div>
      </aside>
      
      <main className={`flex-1 flex flex-col min-h-0 overflow-hidden relative ${currentTheme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>{renderContent()}</main>
      <ChatWidget onOpenLive={() => setIsLiveOpen(true)} />
      {isLiveOpen && <LiveSession onClose={() => setIsLiveOpen(false)} />}
    </div>
  );
};

export default App;
