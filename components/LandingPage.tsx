
import React, { useState } from 'react';
import { Play, Zap, Brain, Layers, Code, BarChart3, Trophy, ChevronDown, ChevronRight, Check, X as XIcon, Video, ArrowRight, Globe, Monitor, Shield, Star, Activity, Users } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const D3Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M20 25 V 75 C 20 90 35 95 60 95 H 75 L 65 85 H 50 C 40 85 30 80 30 65 V 35 L 20 25 Z" fill="#0044cc" />
     <path d="M20 25 H 75 C 90 25 95 35 95 60 V 85 L 85 75 V 60 C 85 45 80 35 65 35 H 30 L 20 25 Z" fill="#ec4899" />
     <path d="M25 30 H 70 C 82 30 85 38 85 60 V 80 L 60 80 C 45 80 30 80 30 65 V 30 L 25 30 Z" fill="white" />
     <circle cx="45" cy="65" r="10" fill="#0044cc" />
     <circle cx="70" cy="50" r="10" fill="#ec4899" />
  </svg>
);

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => setFaqOpen(faqOpen === index ? null : index);

  return (
    <div className="h-screen bg-[#0a0a0f] text-white font-poppins overflow-x-hidden overflow-y-auto scroll-smooth">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <D3Logo className="w-10 h-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <span className="text-2xl font-orbitron font-bold tracking-wider">
              <span className="text-pink-500">D</span><span className="text-blue-600">3</span>xplore
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#visualizer" className="hover:text-white transition">Visualizer</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>
          <button 
            onClick={onGetStarted}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center hero-grid overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] opacity-30"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
              🚀 The Future of Learning is Here
            </div>
            
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold leading-tight">
              Master DSA with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 neon-text">
                Visualization
              </span>
            </h1>

            <div className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-l-4 border-blue-500 rounded-r-xl backdrop-blur-sm">
               <p className="text-blue-200 font-medium">
                   🎉 D3xplore is now in free beta — access every feature at zero cost! <br/> 
                   <span className="text-sm opacity-80">Paid version coming soon.</span>
               </p>
            </div>

            <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
              Transform your learning experience with interactive 3D visual tools, personalized roadmaps, and AI-powered problem solving. Stop memorizing, start understanding.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onGetStarted}
                className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
              >
                Start Learning Free <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 glass-panel border border-white/20 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
                <Play size={20} fill="currentColor" /> Watch Demo
              </button>
            </div>
            <div className="flex items-center gap-4 pt-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#0a0a0f] flex items-center justify-center text-xs">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*123}`} alt="User" className="w-full h-full rounded-full" />
                  </div>
                ))}
              </div>
              <p>Join 10,000+ students learning visually</p>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
             <div className="relative z-10 glass-panel p-2 rounded-2xl border border-white/10 shadow-2xl transform hover:rotate-1 transition duration-500">
                <div className="bg-[#0f111a] rounded-xl overflow-hidden aspect-video relative group">
                    {/* Mock UI */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-0 transition duration-500">
                        <Play size={64} className="text-white/20" />
                    </div>
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex justify-between mb-4">
                            <div className="w-32 h-4 bg-gray-800 rounded animate-pulse"></div>
                            <div className="w-16 h-4 bg-blue-900/50 rounded"></div>
                        </div>
                        <div className="flex-1 flex items-end justify-center gap-2 pb-8">
                            {[40, 70, 30, 80, 50, 90, 20].map((h, i) => (
                                <div key={i} className="w-8 bg-gradient-to-t from-blue-600 to-purple-500 rounded-t-md transition-all duration-500 animate-bounce" style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}></div>
                            ))}
                        </div>
                        <div className="h-12 bg-gray-800 rounded-lg flex items-center px-4 gap-4">
                             <div className="w-8 h-8 rounded-full bg-blue-600"></div>
                             <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                 <div className="w-2/3 h-full bg-blue-500"></div>
                             </div>
                        </div>
                    </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-8 -right-8 p-4 glass-panel rounded-xl border border-white/10 shadow-xl animate-bounce delay-1000">
                    <Brain size={32} className="text-pink-500" />
                </div>
                <div className="absolute -bottom-6 -left-6 p-4 glass-panel rounded-xl border border-white/10 shadow-xl animate-bounce delay-700">
                    <Code size={32} className="text-blue-500" />
                </div>
             </div>
             
             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl -z-10 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="features" className="py-20 px-6 bg-[#0f111a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4">Why Learners Love <span className="text-blue-500">D3xplore</span></h2>
             <p className="text-gray-400">Experience the difference visual learning makes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
                { icon: Zap, title: "Learn Faster", desc: "Understand complex algorithms 10x faster with real-time visualization.", color: "text-yellow-400" },
                { icon: Brain, title: "AI Mentor", desc: "Get instant help, code explanations, and debugging support from Gemini AI.", color: "text-pink-400" },
                { icon: Layers, title: "Structured Path", desc: "Follow a curated roadmap from Beginner to Advanced mastery.", color: "text-blue-400" },
                { icon: Code, title: "Practice Lab", desc: "Write and test code in Python, Java, C++ directly in the browser.", color: "text-green-400" },
                { icon: BarChart3, title: "Analytics", desc: "Track your progress, solve streaks, and analyze performance.", color: "text-purple-400" },
                { icon: Trophy, title: "Gamified", desc: "Earn XP, badges, and climb the leaderboards as you learn.", color: "text-orange-400" }
             ].map((item, i) => (
                 <div key={i} className="p-8 rounded-2xl bg-[#151725] border border-white/5 hover:border-blue-500/30 transition-all hover:-translate-y-2 group">
                     <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition`}>
                         <item.icon size={24} />
                     </div>
                     <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                     <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                 </div>
             ))}
          </div>
        </div>
      </section>

      {/* Visualizer Preview */}
      <section id="visualizer" className="py-24 px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-blue-900/5"></div>
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
             <div>
                 <h2 className="text-3xl md:text-5xl font-orbitron font-bold mb-6">Experience <br/> Visual Learning</h2>
                 <p className="text-gray-400 text-lg mb-8">
                     Don't just read code. See it execute. Our 3D Visualizer Studio lets you step through algorithms line-by-line, watching data structures change in real-time.
                 </p>
                 
                 <div className="space-y-4 mb-8">
                     {[
                        "Step-by-step execution control",
                        "Dynamic speed adjustment",
                        "Custom input data support",
                        "Detailed state analysis"
                     ].map((feat, i) => (
                         <div key={i} className="flex items-center gap-3">
                             <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center"><Check size={14}/></div>
                             <span className="text-gray-300">{feat}</span>
                         </div>
                     ))}
                 </div>

                 <button onClick={onGetStarted} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-600/30 transition">
                     Try Visualizer Studio
                 </button>
             </div>

             <div className="relative">
                 <div className="glass-panel p-4 rounded-2xl border border-white/10 shadow-2xl">
                     <div className="aspect-square bg-[#0f111a] rounded-xl relative overflow-hidden flex items-center justify-center">
                         {/* Simulated sorting animation */}
                         <div className="flex items-end gap-1 h-64">
                             {[30, 50, 80, 40, 90, 20, 60, 70, 100, 10].map((h, i) => (
                                 <div key={i} className="w-6 bg-blue-500 rounded-t-sm animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 200}ms` }}></div>
                             ))}
                         </div>
                         
                         <div className="absolute bottom-8 bg-white/10 backdrop-blur-md px-6 py-3 rounded-lg border border-white/20 flex gap-4 text-sm font-mono">
                             <span>Comparing: <span className="text-yellow-400">arr[4]</span> vs <span className="text-yellow-400">arr[5]</span></span>
                         </div>
                     </div>
                 </div>
                 
                 {/* Floating Tooltip */}
                 <div className="absolute top-1/4 -left-10 bg-gray-900 p-4 rounded-lg border border-gray-700 shadow-xl animate-bounce delay-300">
                     <div className="flex items-center gap-3 text-sm">
                         <div className="w-2 h-2 rounded-full bg-red-500"></div>
                         <span className="font-mono text-red-400">Swap Executed</span>
                     </div>
                 </div>
             </div>
         </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 bg-[#0a0a0f]">
          <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold font-orbitron mb-4">Traditional Learning vs <span className="text-blue-500">D3xplore</span></h2>
              </div>

              <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
                  <div className="grid grid-cols-3 p-6 border-b border-white/10 bg-white/5 text-lg font-bold">
                      <div>Feature</div>
                      <div className="text-center text-gray-400">Traditional</div>
                      <div className="text-center text-blue-400">D3xplore</div>
                  </div>
                  {[
                      { feat: "Visual Understanding", trad: false, d3: true },
                      { feat: "Real-time Execution", trad: false, d3: true },
                      { feat: "AI Mentor Help", trad: false, d3: true },
                      { feat: "Progress Tracking", trad: false, d3: true },
                      { feat: "Interview Prep", trad: "Limited", d3: "Advanced" }
                  ].map((row, i) => (
                      <div key={i} className="grid grid-cols-3 p-6 border-b border-white/5 hover:bg-white/5 transition">
                          <div className="font-medium text-gray-300">{row.feat}</div>
                          <div className="flex justify-center text-gray-500">
                              {row.trad === false ? <XIcon size={20}/> : row.trad === true ? <Check size={20}/> : row.trad}
                          </div>
                          <div className="flex justify-center text-blue-400">
                              {row.d3 === true ? <Check size={20} className="text-green-400"/> : row.d3}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-[#0f111a]">
          <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold font-orbitron text-center mb-12">What Students Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                      { name: "Aarav, India", quote: "I finally understand recursion thanks to D3xplore! The visualization tree made it click instantly.", stars: 5 },
                      { name: "Sofia, Canada", quote: "This visual tool is a game-changer for interviews. Practicing here gave me so much confidence.", stars: 5 },
                      { name: "Michael, US", quote: "Better than any YouTube tutorial or Udemy course I took. The AI mentor is surprisingly good.", stars: 5 }
                  ].map((t, i) => (
                      <div key={i} className="p-8 bg-[#151725] rounded-2xl border border-white/5 relative">
                          <div className="flex gap-1 text-yellow-400 mb-4">
                              {[...Array(t.stars)].map((_, si) => <Star key={si} size={16} fill="currentColor" />)}
                          </div>
                          <p className="text-gray-300 italic mb-6">"{t.quote}"</p>
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`} alt={t.name} />
                              </div>
                              <span className="font-bold text-sm">{t.name}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 relative bg-[#0a0a0f]">
          <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold font-orbitron mb-4">Pricing</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    D3xplore is completely free during our development & beta phase. <br/>
                    Enjoy unrestricted access to all features—no credit card, no limitations, no hidden charges.
                  </p>
              </div>

              {/* Current Beta Plan Card */}
              <div className="max-w-2xl mx-auto mb-16">
                  <div className="p-10 rounded-3xl bg-gradient-to-b from-blue-900/20 to-[#0a0a0f] border border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.2)] relative overflow-hidden transform hover:scale-105 transition duration-300">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-b-lg uppercase tracking-wider shadow-lg">
                          Current Plan
                      </div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
                      
                      <div className="text-center mb-8">
                          <h3 className="text-3xl font-bold text-white mb-2">Free Beta Access</h3>
                          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">₹0 <span className="text-2xl text-gray-500 font-normal">/ Free</span></div>
                          <p className="text-blue-200 font-medium">Full access to everything.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300 mb-8">
                          <div className="flex items-center gap-3"><Check size={18} className="text-green-400"/> All DSA Visualizers</div>
                          <div className="flex items-center gap-3"><Check size={18} className="text-green-400"/> AI Assistant (Gemini Pro)</div>
                          <div className="flex items-center gap-3"><Check size={18} className="text-green-400"/> Complete Roadmap</div>
                          <div className="flex items-center gap-3"><Check size={18} className="text-green-400"/> Practice Problems</div>
                          <div className="flex items-center gap-3"><Check size={18} className="text-green-400"/> Progress Tracking</div>
                          <div className="flex items-center gap-3"><Check size={18} className="text-green-400"/> Community Access</div>
                      </div>

                      <button 
                        onClick={onGetStarted}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition text-lg flex items-center justify-center gap-2"
                      >
                         Start Learning Free <ArrowRight size={20}/>
                      </button>
                  </div>
              </div>

              {/* Future Plans Table */}
              <div className="mb-8">
                  <h3 className="text-2xl font-bold font-orbitron text-center mb-8">Coming Soon — Future Plans</h3>
                  <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
                      <div className="grid grid-cols-3 p-5 border-b border-white/10 bg-white/5 text-sm font-bold uppercase tracking-wider text-gray-400">
                          <div>Plan</div>
                          <div className="text-center">Status</div>
                          <div>What’s Coming</div>
                      </div>
                      <div className="grid grid-cols-3 p-6 border-b border-white/5 hover:bg-white/5 transition items-center">
                          <div className="font-bold text-lg text-white">Pro</div>
                          <div className="text-center"><span className="px-2 py-1 rounded bg-purple-900/50 text-purple-300 text-xs font-bold uppercase border border-purple-500/30">Coming Soon</span></div>
                          <div className="text-sm text-gray-400">Advanced AI mentor, mock interviews, certification, leaderboards, company-wise prep.</div>
                      </div>
                      <div className="grid grid-cols-3 p-6 border-b border-white/5 hover:bg-white/5 transition items-center">
                          <div className="font-bold text-lg text-white">Enterprise</div>
                          <div className="text-center"><span className="px-2 py-1 rounded bg-orange-900/50 text-orange-300 text-xs font-bold uppercase border border-orange-500/30">Coming Soon</span></div>
                          <div className="text-sm text-gray-400">Academic dashboard, student analytics, batch management, LMS & portal integration.</div>
                      </div>
                  </div>
              </div>

              {/* Footer Note */}
              <div className="text-center space-y-4">
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/20 border border-purple-500/30 text-purple-300 text-sm font-medium">
                       <Star size={16} fill="currentColor" /> Early users will receive special lifetime discounts when paid plans launch.
                   </div>
                   <p className="text-gray-500 text-sm">
                       No commitments. No subscriptions. No cancellation required. <br/>
                       Free access for everyone while we are in beta development.
                   </p>
              </div>
          </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 bg-[#0f111a]">
          <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold font-orbitron text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-4">
                  {[
                      { 
                        q: "What is D3xplore?", 
                        a: "D3xplore is an advanced interactive learning platform designed to help students and developers master Data Structures & Algorithms using real-time visualizations and AI guidance.\n\nInstead of learning through only text and theory, D3xplore allows you to see algorithms come to life in 3D animations, explore step-by-step execution, and analyze time & space complexity visually.\n\nIt includes:\n• 3D algorithm visualizers\n• AI-based mentor for doubt solving & explanations\n• Structured beginner → advanced DSA roadmap\n• Coding challenges & mock interviews\n• Personalized learning dashboard and analytics\n\nOur goal is to make learning DSA simple, visual, and more engaging — especially for interview preparation." 
                      },
                      { 
                        q: "Do I need previous coding experience to start?", 
                        a: "No! D3xplore is built for absolute beginners as well as experienced programmers.\n\nWe offer:\n• Beginner-friendly explanations\n• Concept-first learning before coding\n• Visual walk-throughs before writing code\n• Practice mode with hints and AI support\n\nIf you already know programming, you can jump directly into advanced problem-solving and interview practice. If you are new, you can follow the step-by-step learning path, starting from fundamentals." 
                      },
                      { 
                        q: "Which programming languages are supported?", 
                        a: "Currently, the platform supports visualization and problem-solving in:\n• Python\n• Java\n• C\n• C++\n• JavaScript\n• Go\n\n🔄 Coming soon:\n• C#\n• Kotlin\n• Swift\n• Rust\n\nEvery visualizer allows you to switch language and display code execution step-by-step for better understanding." 
                      },
                      { 
                        q: "Can I cancel anytime?", 
                        a: "Yes, you can cancel your Pro subscription at any time from the settings page." 
                      }
                  ].map((item, i) => (
                      <div key={i} className="border border-white/10 rounded-lg bg-[#151725] overflow-hidden">
                          <button onClick={() => toggleFaq(i)} className="w-full p-4 text-left flex justify-between items-center hover:bg-white/5 transition">
                              <span className="font-bold">{item.q}</span>
                              {faqOpen === i ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                          </button>
                          {faqOpen === i && (
                              <div className="p-4 pt-0 text-gray-400 text-sm border-t border-white/5 whitespace-pre-wrap leading-relaxed">
                                  {item.a}
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 z-0"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10 glass-panel p-12 rounded-3xl border border-white/20 shadow-2xl">
              <h2 className="text-4xl font-orbitron font-bold mb-6">Ready to become a DSA Champion?</h2>
              <p className="text-xl text-gray-300 mb-8">Start learning visually and build a strong DSA foundation today — for free.</p>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                  <button onClick={onGetStarted} className="px-8 py-4 bg-white text-blue-900 font-bold rounded-full hover:bg-gray-100 transition shadow-lg transform hover:-translate-y-1">Try Free Now</button>
                  <button className="px-8 py-4 bg-transparent border border-white text-white font-bold rounded-full hover:bg-white/10 transition flex items-center justify-center gap-2"><Users size={20}/> Join Community</button>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050507] py-12 px-6 border-t border-white/10 text-sm">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div>
                  <div className="flex items-center gap-2 mb-4">
                      <D3Logo className="w-8 h-8" />
                      <span className="text-xl font-orbitron font-bold">D3xplore</span>
                  </div>
                  <p className="text-gray-500">Making DSA simple, visual, and enjoyable for everyone.</p>
              </div>
              <div>
                  <h4 className="font-bold mb-4 text-gray-300">Product</h4>
                  <ul className="space-y-2 text-gray-500">
                      <li><a href="#features" className="hover:text-blue-400">Features</a></li>
                      <li><a href="#visualizer" className="hover:text-blue-400">Visualizer</a></li>
                      <li><a href="#pricing" className="hover:text-blue-400">Pricing</a></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold mb-4 text-gray-300">Resources</h4>
                  <ul className="space-y-2 text-gray-500">
                      <li><a href="#" className="hover:text-blue-400">Documentation</a></li>
                      <li><a href="#" className="hover:text-blue-400">Guides</a></li>
                      <li><a href="#faq" className="hover:text-blue-400">FAQ</a></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold mb-4 text-gray-300">Connect</h4>
                  <div className="flex gap-4 text-gray-500">
                      <a href="#" className="hover:text-white transition"><Globe size={20}/></a>
                      <a href="#" className="hover:text-white transition"><Monitor size={20}/></a>
                  </div>
                  <p className="mt-4 text-gray-500">support@d3xplore.ai</p>
              </div>
          </div>
          <div className="text-center text-gray-600 pt-8 border-t border-white/5">
             #Dsa.io -version1.0 ©2025 D3xplore. All rights reserved.
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
