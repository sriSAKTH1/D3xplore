
import React, { useState } from 'react';
import { Play, Trash2, CheckCircle2, XCircle, Plus, Terminal, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface CodeEditorProps {
    initialCode: string;
    language: string;
}

interface TestCase {
    id: number;
    inputs: { name: string; value: string }[];
}

interface TestResult {
    id: number;
    status: 'Passed' | 'Failed' | 'Error';
    output: string;
    expected: string;
    logs: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, language }) => {
    const [code, setCode] = useState(initialCode);
    const [isRunning, setIsRunning] = useState(false);
    
    // Test Panel State
    const [activeTab, setActiveTab] = useState<'testcase' | 'result' | 'output'>('testcase');
    const [activeCaseId, setActiveCaseId] = useState(0);
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [consoleOutput, setConsoleOutput] = useState<string>('');
    
    // Default Test Cases matching the screenshot context
    const [testCases, setTestCases] = useState<TestCase[]>([
        { id: 0, inputs: [{ name: 'target', value: '[1, 3]' }, { name: 'n', value: '3' }] },
        { id: 1, inputs: [{ name: 'target', value: '[2, 5, 8]' }, { name: 'n', value: '10' }] },
        { id: 2, inputs: [{ name: 'target', value: '[4, 1]' }, { name: 'n', value: '5' }] },
    ]);

    const [testResults, setTestResults] = useState<TestResult[] | null>(null);

    const handleInputChange = (caseId: number, inputName: string, newValue: string) => {
        setTestCases(prev => prev.map(tc => {
            if (tc.id === caseId) {
                return {
                    ...tc,
                    inputs: tc.inputs.map(i => i.name === inputName ? { ...i, value: newValue } : i)
                };
            }
            return tc;
        }));
    };

    const runCode = () => {
        setIsRunning(true);
        setActiveTab('result');
        setIsPanelOpen(true); // Auto-open panel on run
        setTestResults(null); // Clear previous results
        setConsoleOutput('');

        // Simulate network/execution delay
        setTimeout(() => {
            // Mock results generation
            const results: TestResult[] = testCases.map((tc, index) => {
                // Fake logic: Fail the 3rd case for demo purposes to show red state
                const isSuccess = index !== 2; 
                
                // Mock outputs based on inputs
                let mockOutput = "[]";
                if (index === 0) mockOutput = "[0, 1]";
                if (index === 1) mockOutput = "[1, 2]";
                if (index === 2) mockOutput = "[-1]"; // Expected might be different

                return {
                    id: tc.id,
                    status: isSuccess ? 'Passed' : 'Failed',
                    output: mockOutput,
                    expected: index === 2 ? "[0, 2]" : mockOutput,
                    logs: `Runtime: ${Math.floor(Math.random() * 50)}ms\nMemory: ${Math.floor(Math.random() * 10 + 30)}MB`
                };
            });

            // Generate Mock Console Output
            const timestamp = new Date().toLocaleTimeString();
            const mockLogs = `> [${timestamp}] Compiling Solution...\n> Running against 3 test cases...\n\n[stdout] Case 1: Processing target=[1, 3], n=3\n[stdout] Case 1: Found valid subset.\n\n[stdout] Case 2: Processing target=[2, 5, 8], n=10\n[stdout] Case 2: Calculation complete.\n\n[stdout] Case 3: Processing target=[4, 1], n=5\n[stderr] Warning: Suboptimal path detected.\n\n> All tests finished.`;

            setConsoleOutput(mockLogs);
            setTestResults(results);
            setIsRunning(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-gray-700 shadow-xl">
            {/* Top Bar */}
            <div className="bg-[#252526] px-4 py-2 flex justify-between items-center border-b border-gray-700 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-400 font-mono uppercase font-bold tracking-wider">{language}</span>
                    <span className="text-xs text-gray-500">Solution.{language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => { setCode(initialCode); setTestResults(null); setConsoleOutput(''); }} 
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition"
                        title="Reset Code"
                    >
                        <Trash2 size={14} />
                    </button>
                    <button 
                        onClick={runCode} 
                        disabled={isRunning}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold text-white transition shadow-lg ${isRunning ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'}`}
                    >
                        <Play size={14} className={isRunning ? "animate-pulse" : "fill-current"} /> {isRunning ? 'Running...' : 'Run'}
                    </button>
                </div>
            </div>

            {/* Code Area */}
            <div className="flex-1 min-h-0 relative">
                <textarea 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-[#1e1e1e] text-gray-300 font-mono p-4 outline-none resize-none text-sm leading-relaxed"
                    spellCheck={false}
                    autoComplete="off"
                />
            </div>

            {/* Bottom Panel (Test Cases / Results / Output) - Collapsible */}
            <div className={`bg-[#1e1e1e] border-t border-gray-700 flex flex-col animate-fade-in transition-all duration-300 ease-in-out ${isPanelOpen ? 'h-[45%]' : 'h-10'}`}>
                {/* Panel Tabs (Header) */}
                <div className="flex items-center justify-between bg-[#252526] border-b border-gray-700 px-2 h-10 shrink-0">
                    <div className="flex items-center">
                        <button 
                            onClick={() => { setActiveTab('testcase'); setIsPanelOpen(true); }}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'testcase' && isPanelOpen
                                ? 'border-green-500 text-white' 
                                : 'border-transparent text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            <CheckCircle2 size={14} className={activeTab === 'testcase' && isPanelOpen ? 'text-green-500' : 'text-gray-500'} />
                            Testcase
                        </button>
                        <button 
                            onClick={() => { setActiveTab('result'); setIsPanelOpen(true); }}
                            disabled={!testResults && !isRunning}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'result' && isPanelOpen
                                ? 'border-green-500 text-white' 
                                : 'border-transparent text-gray-400'
                            } ${!testResults && !isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-200'}`}
                        >
                            <Terminal size={14} className={activeTab === 'result' && isPanelOpen ? 'text-green-500' : 'text-gray-500'} />
                            Test Result
                        </button>
                        <button 
                            onClick={() => { setActiveTab('output'); setIsPanelOpen(true); }}
                            disabled={!consoleOutput && !isRunning}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'output' && isPanelOpen
                                ? 'border-green-500 text-white' 
                                : 'border-transparent text-gray-400'
                            } ${!consoleOutput && !isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-200'}`}
                        >
                            <FileText size={14} className={activeTab === 'output' && isPanelOpen ? 'text-green-500' : 'text-gray-500'} />
                            Output
                        </button>
                    </div>
                    <button 
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                        className="text-gray-400 hover:text-white p-2 rounded hover:bg-gray-700 transition"
                        title={isPanelOpen ? "Collapse Panel" : "Expand Panel"}
                    >
                        {isPanelOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>
                </div>

                {/* Panel Content (Only visible if open) */}
                {isPanelOpen && (
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                        {activeTab === 'testcase' && (
                            <div className="space-y-4">
                                {/* Case Selection */}
                                <div className="flex items-center gap-2 mb-4">
                                    {testCases.map((tc, idx) => (
                                        <button
                                            key={tc.id}
                                            onClick={() => setActiveCaseId(tc.id)}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                activeCaseId === tc.id 
                                                ? 'bg-gray-700 text-white' 
                                                : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                                            }`}
                                        >
                                            Case {idx + 1}
                                        </button>
                                    ))}
                                    <button className="p-1.5 text-gray-500 hover:text-white transition">
                                        <Plus size={14} />
                                    </button>
                                </div>

                                {/* Input Fields */}
                                <div className="space-y-4 animate-fade-in">
                                    {testCases.find(tc => tc.id === activeCaseId)?.inputs.map((input) => (
                                        <div key={input.name} className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-400 font-mono">{input.name} =</label>
                                            <div className="bg-[#252526] rounded-lg border border-gray-700 p-2">
                                                <input 
                                                    type="text" 
                                                    value={input.value}
                                                    onChange={(e) => handleInputChange(activeCaseId, input.name, e.target.value)}
                                                    className="w-full bg-transparent text-sm text-white font-mono outline-none"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'result' && (
                            /* Results View */
                            <div className="h-full flex flex-col">
                                {isRunning ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                                        <div className="w-6 h-6 border-2 border-gray-600 border-t-green-500 rounded-full animate-spin"></div>
                                        <span className="text-sm">Running code...</span>
                                    </div>
                                ) : testResults ? (
                                    <div>
                                        {/* Status Header */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className={`text-lg font-bold flex items-center gap-2 ${testResults[activeCaseId]?.status === 'Passed' ? 'text-green-500' : 'text-red-500'}`}>
                                                {testResults[activeCaseId]?.status === 'Passed' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                                {testResults[activeCaseId]?.status === 'Passed' ? 'Accepted' : 'Wrong Answer'}
                                            </div>
                                            <span className="text-xs text-gray-500 font-mono">Runtime: 24ms</span>
                                        </div>

                                        {/* Case Tabs for Result */}
                                        <div className="flex items-center gap-2 mb-6">
                                            {testResults.map((tr, idx) => (
                                                <button
                                                    key={tr.id}
                                                    onClick={() => setActiveCaseId(tr.id)}
                                                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                        activeCaseId === tr.id 
                                                        ? 'bg-gray-700 text-white' 
                                                        : 'text-gray-500 hover:bg-gray-800'
                                                    }`}
                                                >
                                                    <div className={`w-1.5 h-1.5 rounded-full ${tr.status === 'Passed' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    Case {idx + 1}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Details */}
                                        {testResults[activeCaseId] && (
                                            <div className="space-y-4 font-mono text-sm animate-fade-in">
                                                <div className="space-y-1">
                                                    <span className="text-xs text-gray-500">Input</span>
                                                    <div className="bg-[#252526] p-3 rounded-lg text-gray-300 border border-gray-700">
                                                        {testCases[activeCaseId].inputs.map(i => `${i.name} = ${i.value}`).join(', ')}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs text-gray-500">Output</span>
                                                    <div className={`bg-[#252526] p-3 rounded-lg border border-gray-700 ${testResults[activeCaseId].status === 'Passed' ? 'text-white' : 'text-red-400'}`}>
                                                        {testResults[activeCaseId].output}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs text-gray-500">Expected</span>
                                                    <div className="bg-[#252526] p-3 rounded-lg text-green-400 border border-gray-700">
                                                        {testResults[activeCaseId].expected}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                                        Run the code to see results
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'output' && (
                            /* Output View */
                            <div className="h-full flex flex-col font-mono text-sm">
                                {isRunning ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                                        <div className="w-6 h-6 border-2 border-gray-600 border-t-green-500 rounded-full animate-spin"></div>
                                        <span className="text-sm">Compiling...</span>
                                    </div>
                                ) : consoleOutput ? (
                                    <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed animate-fade-in">
                                        {consoleOutput}
                                    </pre>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                                        Standard output (stdout) will appear here after running code.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CodeEditor;
