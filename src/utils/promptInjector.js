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

  async injectPromptIntoTab(tabWindow, prompt, platform) {
    try {
      // Wait for the page to fully load
      await this.waitForPageLoad(tabWindow);
      
      const platformConfig = this.getPlatformConfig(platform);
      const script = this.generateInjectionScript(prompt, platformConfig);
      
      // Inject the script into the tab
      tabWindow.eval(script);
    } catch (error) {
      console.error('Cross-origin injection failed, using clipboard fallback:', error);
      // Fallback to clipboard copy
      await this.copyToClipboard(prompt);
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

  generateInjectionScript(prompt, platformConfig) {
    const selectors = platformConfig.selectors;
    
    return `
      (function() {
        console.log('AMTICS: Attempting to inject prompt...');
        
        function findAndFillInput() {
          const selectors = ${JSON.stringify(selectors)};
          
          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
              console.log('AMTICS: Found input element:', selector);
              
              // Clear existing content
              element.value = '';
              element.innerHTML = '';
              
              // Set the prompt
              if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
                element.value = ${JSON.stringify(prompt)};
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
              } else {
                element.innerHTML = ${JSON.stringify(prompt)};
                element.dispatchEvent(new Event('input', { bubbles: true }));
              }
              
              // Focus the element
              element.focus();
              
              console.log('AMTICS: Prompt injected successfully');
              return true;
            }
          }
          return false;
        }
        
        // Try immediate injection
        if (!findAndFillInput()) {
          // Retry with delays for dynamic content
          setTimeout(findAndFillInput, 1000);
          setTimeout(findAndFillInput, 3000);
          setTimeout(findAndFillInput, 5000);
        }
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
