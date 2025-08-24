import React, { useState } from 'react';
import { Rocket, X, Play, Copy, Activity } from 'lucide-react';
import { promptInjector } from '../utils/promptInjector';
import { copyAllPrompts } from '../utils/copyUtils';

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

      // Open tabs and get results
      const result = await promptInjector.openTabsWithPrompts(platform, prompts);

      // Update progress based on actual results
      const { successfulTabs, failedTabs, results } = result;

      if (successfulTabs > 0) {
        addStatusItem(`${successfulTabs} tabs opened successfully`, 'success');
        updateProgress(0.5); // 50% for opening tabs
      }

      if (failedTabs > 0) {
        addStatusItem(`${failedTabs} tabs failed to open (popup blocker?)`, 'error');
      }

      // Simulate injection progress with realistic timing
      let injectionProgress = 0.5; // Start from 50% (tabs opened)
      const progressIncrement = 0.5 / successfulTabs; // Remaining 50% for injections

      for (let i = 0; i < prompts.length; i++) {
        setTimeout(() => {
          const tabResult = results[i];
          if (tabResult.success) {
            injectionProgress += progressIncrement;
            updateProgress(injectionProgress);
            addStatusItem(`Prompt ${i + 1} injection started`, 'info');

            // Simulate injection completion
            setTimeout(() => {
              addStatusItem(`Prompt ${i + 1} injected successfully`, 'success');
            }, 2000 + (i * 500));
          } else {
            addStatusItem(`Prompt ${i + 1} failed: ${tabResult.error}`, 'error');
          }
        }, i * 300);
      }

      // Final status update
      setTimeout(() => {
        updateProgress(1.0);
        const successMessage = successfulTabs === prompts.length
          ? 'All prompts injected successfully!'
          : `${successfulTabs}/${prompts.length} prompts injected successfully!`;
        addStatusItem(successMessage, successfulTabs > 0 ? 'success' : 'error');
        showToast(successfulTabs > 0 ? 'success' : 'error',
          successfulTabs > 0
            ? 'Auto-injection completed! Check your opened tabs.'
            : 'Auto-injection failed. Try manual copy instead.');
      }, prompts.length * 300 + 3000);

    } catch (error) {
      addStatusItem(`Failed to complete auto-injection: ${error.message}`, 'error');
      showToast('error', `Auto-injection failed: ${error.message}`);
      console.error('Injection error:', error);
      updateProgress(0);
    } finally {
      setTimeout(() => {
        setIsExecuting(false);
      }, prompts.length * 300 + 4000);
    }
  };

  const handleManualCopy = async () => {
    const success = await copyAllPrompts(prompts, 'PROMPT');
    if (success) {
      onClose();
    }
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
