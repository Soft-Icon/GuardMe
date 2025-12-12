import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Activity, AlertOctagon, History as HistoryIcon, Send, Eraser } from 'lucide-react';
import { analyzeContent } from './services/geminiService';
import { GuardMEResponse, HistoryItem } from './types';
import AnalysisResult from './components/AnalysisResult';
import HistoryChart from './components/HistoryChart';

function App() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GuardMEResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeContent(inputText);
      setResult(data);

      // Add to history
      const newItem: HistoryItem = {
        ...data,
        id: Date.now().toString(),
        timestamp: new Date(),
        excerpt: inputText.length > 50 ? inputText.substring(0, 50) + '...' : inputText
      };

      setHistory(prev => [newItem, ...prev]);
    } catch (err) {
      setError("Failed to analyze content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-600 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
                GuardME
              </h1>
              <p className="text-xs text-slate-500">AI Safety Moderator</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-500" />
              <span>Real-time Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Gemini Powered</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Analyzer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-brand-600" />
                Content Analyzer
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Enter text below to scan for harassment, bias, or safety risks.
              </p>
            </div>
            
            <div className="p-6">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste content here to analyze..."
                className="w-full h-40 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all resize-none text-slate-700 placeholder:text-slate-400"
              />
              
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  disabled={loading}
                >
                  <Eraser className="w-4 h-4" /> Clear
                </button>
                
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !inputText.trim()}
                  className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium shadow-md transition-all
                    ${loading || !inputText.trim() 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-brand-600 hover:bg-brand-700 hover:shadow-lg active:scale-95'}
                  `}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Run Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-3">
              <AlertOctagon className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in-up">
              <AnalysisResult result={result} />
            </div>
          )}
        </div>

        {/* Right Column: Stats & History */}
        <div className="space-y-6">
          
          {/* Chart */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-slate-800 font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-500" />
              Session Stats
            </h3>
            <HistoryChart history={history} />
          </div>

          {/* Recent History List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-slate-800 font-semibold flex items-center gap-2">
                <HistoryIcon className="w-4 h-4 text-brand-500" />
                Recent Scans
              </h3>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {history.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No history yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between mb-1">
                        <span className={`
                          text-xs font-bold px-2 py-0.5 rounded-full
                          ${item.action === 'ALLOW' ? 'bg-green-100 text-green-700' : 
                            item.action === 'BLOCK' ? 'bg-red-100 text-red-700' : 
                            'bg-amber-100 text-amber-700'}
                        `}>
                          {item.action}
                        </span>
                        <span className="text-xs text-slate-400">
                          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-1">
                        "{item.excerpt}"
                      </p>
                      {item.primary_category !== 'None' && (
                        <p className="text-xs text-brand-600 font-medium">
                          Found: {item.primary_category}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;