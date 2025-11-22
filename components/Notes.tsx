
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, Edit, Eye, Search, Map, ChevronRight, ChevronDown, Pin, GraduationCap, Link as LinkIcon, Youtube, Globe, X, ExternalLink } from 'lucide-react';
import { Note } from '../types';
import { db, isFirebaseEnabled } from '../services/firebase';
import { dbService } from '../services/db';
import { collection, query, onSnapshot } from 'firebase/firestore';

interface NotesProps {
  userId: string;
}

// --- Roadmap Data Structure ---
const ROADMAP_DATA = [
  {
    title: "Phase 1: Foundation Data Structures",
    color: "text-blue-400",
    bg: "bg-blue-900/20",
    border: "border-blue-500",
    children: [
      { 
        title: "Strings", 
        children: ["Patterns & Validations", "Frequency / Hashing", "Substrings & Palindrome"] 
      },
      { 
        title: "Linked List", 
        children: ["Singly / Doubly / Circular", "Slow/Fast Pointer", "Detect & Remove Cycle"] 
      },
      { 
        title: "Stack", 
        children: ["Implementation", "Expression Evaluation"] 
      },
      { 
        title: "Queue", 
        children: ["Normal & Circular Queue", "Deque & Priority Queue"] 
      }
    ]
  },
  {
    title: "Phase 2: Intermediate Concepts",
    color: "text-yellow-400",
    bg: "bg-yellow-900/20",
    border: "border-yellow-500",
    children: [
      { 
        title: "Recursion & Backtracking", 
        children: ["Permutations", "Combinations & Subsets", "N-Queens / Maze Path"] 
      },
      { 
        title: "Advanced Searching & Sorting", 
        children: ["Binary Search Patterns", "Quick Sort", "Merge Sort"] 
      },
      { 
        title: "Trees", 
        children: ["Traversals (DFS / BFS)", "Height / Diameter", "Views (Top / Bottom / Left / Right)", "LCA"] 
      },
      { 
        title: "Binary Search Tree (BST)", 
        children: ["Insert / Delete / Search", "Validate BST"] 
      },
      { 
        title: "Heaps & Priority Queue", 
        children: ["Max / Min Heap", "k-th Largest / Smallest"] 
      }
    ]
  },
  {
    title: "Phase 3: Advanced Structures & Algorithms",
    color: "text-red-400",
    bg: "bg-red-900/20",
    border: "border-red-500",
    children: [
      { 
        title: "Graphs", 
        children: ["BFS / DFS", "Cycle Detection", "Shortest Path (Dijkstra / Bellman-Ford / Floyd Warshall)", "Topological Sort", "MST (Prim / Kruskal)"] 
      },
      { 
        title: "Tries", 
        children: ["Insert", "Search", "Autocomplete"] 
      },
      { 
        title: "Dynamic Programming (DP)", 
        children: ["1D DP", "2D DP (Knapsack / LCS / LIS / Coin Change)", "Advanced (Matrix DP / Tree DP / Bitmask DP)"] 
      },
      { 
        title: "Advanced Data Structures", 
        children: ["Segment Tree", "Fenwick Tree (BIT)", "Suffix Tree / Suffix Array", "KMP / Rabin-Karp"] 
      }
    ]
  },
  {
    title: "Final Phase: Competitive & Interview Prep",
    color: "text-purple-400",
    bg: "bg-purple-900/20",
    border: "border-purple-500",
    children: [
      { 
        title: "Patterns & Strategies", 
        children: ["Sliding Window", "Two Pointers", "Binary Search on Answer", "Greedy Algorithms"] 
      }
    ]
  }
];

// --- Resource Interface ---
interface Resource {
    id: string;
    name: string;
    articleUrl: string;
    youtubeName: string;
    youtubeUrl: string;
}

// --- Roadmap Component ---
interface RoadmapNodeProps {
  data: any;
  level?: number;
  last?: boolean;
}

