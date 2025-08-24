import React, { useState } from 'react';
import { FileText, Clipboard, Rocket, Palette, Copy, Download } from 'lucide-react';
import { copySinglePrompt, copyAllPrompts, copyPromptWithMetadata, isClipboardSupported } from '../utils/copyUtils';
import { showToast } from '../utils/toast';

export const PromptDisplay = ({ prompts, isGenerating, onAutoExecute, hasPrompts }) => {
  const [copyingIndex, setCopyingIndex] = useState(null);
  const [copyingAll, setCopyingAll] = useState(false);

  const handleCopyPrompt = async (prompt, index) => {
    setCopyingIndex(index);
    try {
      await copySinglePrompt(prompt, index);
    } finally {
      setCopyingIndex(null);
    }
  };

  const handleCopyAllPrompts = async () => {
    setCopyingAll(true);
    try {
      await copyAllPrompts(prompts, 'AMTICS');
    } finally {
      setCopyingAll(false);
    }
  };

  const handleCopyWithMetadata = async (prompt, index) => {
    setCopyingIndex(index);
    try {
      const metadata = {
        platform: 'Generated Platform',
        postType: 'Custom Design',
        size: 'Generated Size',
        timestamp: Date.now()
      };
      await copyPromptWithMetadata(prompt, metadata);
    } finally {
      setCopyingIndex(null);
    }
  };

  const downloadAllPrompts = () => {
    const formatted = prompts
      .map((prompt, i) => `=== AMTICS PROMPT ${i + 1} ===\n${prompt}`)
      .join('\n\n');

    const blob = new Blob([formatted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amtics-prompts-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('success', 'Prompts downloaded successfully! 📁');
  };

  const renderLoadingState = () => (
    <div className="loading-state">
      <div className="loading-animation">
        <div className="loading-spinner"></div>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <p className="loading-text">Crafting your technical prompts...</p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="empty-state">
      <div className="empty-icon">
        <Palette size={64} />
      </div>
      <h3 className="empty-title">Ready to Create</h3>
      <p className="empty-text">
        Configure your requirements and generate professional AI prompts for your graphics.
      </p>
    </div>
  );

  const renderPrompts = () => (
    <div className="prompts-container">
      {prompts.map((prompt, index) => (
        <div key={index} className="prompt-card">
          <div className="prompt-header">
            <div className="prompt-number">Prompt {index + 1}</div>
            <div className="prompt-actions">
              <button
                className={`prompt-copy-btn ${copyingIndex === index ? 'copying' : ''}`}
                onClick={() => handleCopyPrompt(prompt, index)}
                disabled={copyingIndex === index}
                title="Copy prompt to clipboard"
              >
                {copyingIndex === index ? (
                  <>
                    <span className="loading-spinner-sm"></span>
                    <span>Copying...</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <pre className="prompt-text">{prompt}</pre>
          <div className="prompt-footer">
            <div className="prompt-stats">
              <span className="char-count">{prompt.length} characters</span>
              <span className="word-count">{prompt.split(/\s+/).length} words</span>
            </div>
            {!isClipboardSupported() && (
              <div className="clipboard-warning">
                <span title="Clipboard API not supported - fallback mode">⚠️ Fallback mode</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="glass-card output-panel">
      <div className="card-header">
        <h2 className="card-title">
          <FileText size={20} />
          Generated Prompts
        </h2>
        <div className="header-actions">
          {hasPrompts && (
            <>
              <button
                className={`btn btn-copy btn-sm ${copyingAll ? 'copying' : ''}`}
                onClick={handleCopyAllPrompts}
                disabled={copyingAll}
                title="Copy all prompts to clipboard"
              >
                {copyingAll ? (
                  <>
                    <span className="loading-spinner-sm"></span>
                    <span className="btn-text">Copying...</span>
                  </>
                ) : (
                  <>
                    <Clipboard size={16} />
                    <span className="btn-text">Copy All</span>
                  </>
                )}
              </button>
              <button
                className="btn btn-download btn-sm"
                onClick={downloadAllPrompts}
                title="Download prompts as text file"
              >
                <Download size={16} />
                <span className="btn-text">Download</span>
              </button>
              <button
                className="btn btn-execute btn-sm"
                onClick={onAutoExecute}
                title="Auto-execute prompts in multiple tabs"
              >
                <Rocket size={16} />
                <span className="btn-text">Auto-Execute</span>
                <span className="btn-shortcut">Ctrl+Enter</span>
              </button>
            </>
          )}
        </div>
      </div>

      {isGenerating && renderLoadingState()}
      {!isGenerating && !hasPrompts && renderEmptyState()}
      {!isGenerating && hasPrompts && renderPrompts()}
    </div>
  );
};
