import { useState, useEffect, FormEvent } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Search, 
  History, 
  AlertTriangle, 
  XCircle, 
  Loader2, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Cpu,
  Activity,
  Target,
  Menu,
  X,
  Info
} from 'lucide-react';
import { analyzeSymptoms } from './services/geminiService';
import { ThreatAnalysis, ScanHistoryItem, Severity } from './types';

// --- Components ---

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Threat Analyzer', icon: Search },
    { path: '/history', label: 'Incident Logs', icon: History },
    { path: '/about', label: 'Intelligence Base', icon: Zap },
  ];

  return (
    <aside className="sidebar">
      <div className="logo flex items-center gap-2 font-extrabold tracking-widest text-accent-neon mb-12 text-xl">
        <Shield className="w-6 h-6" /> SENTINEL.AI
      </div>
      <ul className="space-y-2">
        {navItems.map(item => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              onClick={onClose}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-accent-neon/10 border border-accent-neon/30 text-accent-neon' 
                  : 'text-text-dim hover:text-text-main hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
              {location.pathname === item.path && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto p-4 border border-dashed border-glass-border rounded-xl">
        <p className="text-[10px] text-text-dim italic font-mono uppercase tracking-tighter">
          Session ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}<br />
          Core: Gemini 3 Flash<br />
          Env: Production
        </p>
      </div>
    </aside>
  );
};

const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
    <div className="flex items-center gap-4 w-full sm:w-auto">
      {onMenuClick && (
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-white bg-glass-bg rounded-xl border border-glass-border active:scale-95"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 leading-none">
          NEURAL <span className="text-accent-neon">SCANNER</span>
        </h1>
        <p className="text-xs text-text-dim mt-1 font-medium italic">Analyzing behavioral heuristics for latent malware indicators</p>
      </div>
    </div>
    <div className="text-[0.7rem] bg-accent-success/10 px-4 py-2 rounded-xl border border-accent-success text-accent-success font-bold tracking-widest uppercase">
      Sentinel: Active
    </div>
  </header>
);

const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const severityClass = `severity-${severity.toLowerCase()}`;
  return (
    <span className={`severity-tag ${severityClass}`}>
      {severity} THREAT
    </span>
  );
};

// --- Panels ---

const ScannerPanel = ({ onScan, loading }: { onScan: (symptoms: string) => void, loading: boolean }) => {
  const [text, setText] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const commonSymptoms = [
    "Performance Lag",
    "UI Anomalies",
    "Unknown Network Activity",
    "Files Missing",
    "Unexpected Reboots",
    "Pop-up Ads",
    "High CPU Spikes",
    "Antivirus Disabled"
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const fullSymptoms = [text, ...selectedSymptoms].filter(Boolean).join(', ');
    if (fullSymptoms) onScan(fullSymptoms);
  };

  return (
    <section className="glass-panel h-full">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <label className="text-[0.75rem] uppercase tracking-widest text-text-dim mb-2 block">Observed Symptoms</label>
        <textarea
          className="cyber-input h-44 mb-6 resize-none focus:ring-2"
          placeholder="Describe what's happening with your system... (e.g., 'My PC is extremely slow and I see weird files on my desktop')"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />

        <label className="text-[0.75rem] uppercase tracking-widest text-text-dim mb-2 block font-medium">Quick Select Intelligence</label>
        <div className="flex flex-wrap gap-2 mb-8">
          {commonSymptoms.map(symptom => (
            <button
              type="button"
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`chip transition-all duration-200 ${selectedSymptoms.includes(symptom) ? 'chip-selected scale-105' : 'hover:scale-105'}`}
            >
              {symptom}
            </button>
          ))}
        </div>

        <button 
          type="submit" 
          disabled={loading || (!text.trim() && selectedSymptoms.length === 0)}
          className="btn-scan mt-auto py-4 font-bold tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Biological Patterns...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Initialize Deep Analysis
            </span>
          )}
        </button>
      </form>
    </section>
  );
};

