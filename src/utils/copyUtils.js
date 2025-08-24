// Enhanced copy utility with fallback support for older browsers
import { showToast } from './toast';

/**
 * Copy text to clipboard with modern API and fallback support
 * @param {string} text - Text to copy
 * @param {string} successMessage - Success toast message
 * @param {string} errorMessage - Error toast message
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text, successMessage = 'Copied to clipboard!', errorMessage = 'Failed to copy to clipboard') => {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      showToast('success', successMessage);
      return true;
    } else {
      // Fallback for older browsers or non-secure contexts
      return fallbackCopyTextToClipboard(text, successMessage, errorMessage);
    }
  } catch (error) {
    console.error('Clipboard API failed, trying fallback:', error);
    return fallbackCopyTextToClipboard(text, successMessage, errorMessage);
  }
};

/**
 * Fallback copy method using document.execCommand
 * @param {string} text - Text to copy
 * @param {string} successMessage - Success toast message
 * @param {string} errorMessage - Error toast message
 * @returns {boolean} - Success status
 */
function fallbackCopyTextToClipboard(text, successMessage, errorMessage) {
  try {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Style the textarea to be invisible
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.style.width = '1px';
    textArea.style.height = '1px';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    textArea.setAttribute('readonly', '');
    textArea.setAttribute('tabindex', '-1');
    
    // Add to DOM, select, copy, and remove
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, text.length);
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      showToast('success', successMessage);
      return true;
    } else {
      throw new Error('execCommand copy failed');
    }
  } catch (error) {
    console.error('Fallback copy failed:', error);
    showToast('error', errorMessage);
    
    // Ultimate fallback - show prompt to copy manually
    showManualCopyPrompt(text);
    return false;
  }
}

/**
 * Show a prompt dialog for manual copying as ultimate fallback
 * @param {string} text - Text to copy manually
 */
function showManualCopyPrompt(text) {
  const shortText = text.length > 100 ? text.substring(0, 100) + '...' : text;
  const shouldCopy = window.confirm(
    `Automatic copying failed. Would you like to manually copy the text?\n\nPreview: "${shortText}"\n\nClick OK to see the full text in a new window.`
  );
  
  if (shouldCopy) {
    // Open a new window with selectable text
    const newWindow = window.open('', '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Copy Text - AMTICS</title>
            <style>
              body { 
                font-family: 'Inter', sans-serif; 
                padding: 20px; 
                background: #f8f9fa;
                color: #333;
              }
              .copy-container {
                background: white;
                border: 2px solid #d40075;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .copy-text {
                font-family: monospace;
                white-space: pre-wrap;
                word-wrap: break-word;
                font-size: 14px;
                line-height: 1.5;
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #e9ecef;
                margin-top: 10px;
              }
              .instructions {
                color: #6c757d;
                font-size: 14px;
                margin-bottom: 10px;
              }
              .select-all-btn {
                background: #d40075;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                margin-top: 10px;
              }
              .select-all-btn:hover {
                background: #b8005f;
              }
            </style>
          </head>
          <body>
            <div class="copy-container">
              <h2>📋 Manual Copy Required</h2>
              <p class="instructions">
                Select all the text below and copy it manually (Ctrl+A then Ctrl+C on Windows, or Cmd+A then Cmd+C on Mac):
              </p>
              <button class="select-all-btn" onclick="selectAllText()">Select All Text</button>
              <div class="copy-text" id="copyText">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </div>
            <script>
              function selectAllText() {
                const textElement = document.getElementById('copyText');
                const range = document.createRange();
                range.selectNodeContents(textElement);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
              }
              // Auto-select on load
              setTimeout(selectAllText, 500);
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  }
}

/**
 * Copy single prompt with enhanced feedback
 * @param {string} prompt - Prompt text to copy
 * @param {number} index - Prompt index (0-based)
 * @returns {Promise<boolean>} - Success status
 */
export const copySinglePrompt = async (prompt, index) => {
  const successMessage = `Prompt ${index + 1} copied successfully! 📋`;
  const errorMessage = `Failed to copy prompt ${index + 1}`;
  
  return await copyToClipboard(prompt, successMessage, errorMessage);
};

/**
 * Copy all prompts with formatting
 * @param {Array<string>} prompts - Array of prompts
 * @param {string} title - Title prefix for formatting
 * @returns {Promise<boolean>} - Success status
 */
export const copyAllPrompts = async (prompts, title = 'AMTICS') => {
  if (!prompts || prompts.length === 0) {
    showToast('error', 'No prompts to copy');
    return false;
  }
  
  const formatted = prompts
    .map((prompt, i) => `=== ${title} PROMPT ${i + 1} ===\n${prompt}`)
    .join('\n\n');
  
  const successMessage = `All ${prompts.length} prompts copied to clipboard! 🎉`;
  const errorMessage = 'Failed to copy all prompts';
  
  return await copyToClipboard(formatted, successMessage, errorMessage);
};

/**
 * Copy formatted prompt with metadata
 * @param {string} prompt - Prompt text
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<boolean>} - Success status
 */
export const copyPromptWithMetadata = async (prompt, metadata = {}) => {
  const { platform, size, postType, timestamp } = metadata;
  
  let formattedPrompt = `=== AMTICS AI PROMPT ===\n`;
  if (timestamp) formattedPrompt += `Generated: ${new Date(timestamp).toLocaleString()}\n`;
  if (platform) formattedPrompt += `Platform: ${platform}\n`;
  if (postType) formattedPrompt += `Post Type: ${postType}\n`;
  if (size) formattedPrompt += `Size: ${size}\n`;
  formattedPrompt += `\n${prompt}`;
  
  const successMessage = 'Prompt with metadata copied successfully! 📊';
  const errorMessage = 'Failed to copy prompt with metadata';
  
  return await copyToClipboard(formattedPrompt, successMessage, errorMessage);
};

/**
 * Check if clipboard API is supported
 * @returns {boolean} - Support status
 */
export const isClipboardSupported = () => {
  return !!(navigator.clipboard && window.isSecureContext);
};

/**
 * Get clipboard support info for debugging
 * @returns {Object} - Support information
 */
export const getClipboardSupportInfo = () => {
  return {
    clipboardAPI: !!navigator.clipboard,
    secureContext: !!window.isSecureContext,
    execCommand: !!document.execCommand,
    userAgent: navigator.userAgent,
    protocol: window.location.protocol
  };
};
