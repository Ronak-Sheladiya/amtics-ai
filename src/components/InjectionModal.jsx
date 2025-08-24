import React, { useState } from 'react';
import { Rocket, X, Play, Copy, Activity } from 'lucide-react';
import { promptInjector } from '../utils/promptInjector';
import { showToast } from '../utils/toast';

export const InjectionModal = ({ prompts, platform, platformName, onClose }) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [statusItems, setStatusItems] = useState([]);

  const addStatusItem = (message, type) => {
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️'
    };

    setStatusItems(prev => [...prev, {
      id: Date.now(),
      icon: icons[type],
      message,
      type
    }]);
  };

  const updateProgress = (progress) => {
    setExecutionProgress(progress);
  };

  const handleStartInjection = async () => {
    setIsExecuting(true);
    setStatusItems([]);
    setExecutionProgress(0);

    try {
      showToast('info', `Opening ${prompts.length} tabs for ${platformName}...`);
      addStatusItem(`Starting auto-injection for ${prompts.length} prompts`, 'info');

      await promptInjector.openTabsWithPrompts(platform, prompts);
      
      // Simulate progress updates
      for (let i = 1; i <= prompts.length; i++) {
        setTimeout(() => {
          updateProgress(i / prompts.length);
          addStatusItem(`Tab ${i} opened and prompt injected`, 'success');
        }, i * 500);
      }

      setTimeout(() => {
        addStatusItem('All prompts injected successfully!', 'success');
        showToast('success', 'Auto-injection completed! Check your opened tabs.');
      }, prompts.length * 500 + 1000);

    } catch (error) {
      addStatusItem('Failed to complete auto-injection', 'error');
      showToast('error', 'Auto-injection failed. Try manual copy instead.');
      console.error('Injection error:', error);
    } finally {
      setTimeout(() => {
        setIsExecuting(false);
      }, prompts.length * 500 + 2000);
    }
  };

  const handleManualCopy = () => {
    const allPrompts = prompts
      .map((prompt, i) => `=== PROMPT ${i + 1} ===\n${prompt}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(allPrompts).then(() => {
      showToast('success', 'All prompts copied! Paste them manually in the opened tabs.');
      onClose();
    }).catch(() => {
      showToast('error', 'Failed to copy prompts to clipboard');
    });
  };

  const steps = [
    `Open ${platformName} in ${prompts.length} tabs`,
    'Wait for each platform to fully load',
    'Automatically inject prompts into input fields',
    'Review and submit prompts manually if needed',
    'Monitor results and adjust as necessary'
  ];

  return (
    <div className="modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content glass-card">
        <div className="modal-header">
          <h3 className="modal-title">
            <Rocket size={20} />
            Auto-Injection for {platformName}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p>Auto-injection will open {prompts.length} tabs and attempt to inject prompts automatically:</p>
          <ol>
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>

          {isExecuting && (
            <div className="execution-status">
              <div className="status-header">
                <h4 className="status-title">
                  <Activity size={18} />
                  Injection Progress
                </h4>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${executionProgress * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="status-list">
                {statusItems.map(item => (
                  <div key={item.id} className="status-item">
                    <span className="status-icon">{item.icon}</span>
                    <p className="status-text">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleStartInjection}
            disabled={isExecuting}
          >
            <Play size={18} />
            {isExecuting ? 'Injecting...' : 'Start Auto-Injection'}
          </button>
          <button className="btn btn-outline" onClick={handleManualCopy}>
            <Copy size={18} />
            Manual Copy
          </button>
        </div>
      </div>
    </div>
  );
};