const ResultsPanel = ({ result, loading, error, onReset }: { 
  result: ThreatAnalysis | null, 
  loading: boolean, 
  error: string | null,
  onReset: () => void 
}) => {
  if (loading) {
    return (
      <section className="glass-panel h-full flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <Loader2 className="w-12 h-12 text-accent-neon animate-spin" />
            <Shield className="w-5 h-5 text-accent-neon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-xl font-bold animate-pulse">Neural Analysis in Progress</h2>
          <p className="text-text-dim text-sm mt-2">Consulting global threat intelligence</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="glass-panel h-full flex items-center justify-center">
        <div className="text-center max-w-sm">
          <XCircle className="w-12 h-12 text-accent-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Analysis Interrupted</h2>
          <p className="text-text-dim text-sm mb-6">{error}</p>
          <button onClick={onReset} className="px-6 py-2 border border-accent-neon text-accent-neon rounded-lg hover:bg-accent-neon/10 transition-all">
            Retry Sequence
          </button>
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="glass-panel h-full flex items-center justify-center border-dashed">
        <div className="text-center opacity-40">
          <Activity className="w-12 h-12 mx-auto mb-4" />
          <p className="text-sm uppercase tracking-widest">Awaiting Input Stream</p>
        </div>
      </section>
    );
  }

  return (
    <section className="glass-panel h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-6 pb-6 border-b border-glass-border">
        <div>
          <SeverityBadge severity={result.severity} />
          <h2 className="text-2xl font-bold mt-2">{result.threat_type}</h2>
          <p className="text-text-dim text-sm">{result.threat_category}</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl text-accent-neon">{result.confidence}%</div>
          <div className="text-[0.7rem] uppercase text-text-dim">Confidence Score</div>
        </div>
      </div>

      <p className="text-[0.95rem] leading-relaxed text-text-main mb-8">
        {result.explanation}
      </p>

      <label className="text-[0.75rem] uppercase tracking-widest text-text-dim mb-4 block">Remediation Protocol</label>
      <ul className="space-y-3 mb-8">
        {result.remediation_steps.map((step, i) => (
          <li key={i} className="flex gap-3 p-3 bg-white/5 rounded-lg text-[0.85rem] items-start">
            <span className="text-accent-neon font-bold">→</span>
            {step}
          </li>
        ))}
      </ul>

      <div className="flex gap-10 mt-auto pt-6 border-t border-glass-border">
        <div className="flex flex-col gap-1">
          <div className="font-mono text-xl text-accent-neon">0.8s</div>
          <div className="text-[0.7rem] uppercase text-text-dim">Latency</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-mono text-xl text-accent-neon">12</div>
          <div className="text-[0.7rem] uppercase text-text-dim">Vectors</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-mono text-xl text-accent-neon">High</div>
          <div className="text-[0.7rem] uppercase text-text-dim">AI Certainty</div>
        </div>
      </div>
    </section>
  );
};

// --- Pages ---

const Analyzer = ({ onScan, result, loading, error, onReset }: any) => (
  <div className="flex flex-col lg:grid lg:grid-cols-[400px,1fr] gap-6 h-full min-h-0">
    <div className="flex-1 lg:h-full overflow-hidden min-h-[500px] lg:min-h-0">
      <ScannerPanel onScan={onScan} loading={loading} />
    </div>
    <div className="flex-1 lg:h-full overflow-hidden min-h-[400px] lg:min-h-0">
      <ResultsPanel result={result} loading={loading} error={error} onReset={onReset} />
    </div>
  </div>
);

