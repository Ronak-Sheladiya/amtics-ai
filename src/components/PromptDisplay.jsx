import React from 'react';
import { FileText, Clipboard, Rocket, Palette } from 'lucide-react';
import { showToast } from '../utils/toast';

export const PromptDisplay = ({ prompts, isGenerating, onAutoExecute, hasPrompts }) => {
  const copyPrompt = async (prompt, index) => {
    try {
      await navigator.clipboard.writeText(prompt);
      showToast('success', `Prompt ${index + 1} copied successfully!`);
    } catch (error) {
      console.error('Copy failed:', error);
      showToast('error', 'Failed to copy prompt');
    }
  };

  const copyAllPrompts = async () => {
    if (prompts.length === 0) {
      showToast('error', 'No prompts to copy');
      return;
    }
    
    const formatted = prompts
      .map((prompt, i) => `=== AMTICS PROMPT ${i + 1} ===\n${prompt}`)
      .join('\n\n');
    
    try {
      await navigator.clipboard.writeText(formatted);
      showToast('success', 'All prompts copied to clipboard!');
    } catch (error) {
      console.error('Copy all failed:', error);
      showToast('error', 'Failed to copy prompts');
    }
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
            <button
              className="prompt-copy-btn"
              onClick={() => copyPrompt(prompt, index)}
            >
              <span>📋</span> Copy
            </button>
          </div>
          <pre className="prompt-text">{prompt}</pre>
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
                className="btn btn-copy btn-sm"
                onClick={copyAllPrompts}
                title="Copy all prompts to clipboard"
              >
                <Clipboard size={16} />
                <span className="btn-text">Copy All</span>
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
