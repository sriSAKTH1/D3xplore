
import React, { useState, useEffect } from 'react';
import { User, VisualizationModule, AlgorithmType } from '../types';
import { contentService } from '../services/contentService';
import { authService } from '../services/authService';
import { Plus, Trash2, BarChart3, Users, FileText, Cpu, LayoutGrid, Activity, Eye, Pencil } from 'lucide-react';

interface TrainerPanelProps {
  user: User;
}

const TrainerPanel: React.FC<TrainerPanelProps> = ({ user }) => {
  const [modules, setModules] = useState<VisualizationModule[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'analytics'>('overview');
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<AlgorithmType>(AlgorithmType.SORTING);
  const [newDifficulty, setNewDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newVisualType, setNewVisualType] = useState<'Interactive' | 'Static'>('Interactive');

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    const mods = await contentService.getModules();
    setModules(mods);
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDesc('');
    setNewType(AlgorithmType.SORTING);
    setNewDifficulty('Beginner');
    setNewVisualType('Interactive');
    setEditMode(false);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editMode && editingId) {
        const existing = modules.find(m => m.id === editingId);
        if (existing) {
            await contentService.updateModule({
                ...existing,
                title: newTitle,
                description: newDesc,
                baseType: newType,
                icon: newType === AlgorithmType.BST ? 'tree' : 'cpu',
                difficulty: newDifficulty,
                visualizationType: newVisualType,
            });
        }
    } else {
        await contentService.addModule({
            title: newTitle,
            description: newDesc,
            baseType: newType,
            icon: newType === AlgorithmType.BST ? 'tree' : 'cpu',
            difficulty: newDifficulty,
            visualizationType: newVisualType,
            createdBy: user.name
        });
    }
    
    resetForm();
    loadModules();
  };

  const handleEdit = (module: VisualizationModule) => {
      setNewTitle(module.title);
      setNewDesc(module.description);
      setNewType(module.baseType);
      setNewDifficulty(module.difficulty);
      setNewVisualType(module.visualizationType);
      
      setEditMode(true);
      setEditingId(module.id);
      setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      await contentService.deleteModule(id);
      loadModules();
    }
  };

  return (
    <div className="p-8 animate-fade-in max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-purple-500 mb-1">Trainer Dashboard</h2>
          <p className="text-gray-400">Manage content and track platform performance.</p>
        </div>
        <div className="flex items-center gap-3 bg-purple-900/20 border border-purple-500/30 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-purple-300 text-sm font-bold uppercase tracking-wider">Admin Access</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-700 pb-1">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition ${activeTab === 'overview' ? 'border-purple-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          <Activity size={16} /> Overview
        </button>
        <button 
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition ${activeTab === 'content' ? 'border-purple-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          <LayoutGrid size={16} /> Content Management
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition ${activeTab === 'analytics' ? 'border-purple-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          <BarChart3 size={16} /> Analytics
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
           <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
               <div className="flex items-center gap-3 mb-4">
                   <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg"><Users size={24} /></div>
                   <h3 className="font-bold text-gray-200">Total Students</h3>
               </div>
               <div className="text-4xl font-bold text-white mb-1">1,248</div>
               <p className="text-sm text-green-400">+12% from last week</p>
           </div>
           <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
               <div className="flex items-center gap-3 mb-4">
                   <div className="p-3 bg-purple-500/20 text-purple-400 rounded-lg"><FileText size={24} /></div>
                   <h3 className="font-bold text-gray-200">Active Modules</h3>
               </div>
               <div className="text-4xl font-bold text-white mb-1">{modules.length}</div>
               <p className="text-sm text-gray-400">Visualizations published</p>
           </div>
           <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
               <div className="flex items-center gap-3 mb-4">
                   <div className="p-3 bg-green-500/20 text-green-400 rounded-lg"><BarChart3 size={24} /></div>
                   <h3 className="font-bold text-gray-200">Completion Rate</h3>
               </div>
               <div className="text-4xl font-bold text-white mb-1">68%</div>
               <p className="text-sm text-gray-400">Avg. module completion</p>
           </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-white">Visualization Modules</h3>
             <button 
               onClick={() => { resetForm(); setIsFormOpen(true); }}
               className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold shadow-lg transition"
             >
               <Plus size={18} /> Add New Module
             </button>
          </div>

          {/* Creation/Edit Form */}
          {isFormOpen && (
            <div className="bg-gray-800 border border-gray-600 p-6 rounded-xl mb-8 animate-fade-in-up shadow-2xl">
               <h4 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                   {editMode ? 'Edit Visualization Module' : 'Create New Visualization'}
               </h4>
               <form onSubmit={handleCreateModule} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Topic / Title</label>
                        <input 
                          type="text" 
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                          placeholder="e.g., Quick Sort Deep Dive"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Category</label>
                        <select 
                          value={newType}
                          onChange={(e) => setNewType(e.target.value as AlgorithmType)}
                          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                          <option value={AlgorithmType.SORTING}>Sorting</option>
                          <option value={AlgorithmType.BST}>Binary Search Tree</option>
                          <option value={AlgorithmType.PATHFINDING}>Graph Algorithms</option>
                          <option value={AlgorithmType.BASIC}>Basic Concepts</option>
                          <option value={AlgorithmType.ARRAY}>Array Operations</option>
                        </select>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Difficulty</label>
                        <select 
                          value={newDifficulty}
                          onChange={(e) => setNewDifficulty(e.target.value as any)}
                          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Visualization Type</label>
                        <select 
                          value={newVisualType}
                          onChange={(e) => setNewVisualType(e.target.value as any)}
                          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                          <option value="Interactive">Interactive</option>
                          <option value="Static">Static</option>
                        </select>
                     </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
                      <textarea 
                        required
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none"
                        placeholder="Describe what students will learn..."
                      />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                     <button 
                       type="button" 
                       onClick={resetForm}
                       className="px-4 py-2 text-gray-400 hover:text-white font-bold"
                     >
                       Cancel
                     </button>
                     <button 
                       type="submit" 
                       className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold shadow-lg"
                     >
                       {editMode ? 'Update Module' : 'Publish Module'}
                     </button>
                  </div>
               </form>
            </div>
          )}

          {/* Modules List */}
          <div className="space-y-3">
            {modules.map(module => (
              <div key={module.id} className="bg-gray-800 border border-gray-700 p-4 rounded-xl flex justify-between items-center group hover:border-purple-500 transition">
                 <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${module.baseType === AlgorithmType.SORTING ? 'bg-blue-900/50 text-blue-400' : 'bg-green-900/50 text-green-400'}`}>
                       {module.baseType === AlgorithmType.SORTING ? <Cpu size={24} /> : <LayoutGrid size={24} />}
                    </div>
                    <div>
                       <h4 className="font-bold text-white text-lg">{module.title}</h4>
                       <p className="text-sm text-gray-400">
                         {module.description} • <span className="text-purple-400">{module.difficulty}</span> • <span className="text-blue-400">{module.visualizationType}</span>
                       </p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                       <p className="text-xs text-gray-500 uppercase">Created By</p>
                       <p className="text-sm text-gray-300">{module.createdBy}</p>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleEdit(module)}
                            className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition"
                            title="Edit Module"
                        >
                            <Pencil size={18} />
                        </button>
                        <button 
                            onClick={() => handleDelete(module.id)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
                            title="Delete Module"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
              {/* Performance Chart */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                  <h3 className="text-xl font-bold text-white mb-6">Quiz Performance (Avg Score)</h3>
                  <div className="flex items-end gap-4 h-64 border-b border-gray-600 pb-2">
                      <div className="flex-1 bg-blue-600/80 hover:bg-blue-500 rounded-t-lg transition-all h-[75%] relative group">
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">75%</div>
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">Arrays</span>
                      </div>
                      <div className="flex-1 bg-purple-600/80 hover:bg-purple-500 rounded-t-lg transition-all h-[60%] relative group">
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">60%</div>
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">Linked List</span>
                      </div>
                      <div className="flex-1 bg-green-600/80 hover:bg-green-500 rounded-t-lg transition-all h-[85%] relative group">
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">85%</div>
                           <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">Sorting</span>
                      </div>
                      <div className="flex-1 bg-yellow-600/80 hover:bg-yellow-500 rounded-t-lg transition-all h-[45%] relative group">
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">45%</div>
                           <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">Trees</span>
                      </div>
                      <div className="flex-1 bg-red-600/80 hover:bg-red-500 rounded-t-lg transition-all h-[30%] relative group">
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">30%</div>
                           <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">Graphs</span>
                      </div>
                  </div>
              </div>

              {/* Completion Stats */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col items-center justify-center">
                  <h3 className="text-xl font-bold text-white mb-6 self-start">Course Completion</h3>
                  <div className="relative w-48 h-48">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="10" />
                          {/* Segments */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="10" strokeDasharray="60 251" strokeDashoffset="0" transform="rotate(-90 50 50)" />
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray="100 251" strokeDashoffset="-60" transform="rotate(-90 50 50)" />
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="10" strokeDasharray="40 251" strokeDashoffset="-160" transform="rotate(-90 50 50)" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-white">1248</span>
                          <span className="text-xs text-gray-400">Students</span>
                      </div>
                  </div>
                  <div className="flex gap-4 mt-6 text-xs">
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> In Progress</div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Completed</div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> Started</div>
                  </div>
              </div>
              
              {/* Top Students */}
              <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="p-4 border-b border-gray-700 bg-gray-900/50">
                      <h3 className="font-bold text-white">Top Performing Students</h3>
                  </div>
                  <table className="w-full text-left text-sm text-gray-300">
                      <thead className="bg-gray-900/30 text-gray-400 uppercase text-xs">
                          <tr>
                              <th className="px-6 py-3">Student Name</th>
                              <th className="px-6 py-3">Modules Completed</th>
                              <th className="px-6 py-3">Avg Score</th>
                              <th className="px-6 py-3">Streak</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                          {[
                              { name: 'Alice Johnson', modules: 15, score: '98%', streak: 12 },
                              { name: 'Bob Smith', modules: 14, score: '95%', streak: 8 },
                              { name: 'Charlie Davis', modules: 12, score: '92%', streak: 20 },
                              { name: 'Diana Prince', modules: 11, score: '90%', streak: 5 },
                          ].map((s, i) => (
                              <tr key={i} className="hover:bg-gray-700/30 transition">
                                  <td className="px-6 py-4 font-medium text-white">{s.name}</td>
                                  <td className="px-6 py-4">{s.modules}</td>
                                  <td className="px-6 py-4 text-green-400 font-bold">{s.score}</td>
                                  <td className="px-6 py-4 flex items-center gap-1 text-yellow-400"><Activity size={14}/> {s.streak}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}
    </div>
  );
};

export default TrainerPanel;