const HistoryPage = ({ history }: { history: ScanHistoryItem[] }) => (
  <div className="glass-panel h-full overflow-y-auto">
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold">Incident Logs</h1>
      <div className="text-xs text-text-dim font-mono">{history.length} ENTRIES FOUND</div>
    </div>

    {history.length === 0 ? (
      <div className="flex-1 flex flex-col items-center justify-center opacity-40">
        <History className="w-12 h-12 mb-4" />
        <p className="text-sm uppercase tracking-widest">No Log Data Available</p>
      </div>
    ) : (
      <div className="space-y-3">
        {history.map(item => (
          <div key={item.id} className="p-4 bg-white/5 border border-glass-border rounded-xl hover:border-accent-neon/50 transition-all group cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold">{item.result.threat_type}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${
                    item.result.severity === 'Critical' ? 'border-accent-danger text-accent-danger' :
                    item.result.severity === 'High' ? 'border-accent-warning text-accent-warning' :
                    'border-accent-success text-accent-success'
                  }`}>
                    {item.result.severity}
                  </span>
                </div>
                <p className="text-xs text-text-dim line-clamp-1 mb-2">Symptoms: {item.symptoms}</p>
                <div className="text-[10px] text-text-dim font-mono">
                  {new Date(item.timestamp).toLocaleString()} | CONFIDENCE: {item.result.confidence}%
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-dim group-hover:text-accent-neon transition-colors" />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const About = () => (
  <div className="glass-panel h-full overflow-y-auto">
    <h1 className="text-2xl font-bold mb-8">Intelligence Base</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-neon/10 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-accent-neon" />
          </div>
          <h2 className="text-lg font-bold">Neural Processing</h2>
        </div>
        <p className="text-text-dim text-sm leading-relaxed">
          Our AI core utilizes advanced behavioral heuristics to identify latent malware indicators that traditional signature-based scanners might miss.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-warning/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-accent-warning" />
          </div>
          <h2 className="text-lg font-bold">Vector Analysis</h2>
        </div>
        <p className="text-text-dim text-sm leading-relaxed">
          By analyzing multiple attack vectors simultaneously, the system can triangulate the specific malware family and its intended payload.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-success/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-accent-success" />
          </div>
          <h2 className="text-lg font-bold">Remediation Protocol</h2>
        </div>
        <p className="text-text-dim text-sm leading-relaxed">
          Every detection triggers a custom remediation sequence designed to isolate, terminate, and recover from the specific threat identified.
        </p>
      </section>

      <div className="p-4 bg-accent-warning/5 border border-accent-warning/20 rounded-xl">
        <div className="flex gap-3">
          <AlertTriangle className="w-4 h-4 text-accent-warning flex-shrink-0" />
          <p className="text-[10px] text-accent-warning/70 uppercase tracking-wider leading-relaxed">
            <strong>Security Advisory:</strong> This tool is for preliminary analysis. Always maintain offline backups and use enterprise-grade endpoint protection.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ThreatAnalysis | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('aegis_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleScan = async (symptoms: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeSymptoms(symptoms);
      setResult(analysis);
      
      const newHistoryItem: ScanHistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        symptoms,
        result: analysis
      };

      const updatedHistory = [newHistoryItem, ...history].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem('aegis_history', JSON.stringify(updatedHistory));
      setIsMobileMenuOpen(false);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return (
    <Router>
      <div className="app-container h-screen overflow-hidden relative">
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-cyber-dark/80 backdrop-blur-md z-[60] md:hidden"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[280px] z-[70] md:hidden flex"
              >
                <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <Sidebar />
        
        <main className="main-content h-full">
          <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
          
          <div className="min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={
                  <motion.div 
                    key="analyzer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-full"
                  >
                    <Analyzer 
                      onScan={handleScan} 
                      result={result} 
                      loading={loading} 
                      error={error} 
                      onReset={resetScan} 
                    />
                  </motion.div>
                } />
                <Route path="/history" element={
                  <motion.div 
                    key="history"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full overflow-y-auto pr-2"
                  >
                    <HistoryPage history={history} />
                  </motion.div>
                } />
                <Route path="/about" element={
                  <motion.div 
                    key="about"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="h-full overflow-y-auto pr-2"
                  >
                    <About />
                  </motion.div>
                } />
              </Routes>
            </AnimatePresence>
          </div>

          <footer className="footer-status flex justify-between items-center text-[0.7rem] text-text-dim border-t border-glass-border pt-4">
            <div className="font-mono flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-success animate-pulse"></div>
              [LOG] {new Date().toLocaleTimeString()} - {result ? 'THREAT DETECTED' : 'CORE LISTENING'}
            </div>
            <div className="flex gap-4">
              <span className="hidden sm:inline italic">Neural Core v2.4</span>
              <span className="text-accent-neon font-bold tracking-widest uppercase">Secure Connection</span>
            </div>
          </footer>
        </main>
      </div>
    </Router>
  );
}
