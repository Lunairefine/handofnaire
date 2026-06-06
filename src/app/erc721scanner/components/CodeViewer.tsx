import React from 'react';
import { Code, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface CodeViewerProps {
  solidityCode: string;
  contractName: string;
  isLoading: boolean;
}

// Custom Solidity Syntax Highlighter
function highlightSolidity(code: string): string {
  if (!code) return '';

  // Escape HTML characters
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Class styling maps
  const keywords = /\b(contract|interface|library|is|import|pragma|solidity|constructor)\b/g;
  const modifiers = /\b(function|modifier|returns?|external|public|internal|private|view|pure|payable|virtual|override)\b/g;
  const control = /\b(require|revert|assert|if|else|for|while|return)\b/g;
  const types = /\b(uint256|uint|address|bool|string|bytes32|bytes|mapping|uint8|uint16|uint32|int|bigint)\b/g;
  const globals = /\b(msg\.sender|msg\.value|tx\.origin|block\.timestamp|block\.number|address\(this\))\b/g;
  
  // Apply highlighting (wrapped in spans)
  // Double quotes strings
  escaped = escaped.replace(/(".*?")/g, '<span class="text-emerald-500">$1</span>');
  // Single quotes strings
  escaped = escaped.replace(/('.*?')/g, '<span class="text-emerald-500">$1</span>');
  
  // Comments (single line)
  escaped = escaped.replace(/(\/\/.*)/g, '<span class="text-gray-500 italic">$1</span>');
  // Comments (multiline)
  escaped = escaped.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 italic">$1</span>');

  // Highlight standard categories
  escaped = escaped.replace(keywords, '<span class="text-indigo-400 font-bold">$1</span>');
  escaped = escaped.replace(modifiers, '<span class="text-teal-400 font-semibold">$1</span>');
  escaped = escaped.replace(control, '<span class="text-rose-400">$1</span>');
  escaped = escaped.replace(types, '<span class="text-amber-300 font-medium">$1</span>');
  escaped = escaped.replace(globals, '<span class="text-sky-400 font-semibold">$1</span>');

  return escaped;
}

export default function CodeViewer({
  solidityCode,
  contractName,
  isLoading
}: CodeViewerProps) {
  const [copied, setCopied] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(true);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(solidityCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedHTML = React.useMemo(() => highlightSolidity(solidityCode), [solidityCode]);

  return (
    <div className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'h-[380px] lg:h-[420px]' : 'h-[44px]'}`}>
      {/* Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-surface)] shrink-0 cursor-pointer hover:bg-[var(--bg-main)]/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="text-[var(--text-secondary)]">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          <Code size={16} className="text-teal-500" />
          <h2 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] font-sans">
            Function Code
          </h2>
          <span className="font-sans text-[9px] text-[var(--text-secondary)] bg-[var(--bg-main)] px-2 py-0.5 rounded-[1px] border border-[var(--border-color)]">
            {contractName || 'Solidity'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          disabled={isLoading || !solidityCode}
          className="text-[10px] font-sans text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5 p-1 px-2.5 rounded-[1px] border border-[var(--border-color)] bg-[var(--bg-main)] cursor-pointer disabled:opacity-50"
        >
          {copied ? (
            <>
              <Check size={11} className="text-emerald-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={11} />
              Copy Snippet
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className={`flex-1 overflow-auto p-4 bg-black font-sans text-xs text-gray-300 relative no-scrollbar leading-relaxed transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-3">
            <span className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-teal-500"></span>
            </span>
            <p className="text-xs text-gray-400 font-sans">Pulling & parsing Solidity contract code...</p>
          </div>
        ) : (
          <pre className="overflow-x-auto whitespace-pre no-scrollbar">
            <code dangerouslySetInnerHTML={{ __html: highlightedHTML || '// Select a mint transaction from the stream to display Solidity function code snippet' }} />
          </pre>
        )}
      </div>
    </div>
  );
}
