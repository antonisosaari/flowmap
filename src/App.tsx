import { useState, useCallback, useEffect } from 'react';
import { 
  Map, 
  Copy, 
  Check, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Download,
  AlertCircle
} from 'lucide-react';
import { TreeNode } from './components/TreeNode';
import { parseFlowYaml } from './utils/parseYaml';
import { rentCheckExample } from './exampleData';
import type { FlowMap } from './types';

function App() {
  const [yamlInput, setYamlInput] = useState(rentCheckExample);
  const [flowMap, setFlowMap] = useState<FlowMap | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expandTrigger, setExpandTrigger] = useState(0);
  const [collapseTrigger, setCollapseTrigger] = useState(0);

  const parseYaml = useCallback(() => {
    const result = parseFlowYaml(yamlInput);
    if (result) {
      setFlowMap(result);
      setParseError(null);
    } else {
      setParseError('Virhe YAML-jäsennyksessä. Tarkista syntaksi.');
    }
  }, [yamlInput]);

  // Parse on mount
  useEffect(() => {
    parseYaml();
  }, []);

  // Debounced auto-parse
  useEffect(() => {
    const timer = setTimeout(() => {
      parseYaml();
    }, 500);
    return () => clearTimeout(timer);
  }, [yamlInput, parseYaml]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(yamlInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadExample = () => {
    setYamlInput(rentCheckExample);
  };

  const handleExpandAll = () => {
    setExpandTrigger(prev => prev + 1);
  };

  const handleCollapseAll = () => {
    setCollapseTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f1115]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-4 py-4 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
            <Map className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FlowMap
            </h1>
            <p className="text-xs text-gray-500">Interaktiopolkujen visualisointi</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[1800px] mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* YAML Editor Panel */}
          <div className="w-full lg:w-[40%] flex flex-col">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex flex-col h-[calc(100vh-140px)]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-300">YAML-editori</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleLoadExample}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Lataa esimerkki
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        Kopioitu!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Kopioi
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Syntax hint */}
              <div className="text-xs text-gray-500 mb-2 font-mono bg-white/5 rounded-lg p-2">
                Solmutyypit: <span className="text-blue-400">screen</span>, <span className="text-green-400">action</span>, <span className="text-purple-400">navigation</span>, <span className="text-amber-400">state</span>, <span className="text-teal-400">result</span>
              </div>

              {/* Textarea */}
              <textarea
                value={yamlInput}
                onChange={(e) => setYamlInput(e.target.value)}
                className="flex-1 w-full bg-black/30 rounded-xl border border-white/10 p-4 text-sm text-gray-300 resize-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                spellCheck={false}
                placeholder="Kirjoita YAML tähän..."
              />

              {/* Parse error */}
              {parseError && (
                <div className="mt-3 flex items-center gap-2 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4" />
                  {parseError}
                </div>
              )}

              {/* Update button */}
              <button
                onClick={parseYaml}
                className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Päivitä
              </button>
            </div>
          </div>

          {/* Visual Tree Panel */}
          <div className="w-full lg:w-[60%] flex flex-col">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex flex-col h-[calc(100vh-140px)]">
              {/* Header with app name and controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  {flowMap && (
                    <>
                      <h2 className="text-lg font-bold text-gray-100">{flowMap.name}</h2>
                      {flowMap.description && (
                        <p className="text-xs text-gray-500">{flowMap.description}</p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExpandAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                    Avaa kaikki
                  </button>
                  <button
                    onClick={handleCollapseAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                    Sulje kaikki
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-2 mb-4 text-xs">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/20 border border-blue-500/30">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-gray-300">Näkymä</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/20 border border-green-500/30">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-gray-300">Toiminto</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-500/20 border border-purple-500/30">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-gray-300">Navigointi</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/20 border border-amber-500/30">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-gray-300">Tila</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-teal-500/20 border border-teal-500/30">
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                  <span className="text-gray-300">Lopputulos</span>
                </div>
              </div>

              {/* Tree view */}
              <div className="flex-1 overflow-auto pr-2">
                {flowMap && flowMap.flows.length > 0 ? (
                  <div className="space-y-2">
                    {flowMap.flows.map((flow, index) => (
                      <TreeNode 
                        key={index} 
                        node={flow}
                        expandAll={expandTrigger > 0 ? true : undefined}
                        collapseAll={collapseTrigger > 0 ? true : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Ei näytettäviä polkuja. Kirjoita YAML vasemmalle.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
