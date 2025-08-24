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
