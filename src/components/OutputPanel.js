import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clipboard, Palette, Activity, Rocket, Copy } from 'lucide-react';
import { useAmtics } from '../context/AmticsContext';

const OutputPanel = ({ onExecuteAll, isExecuting }) => {
  const { generatedPrompts, executionProgress, actions } = useAmtics();

  const copyPrompt = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      actions.addToast({
        type: 'success',
        message: `Prompt ${prompt.number} copied successfully!`
      });
    } catch (error) {
      console.error('Copy failed:', error);
      actions.addToast({
        type: 'error',
        message: 'Failed to copy prompt'
      });
    }
  };

  const copyAllPrompts = async () => {
    if (generatedPrompts.length === 0) {
      actions.addToast({
        type: 'error',
        message: 'No prompts to copy'
      });
      return;
    }
    
    const formatted = generatedPrompts
      .map((prompt, i) => `=== AMTICS PROMPT ${i + 1} ===\n${prompt.content}`)
      .join('\n\n');
    
    try {
      await navigator.clipboard.writeText(formatted);
      actions.addToast({
        type: 'success',
        message: 'All prompts copied to clipboard!'
      });
    } catch (error) {
      console.error('Copy all failed:', error);
      actions.addToast({
        type: 'error',
        message: 'Failed to copy prompts'
      });
    }
  };

  const LoadingState = () => (
    <div className="loading-state">
      <div className="loading-animation">
        <div className="loading-spinner" />
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <p className="loading-text">Crafting your technical prompts...</p>
    </div>
  );

  const EmptyState = () => (
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

  const ExecutionStatus = () => (
    <motion.div 
      className="execution-status"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="status-header">
        <h3 className="status-title">
          <Activity size={20} />
          Auto-Execution Progress
        </h3>
        <div className="progress-bar">
          <motion.div 
            className="progress-fill" 
            initial={{ width: 0 }}
            animate={{ width: `${executionProgress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      <div className="status-info">
        <p>Opening tabs and injecting prompts...</p>
        <small>{Math.round(executionProgress * 100)}% complete</small>
      </div>
    </motion.div>
  );

  const PromptCard = ({ prompt, index }) => (
    <motion.div 
      className="prompt-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <div className="prompt-header">
        <div className="prompt-number">
          {prompt.isCarouselSlide ? `📑 Carousel Slide ${prompt.number}` : `✨ Prompt ${prompt.number}`}
        </div>
        <motion.button 
          className="prompt-copy-btn" 
          onClick={() => copyPrompt(prompt)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Copy size={14} />
          Copy
        </motion.button>
      </div>
      <pre className="prompt-text">{prompt.content}</pre>
    </motion.div>
  );

  return (
    <motion.div 
      className="glass-card output-panel"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="card-header">
        <h2 className="card-title">
          <FileText size={20} />
          Generated Prompts
        </h2>
        <div className="header-actions">
          {generatedPrompts.length > 0 && (
            <>
              <motion.button 
                type="button" 
                className="btn btn-outline btn-sm" 
                onClick={copyAllPrompts}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Clipboard size={16} />
                <span className="btn-text">Copy All</span>
              </motion.button>
              <motion.button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={onExecuteAll}
                disabled={isExecuting}
                whileHover={!isExecuting ? { y: -2 } : {}}
                whileTap={!isExecuting ? { scale: 0.95 } : {}}
              >
                <Rocket size={16} />
                <span className="btn-text">
                  {isExecuting ? 'Executing...' : 'Execute All'}
                </span>
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {isExecuting && generatedPrompts.length === 0 ? (
        <LoadingState />
      ) : generatedPrompts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="prompts-container">
          {generatedPrompts.map((prompt, index) => (
            <PromptCard key={prompt.id} prompt={prompt} index={index} />
          ))}
        </div>
      )}

      {/* Execution Status */}
      {isExecuting && generatedPrompts.length > 0 && (
        <ExecutionStatus />
      )}
    </motion.div>
  );
};

export default OutputPanel;