const RoadmapNode: React.FC<RoadmapNodeProps> = ({ data, level = 0, last = false }) => {
  const [isOpen, setIsOpen] = useState(level < 2);
  const isLeaf = typeof data === 'string';
  
  if (isLeaf) {
    return (
      <div className="relative pl-6 py-1 group">
         <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-700"></div>
         <div className="absolute left-0 top-1/2 w-4 h-px bg-gray-700"></div>
         <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-200 transition-colors cursor-default">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-colors"></div>
            {data}
         </div>
      </div>
    );
  }

  return (
    <div className="relative pl-4">
      {level > 0 && (
        <>
          <div className={`absolute left-0 top-0 w-px bg-gray-700 ${last ? 'h-4' : 'bottom-0'}`}></div>
          <div className="absolute left-0 top-4 w-4 h-px bg-gray-700"></div>
        </>
      )}
      <div className="py-1">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 w-full text-left p-2 rounded-lg transition-all duration-300 ${level === 0 ? `${data.bg} border-l-4 ${data.border} mb-2` : 'hover:bg-gray-800'}`}
        >
           <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
              {isOpen ? <ChevronDown size={level === 0 ? 18 : 14} className={data.color || 'text-gray-400'} /> : <ChevronRight size={level === 0 ? 18 : 14} className={data.color || 'text-gray-400'} />}
           </div>
           <span className={`font-bold ${level === 0 ? `text-lg ${data.color}` : 'text-gray-300'}`}>
             {data.title}
           </span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out pl-4 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
           {data.children && data.children.map((child: any, idx: number) => (
              <RoadmapNode key={idx} data={child} level={level + 1} last={idx === data.children.length - 1} />
           ))}
        </div>
      </div>
    </div>
  );
};

const Notes: React.FC<NotesProps> = ({ userId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'note' | 'roadmap' | 'resources'>('note');

  const [resources, setResources] = useState<Resource[]>([]);
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [newResName, setNewResName] = useState('');
  const [newResArticle, setNewResArticle] = useState('');
  const [newResYtName, setNewResYtName] = useState('');
  const [newResYtLink, setNewResYtLink] = useState('');

  // Data Loading Logic
  useEffect(() => {
    if (!userId) return;
    
    let notesUnsub: any;
    let resUnsub: any;

    if (isFirebaseEnabled && db) {
        // Firebase Realtime Mode
        const notesRef = collection(db, `users/${userId}/notes`);
        notesUnsub = onSnapshot(query(notesRef), (snapshot) => {
            const fetchedNotes = snapshot.docs.map(doc => doc.data() as Note);
            fetchedNotes.sort((a, b) => b.updatedAt - a.updatedAt);
            setNotes(fetchedNotes);
            if (fetchedNotes.length > 0 && !activeNoteId) setActiveNoteId(fetchedNotes[0].id);
        });

        const resRef = collection(db, `users/${userId}/resources`);
        resUnsub = onSnapshot(query(resRef), (snapshot) => {
            const fetchedRes = snapshot.docs.map(doc => doc.data() as Resource);
            setResources(fetchedRes);
        });
    } else {
        // LocalStorage / Demo Mode
        const loadLocalData = async () => {
             // We use dbService wrapper which handles local storage logic
             const fetchedNotes = await dbService.getAll(`users/${userId}/notes`);
             fetchedNotes.sort((a: any, b: any) => b.updatedAt - a.updatedAt);
             setNotes(fetchedNotes as Note[]);
             if (fetchedNotes.length > 0 && !activeNoteId) setActiveNoteId(fetchedNotes[0].id);

             const fetchedRes = await dbService.getAll(`users/${userId}/resources`);
             setResources(fetchedRes as Resource[]);
        };
        loadLocalData();
        // Simple interval to poll for changes in demo mode if multiple tabs open (optional)
        const interval = setInterval(loadLocalData, 2000);
        return () => clearInterval(interval);
    }

    return () => {
        if (notesUnsub) notesUnsub();
        if (resUnsub) resUnsub();
    };
  }, [userId]);

  const saveNote = async (note: Note) => {
      await dbService.put(`users/${userId}/notes`, note);
      // In demo mode, force state update as we don't have snapshot listener
      if (!isFirebaseEnabled) {
          setNotes(prev => {
             const idx = prev.findIndex(n => n.id === note.id);
             if (idx >= 0) { const newNotes = [...prev]; newNotes[idx] = note; return newNotes; }
             else return [note, ...prev];
          });
      }
  };

  const handleCreateNote = async () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '# New Note\n',
      updatedAt: Date.now()
    };
    await saveNote(newNote);
    setActiveNoteId(newNote.id);
    setViewMode('note');
    setIsPreview(false);
  };

  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await dbService.delete(`users/${userId}/notes`, id);
    if (!isFirebaseEnabled) setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) setActiveNoteId(null);
  };

  const handleUpdateNote = async (key: keyof Note, value: string) => {
    if (!activeNoteId || viewMode !== 'note') return;
    const activeNote = notes.find(n => n.id === activeNoteId);
    if (activeNote) {
        const updated = { ...activeNote, [key]: value, updatedAt: Date.now() };
        // Optimistic update
        setNotes(prev => prev.map(n => n.id === activeNoteId ? updated : n));
        // Debounce usually, but here direct
        await saveNote(updated);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
      e.preventDefault();
      const newRes: Resource = {
          id: Date.now().toString(),
          name: newResName,
          articleUrl: newResArticle,
          youtubeName: newResYtName,
          youtubeUrl: newResYtLink
      };
      await dbService.put(`users/${userId}/resources`, newRes);
      if (!isFirebaseEnabled) setResources(prev => [...prev, newRes]);
      
      setNewResName(''); setNewResArticle(''); setNewResYtName(''); setNewResYtLink('');
      setIsAddResourceModalOpen(false);
  };

  const handleDeleteResource = async (id: string) => {
      await dbService.delete(`users/${userId}/resources`, id);
      if (!isFirebaseEnabled) setResources(prev => prev.filter(r => r.id !== id));
  };

  const getYouTubeID = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
  };

  const getActiveNote = () => notes.find(n => n.id === activeNoteId);

  const renderMarkdown = (text: string) => {
    // Simplified renderer
    let html = text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-blue-400">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 text-blue-300">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 text-blue-200">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/```([^`]+)```/gim, '<pre class="bg-gray-800 p-3 rounded-lg my-2 overflow-x-auto text-sm font-mono text-gray-300">$1</pre>')
      .replace(/\n/gim, '<br />');
    return { __html: html };
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-screen flex animate-fade-in bg-gray-900 text-white">
      {/* Sidebar List */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText size={20} className="text-blue-500" /> Notes
            </h2>
            <button onClick={handleCreateNote} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition shadow-lg"><Plus size={18} /></button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-900 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-300 focus:ring-1 focus:ring-blue-500 outline-none"/>
          </div>
        </div>

        <div className="p-2 border-b border-gray-700 bg-gray-900/30 space-y-1">
             <button onClick={() => setViewMode('roadmap')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group ${viewMode === 'roadmap' ? 'bg-purple-900/30 border border-purple-500/50' : 'hover:bg-gray-700 border border-transparent'}`}>
                 <div className={`p-2 rounded-full ${viewMode === 'roadmap' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400 group-hover:text-white'}`}><Map size={18} /></div>
                 <div className="text-left"><span className={`block font-bold text-sm ${viewMode === 'roadmap' ? 'text-purple-300' : 'text-gray-300'}`}>DSA Roadmap</span><span className="text-[10px] text-gray-500 flex items-center gap-1"><Pin size={10}/> Pinned</span></div>
             </button>
             <button onClick={() => setViewMode('resources')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group ${viewMode === 'resources' ? 'bg-orange-900/30 border border-orange-500/50' : 'hover:bg-gray-700 border border-transparent'}`}>
                 <div className={`p-2 rounded-full ${viewMode === 'resources' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400 group-hover:text-white'}`}><Globe size={18} /></div>
                 <div className="text-left"><span className={`block font-bold text-sm ${viewMode === 'resources' ? 'text-orange-300' : 'text-gray-300'}`}>Online Resources</span><span className="text-[10px] text-gray-500 flex items-center gap-1"><Pin size={10}/> Pinned</span></div>
             </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? <div className="p-4 text-center text-gray-500 text-sm">No notes found</div> : filteredNotes.map(note => (
              <div key={note.id} onClick={() => { setActiveNoteId(note.id); setViewMode('note'); }} className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50 transition group ${activeNoteId === note.id && viewMode === 'note' ? 'bg-blue-900/20 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}>
                <div className="flex justify-between items-start mb-1"><h3 className={`font-bold truncate pr-2 ${activeNoteId === note.id && viewMode === 'note' ? 'text-white' : 'text-gray-300'}`}>{note.title || 'Untitled'}</h3><button onClick={(e) => handleDeleteNote(note.id, e)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"><Trash2 size={14} /></button></div>
                <p className="text-xs text-gray-500 truncate">{new Date(note.updatedAt).toLocaleDateString()}</p>
              </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full bg-gray-900 overflow-hidden relative">
        {viewMode === 'roadmap' ? (
            <div className="flex-1 flex flex-col h-full">
                 <div className="h-16 border-b border-gray-700 flex items-center gap-4 px-6 bg-gray-800/50">
                     <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><GraduationCap size={24} /></div>
                     <div><h2 className="text-xl font-bold text-white">DSA Roadmap</h2></div>
                 </div>
                 <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                     <div className="max-w-4xl mx-auto space-y-6">{ROADMAP_DATA.map((phase, idx) => (<RoadmapNode key={idx} data={phase} />))}</div>
                 </div>
            </div>
        ) : viewMode === 'resources' ? (
            <div className="flex-1 flex flex-col h-full">
                <div className="h-16 border-b border-gray-700 flex items-center justify-between px-6 bg-gray-800/50">
                     <div className="flex items-center gap-4"><div className="p-2 bg-orange-500/20 rounded-lg text-orange-400"><LinkIcon size={24} /></div><h2 className="text-xl font-bold text-white">Online Resources</h2></div>
                     <button onClick={() => setIsAddResourceModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold shadow"><Plus size={18} /> Add Resource</button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                         {resources.map(res => {
                             const videoId = getYouTubeID(res.youtubeUrl);
                             return (
                                 <div key={res.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-orange-500 transition shadow-lg flex flex-col">
                                     <div className="p-4 flex justify-between items-start border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm">
                                         <h3 className="font-bold text-white text-lg">{res.name}</h3>
                                         <button onClick={() => handleDeleteResource(res.id)} className="text-gray-500 hover:text-red-400"><Trash2 size={18} /></button>
                                     </div>
                                     <div className="p-4 space-y-4 flex-1">
                                         {res.youtubeUrl && (<div className="space-y-2"><div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase"><Youtube size={14} /> {res.youtubeName || 'Video'}</div>{videoId ? (<div className="aspect-video rounded-lg overflow-hidden bg-black"><iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title="Video" frameBorder="0" allowFullScreen></iframe></div>) : (<a href={res.youtubeUrl} target="_blank" className="block p-3 bg-gray-700 rounded-lg text-blue-400 text-sm">{res.youtubeUrl}</a>)}</div>)}
                                         {res.articleUrl && (<div className="space-y-1 pt-2"><div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase"><FileText size={14} /> Article</div><a href={res.articleUrl} target="_blank" className="flex items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-200 transition"><ExternalLink size={16} /><span className="truncate text-sm flex-1">{res.articleUrl}</span></a></div>)}
                                     </div>
                                 </div>
                             );
                         })}
                     </div>
                </div>
            </div>
        ) : activeNoteId ? (
          <>
            <div className="h-16 border-b border-gray-700 flex items-center justify-between px-6 bg-gray-800/50">
              <input type="text" value={getActiveNote()?.title} onChange={(e) => handleUpdateNote('title', e.target.value)} className="bg-transparent text-xl font-bold text-white outline-none placeholder-gray-500 flex-1" placeholder="Note Title"/>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsPreview(!isPreview)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isPreview ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                    {isPreview ? <><Eye size={18}/> Preview</> : <><Edit size={18}/> Edit</>}
                </button>
              </div>
            </div>

            {isPreview ? (
              <div className="flex-1 p-8 overflow-y-auto prose prose-invert max-w-none custom-scrollbar" dangerouslySetInnerHTML={renderMarkdown(getActiveNote()?.content || '')} />
            ) : (
              <textarea value={getActiveNote()?.content} onChange={(e) => handleUpdateNote('content', e.target.value)} className="flex-1 bg-transparent p-8 outline-none resize-none text-gray-300 font-mono text-sm leading-relaxed custom-scrollbar" placeholder="Start typing your notes here... (Markdown supported)"/>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-50">
            <FileText size={64} className="mb-4" />
            <p>Select a note or create a new one</p>
          </div>
        )}
      </div>

      {/* Add Resource Modal */}
      {isAddResourceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-gray-800 border border-gray-700 w-full max-w-lg rounded-2xl shadow-2xl animate-fade-in-up">
                  <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white">Add Resource</h3>
                      <button onClick={() => setIsAddResourceModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                  </div>
                  <form onSubmit={handleAddResource} className="p-6 space-y-4">
                      <div><label className="block text-xs text-gray-400 font-bold uppercase mb-1">Topic Name</label><input required type="text" value={newResName} onChange={e => setNewResName(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-orange-500" placeholder="e.g., Graph Theory Guide"/></div>
                      <div><label className="block text-xs text-gray-400 font-bold uppercase mb-1">Article / Website URL</label><input type="url" value={newResArticle} onChange={e => setNewResArticle(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="https://..."/></div>
                      <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-xs text-gray-400 font-bold uppercase mb-1">YouTube Channel</label><input type="text" value={newResYtName} onChange={e => setNewResYtName(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-red-500" placeholder="Channel Name"/></div>
                          <div><label className="block text-xs text-gray-400 font-bold uppercase mb-1">Video URL</label><input type="url" value={newResYtLink} onChange={e => setNewResYtLink(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-red-500" placeholder="https://youtube.com/..."/></div>
                      </div>
                      <button type="submit" className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg shadow-lg mt-4">Save Resource</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Notes;
