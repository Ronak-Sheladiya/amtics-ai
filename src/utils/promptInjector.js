// Enhanced prompt injection utility for automatic tab injection
export class PromptInjector {
  constructor() {
    this.openTabs = [];
    this.injectionDelay = 2000; // 2 seconds delay for page load
  }

  async openTabsWithPrompts(platform, prompts) {
    const platformConfig = this.getPlatformConfig(platform);
    this.openTabs = []; // Clear existing tabs

    try {
      console.log(`Opening ${prompts.length} tabs for ${platform}`);

      // Open all tabs first
      const tabPromises = [];
      for (let i = 0; i < prompts.length; i++) {
        const tabPromise = new Promise((resolve) => {
          setTimeout(() => {
            try {
              const newWindow = window.open(platformConfig.url, `amtics_${platform}_${Date.now()}_${i}`);

              if (newWindow) {
                console.log(`Tab ${i + 1} opened successfully`);
                this.openTabs.push({
                  window: newWindow,
                  prompt: prompts[i],
                  platform: platform,
                  index: i
                });

                // Schedule prompt injection after page loads
                setTimeout(() => {
                  this.injectPromptIntoTab(newWindow, prompts[i], platform, i);
                }, this.injectionDelay + (i * 1000)); // Stagger injections

                resolve({ success: true, index: i });
              } else {
                console.error(`Failed to open tab ${i + 1} - popup blocked?`);
                resolve({ success: false, index: i, error: 'Popup blocked' });
              }
            } catch (error) {
              console.error(`Error opening tab ${i + 1}:`, error);
              resolve({ success: false, index: i, error: error.message });
            }
          }, i * 300); // Reduced delay between tab openings
        });

        tabPromises.push(tabPromise);
      }

      // Wait for all tabs to be processed
      const results = await Promise.all(tabPromises);
      const successfulTabs = results.filter(r => r.success).length;
      const failedTabs = results.filter(r => !r.success).length;

      console.log(`${successfulTabs} tabs opened successfully, ${failedTabs} failed`);

      if (successfulTabs === 0) {
        throw new Error('No tabs could be opened. Please disable popup blocker and try again.');
      }

      return { successfulTabs, failedTabs, results };

    } catch (error) {
      console.error('Error in openTabsWithPrompts:', error);
      throw new Error(`Failed to open tabs: ${error.message}`);
    }
  }

  async injectPromptIntoTab(tabWindow, prompt, platform, index) {
    try {
      console.log(`Attempting to inject prompt ${index + 1} into ${platform} tab`);

      // Check if tab is still open
      if (tabWindow.closed) {
        console.error(`Tab ${index + 1} was closed before injection`);
        return { success: false, error: 'Tab was closed' };
      }

      // Wait for the page to fully load
      await this.waitForPageLoad(tabWindow);

      const platformConfig = this.getPlatformConfig(platform);

      try {
        // Try direct injection first
        const script = this.generateInjectionScript(prompt, platformConfig, index);
        tabWindow.eval(script);
        console.log(`Prompt ${index + 1} injected successfully via script`);
        return { success: true, method: 'script' };
      } catch (scriptError) {
        console.warn(`Script injection failed for tab ${index + 1}, trying postMessage:`, scriptError);

        // Try postMessage as fallback
        try {
          tabWindow.postMessage({
            type: 'AMTICS_INJECT_PROMPT',
            prompt: prompt,
            selectors: platformConfig.selectors,
            index: index
          }, '*');
          console.log(`Prompt ${index + 1} sent via postMessage`);
          return { success: true, method: 'postMessage' };
        } catch (postMessageError) {
          console.error(`PostMessage failed for tab ${index + 1}:`, postMessageError);
          // Final fallback - copy to clipboard
          await this.copyToClipboard(prompt);
          console.log(`Prompt ${index + 1} copied to clipboard as fallback`);
          return { success: true, method: 'clipboard' };
        }
      }
    } catch (error) {
      console.error(`Failed to inject prompt ${index + 1}:`, error);
      return { success: false, error: error.message };
    }
  }

  waitForPageLoad(tabWindow) {
    return new Promise((resolve) => {
      if (tabWindow.document.readyState === 'complete') {
        resolve();
      } else {
        tabWindow.addEventListener('load', resolve);
        // Fallback timeout
        setTimeout(resolve, 3000);
      }
    });
  }

