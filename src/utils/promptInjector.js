// Enhanced prompt injection utility for automatic tab injection
export class PromptInjector {
  constructor() {
    this.openTabs = [];
    this.injectionDelay = 2000; // 2 seconds delay for page load
  }

  async openTabsWithPrompts(platform, prompts) {
    const platformConfig = this.getPlatformConfig(platform);
    
    try {
      // Open tabs with staggered timing
      for (let i = 0; i < prompts.length; i++) {
        setTimeout(async () => {
          const newWindow = window.open(platformConfig.url, `amtics_tab_${Date.now()}_${i}`);
          
          if (newWindow) {
            this.openTabs.push({
              window: newWindow,
              prompt: prompts[i],
              platform: platform,
              index: i
            });

            // Wait for page to load then inject prompt
            setTimeout(() => {
              this.injectPromptIntoTab(newWindow, prompts[i], platform);
            }, this.injectionDelay);
          }
        }, i * 500); // 500ms delay between tab openings
      }
    } catch (error) {
      console.error('Error opening tabs:', error);
      throw new Error('Failed to open tabs. Please check popup blocker settings.');
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