  generateInjectionScript(prompt, platformConfig, index = 0) {
    const selectors = platformConfig.selectors;

    return `
      (function() {
        console.log('AMTICS: Attempting to inject prompt ${index + 1}...');

        let injectionAttempts = 0;
        const maxAttempts = 10;

        function findAndFillInput() {
          injectionAttempts++;
          console.log('AMTICS: Injection attempt', injectionAttempts);

          const selectors = ${JSON.stringify(selectors)};

          for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);

            // Try each matching element
            for (const element of elements) {
              if (element && isElementVisible(element) && !element.disabled && !element.readOnly) {
                console.log('AMTICS: Found suitable input element:', selector);

                try {
                  // Clear existing content
                  if (element.value !== undefined) element.value = '';
                  if (element.innerHTML !== undefined) element.innerHTML = '';
                  if (element.textContent !== undefined) element.textContent = '';

                  // Set the prompt with different methods
                  const promptText = ${JSON.stringify(prompt)};

                  if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
                    element.value = promptText;

                    // Trigger multiple events for compatibility
                    ['input', 'change', 'keyup', 'paste'].forEach(eventType => {
                      element.dispatchEvent(new Event(eventType, { bubbles: true }));
                    });
                  } else if (element.contentEditable === 'true' || element.getAttribute('contenteditable') === 'true') {
                    element.textContent = promptText;

                    // For contenteditable elements
                    ['input', 'change', 'keyup', 'DOMCharacterDataModified'].forEach(eventType => {
                      element.dispatchEvent(new Event(eventType, { bubbles: true }));
                    });
                  } else {
                    element.innerHTML = promptText;
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                  }

                  // Focus and select
                  element.focus();
                  if (element.select) element.select();

                  console.log('AMTICS: Prompt ${index + 1} injected successfully into', selector);

                  // Visual confirmation
                  const originalBorder = element.style.border;
                  element.style.border = '2px solid #00ff00';
                  setTimeout(() => {
                    element.style.border = originalBorder;
                  }, 2000);

                  return true;
                } catch (err) {
                  console.error('AMTICS: Error setting value:', err);
                  continue;
                }
              }
            }
          }
          return false;
        }

        function isElementVisible(element) {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          return rect.width > 0 && rect.height > 0 &&
                 style.display !== 'none' &&
                 style.visibility !== 'hidden' &&
                 style.opacity !== '0';
        }

        function attemptInjection() {
          if (injectionAttempts >= maxAttempts) {
            console.log('AMTICS: Max injection attempts reached for prompt ${index + 1}');
            return;
          }

          if (!findAndFillInput()) {
            // Retry with exponential backoff
            const delay = Math.min(1000 * Math.pow(1.5, injectionAttempts), 8000);
            console.log('AMTICS: Retrying injection in', delay, 'ms');
            setTimeout(attemptInjection, delay);
          }
        }

        // Start injection attempts
        attemptInjection();

        // Also listen for postMessage as backup
        window.addEventListener('message', function(event) {
          if (event.data.type === 'AMTICS_INJECT_PROMPT' && event.data.index === ${index}) {
            console.log('AMTICS: Received injection request via postMessage');
            findAndFillInput();
          }
        });
      })();
    `;
  }

  getPlatformConfig(platformId) {
    const configs = {
      gemini: {
        url: 'https://gemini.google.com/',
        selectors: [
          'textarea[placeholder*="Enter a prompt"]',
          'textarea[data-testid="prompt-textarea"]',
          '.ql-editor',
          'textarea',
          '[contenteditable="true"]'
        ]
      },
      chatgpt: {
        url: 'https://chat.openai.com/',
        selectors: [
          '#prompt-textarea',
          'textarea[placeholder*="Message"]',
          'textarea[data-id="root"]',
          '.ProseMirror',
          '[contenteditable="true"]'
        ]
      },
      canva: {
        url: 'https://www.canva.com/magic-design/',
        selectors: [
          'input[placeholder*="Describe"]',
          'textarea[placeholder*="Describe"]',
          '.magic-design-input',
          'input[type="text"]',
          'textarea'
        ]
      },
      midjourney: {
        url: 'https://discord.com/channels/662267976984297473/',
        selectors: [
          '[data-slate-editor="true"]',
          '.slateTextArea-1Mkdgw',
          'div[contenteditable="true"]',
          'textarea',
          '.textArea-12jD-V'
        ]
      },
      firefly: {
        url: 'https://firefly.adobe.com/',
        selectors: [
          'textarea[placeholder*="Describe"]',
          'input[placeholder*="prompt"]',
          '.prompt-input',
          'textarea',
          'input[type="text"]'
        ]
      }
    };

    return configs[platformId] || configs.gemini;
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      return false;
    }
  }

  closeAllTabs() {
    this.openTabs.forEach(tab => {
      if (tab.window && !tab.window.closed) {
        tab.window.close();
      }
    });
    this.openTabs = [];
  }
}

export const promptInjector = new PromptInjector();
