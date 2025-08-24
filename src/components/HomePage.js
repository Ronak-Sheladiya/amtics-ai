import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAmtics } from '../context/AmticsContext';
import GeneratorForm from './GeneratorForm';
import OutputPanel from './OutputPanel';

const HomePage = () => {
  const { 
    generatedPrompts, 
    isExecuting, 
    formData,
    staticData,
    actions 
  } = useAmtics();

  const generatePrompts = useCallback(async (data) => {
    console.log('Starting prompt generation with data:', data);
    
    actions.setExecuting(true);
    actions.addToast({
      type: 'info',
      message: 'Generating prompts...'
    });

    try {
      // Simulate realistic processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const prompts = [];
      const postType = staticData.postTypes.find(p => p.id === data.postType);
      const platform = staticData.platforms.find(p => p.id === data.platform);
      const size = staticData.sizes.find(s => s.id === data.size);
      
      console.log('Found:', { postType, platform, size });
      
      for (let i = 0; i < data.promptCount; i++) {
        const prompt = createAdvancedPrompt(data, postType, platform, size, i + 1);
        prompts.push(prompt);
        console.log(`Generated prompt ${i + 1}`);
      }
      
      console.log(`Generated ${prompts.length} prompts total`);
      
      actions.setGeneratedPrompts(prompts);
      actions.addToast({
        type: 'success',
        message: `Generated ${data.promptCount} professional prompts!`
      });
      
    } catch (error) {
      console.error('Error during prompt generation:', error);
      actions.addToast({
        type: 'error',
        message: 'Failed to generate prompts. Please try again.'
      });
    } finally {
      actions.setExecuting(false);
    }
  }, [actions, staticData]);

  const createAdvancedPrompt = (data, postType, platform, size, promptNumber) => {
    const creativePrefixes = [
      "Create a sophisticated",
      "Design a professional",
      "Generate an impactful",
      "Craft a premium",
      "Produce a striking"
    ];

    const technicalStyles = [
      "with clean typography and balanced visual hierarchy",
      "featuring modern design principles and brand consistency",
      "incorporating contemporary aesthetics and professional polish",
      "with sophisticated color theory and compositional excellence",
      "emphasizing visual impact and design system adherence"
    ];

    const prefix = creativePrefixes[(promptNumber - 1) % creativePrefixes.length];
    const style = technicalStyles[(promptNumber - 1) % technicalStyles.length];

    let prompt = `${prefix} ${postType.name.toLowerCase()} graphic ${style}. `;
    
    // Content specification
    prompt += `Content Requirements: ${data.postDetails}. `;
    
    // Design DNA integration
    const { designDNA } = postType;
    prompt += `Design DNA: ${designDNA.layout}. Color palette: ${designDNA.colors.join(', ')}. `;
    prompt += `Typography style: ${designDNA.typography}. Key elements: ${designDNA.elements.join(', ')}. `;
    prompt += `Visual mood: ${designDNA.mood}. `;
    
    // Technical specifications
    prompt += `Technical specs: ${size.dimensions}px (${size.aspectRatio} aspect ratio), `;
    prompt += `optimized for ${size.description.toLowerCase()}. `;
    
    // Carousel-specific handling
    if (data.size === 'carousel') {
      prompt += `CAROUSEL FORMAT: Design as slide ${promptNumber} of ${data.promptCount}. `;
      prompt += `Each slide should maintain visual consistency while presenting distinct content segments. `;
      prompt += `Include slide progression indicators and cohesive storytelling elements. `;
    }
    
    // Platform-specific enhancements
    if (data.platform === 'midjourney') {
      prompt += `--ar ${size.aspectRatio} --style raw --quality 2 --stylize ${200 + (promptNumber * 50)} `;
    }
    
    // AMTICS branding mandate
    prompt += `MANDATORY: Integrate AMTICS institutional branding with primary colors: `;
    prompt += `magenta (#d40075), navy blue (#003366), and green (#006837). `;
    prompt += `Maintain professional design standards with modern visual hierarchy, `;
    prompt += `clean composition, and premium quality finish. `;
    
    // Advanced creative direction
    const creativeVariations = [
      "Emphasize bold visual impact with contemporary design language.",
      "Focus on clean minimalism with strategic color placement.",
      "Highlight institutional excellence through sophisticated layouts.",
      "Showcase modern professionalism with dynamic visual elements.",
      "Create memorable brand presence through thoughtful design choices."
    ];
    
    prompt += creativeVariations[(promptNumber - 1) % creativeVariations.length];

    return {
      id: `prompt-${promptNumber}`,
      number: promptNumber,
      content: prompt,
      isCarouselSlide: data.size === 'carousel'
    };
  };

  const executeAllPrompts = useCallback(async () => {
    if (generatedPrompts.length === 0) {
      actions.addToast({
        type: 'error',
        message: 'Generate prompts first before executing'
      });
      return;
    }

    if (isExecuting) {
      actions.addToast({
        type: 'info',
        message: 'Execution already in progress...'
      });
      return;
    }

    actions.setExecuting(true);
    actions.setExecutionProgress(0);

    const platform = staticData.platforms.find(p => p.id === formData.platform);
    
    try {
      // Open individual tabs for each prompt
      const individualTabs = [];
      for (let i = 0; i < generatedPrompts.length; i++) {
        setTimeout(() => {
          const newWindow = window.open(platform.url, `_blank_individual_${Date.now()}_${i}`, 'noopener,noreferrer');
          if (newWindow) {
            individualTabs.push(newWindow);
            
            // Try to inject the prompt into the tab (this may be limited by CORS policies)
            setTimeout(() => {
              try {
                if (newWindow && !newWindow.closed) {
                  // For platforms that support it, try to set the prompt in the clipboard
                  navigator.clipboard.writeText(generatedPrompts[i].content).then(() => {
                    console.log(`Prompt ${i + 1} copied to clipboard for tab ${i + 1}`);
                  }).catch(err => {
                    console.warn('Clipboard write failed:', err);
                  });
                }
              } catch (error) {
                console.warn('Tab injection failed:', error);
              }
            }, 1000);
            
            actions.addToast({
              type: 'success',
              message: `Tab ${i + 1} opened with prompt ${i + 1}`
            });
          } else {
            actions.addToast({
              type: 'error',
              message: `Failed to open tab ${i + 1}. Check popup blocker.`
            });
          }
          
          actions.setExecutionProgress((i + 1) / (generatedPrompts.length + 1));
        }, i * 500); // 500ms delay between tabs
      }

      // Open combined tab with all prompts
      setTimeout(() => {
        const combinedPrompts = generatedPrompts
          .map((prompt, i) => `=== AMTICS PROMPT ${i + 1} ===\n${prompt.content}`)
          .join('\n\n');
        
        const combinedWindow = window.open('about:blank', '_blank_combined', 'noopener,noreferrer');
        if (combinedWindow) {
          combinedWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>AMTICS - All Generated Prompts</title>
                <style>
                  body { 
                    font-family: 'Inter', sans-serif; 
                    line-height: 1.6; 
                    padding: 20px; 
                    background: #0f0f23;
                    color: #fff;
                    max-width: 1000px;
                    margin: 0 auto;
                  }
                  .header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: rgba(212, 0, 117, 0.1);
                    border-radius: 12px;
                    border: 1px solid rgba(212, 0, 117, 0.3);
                  }
                  .header h1 {
                    color: #d40075;
                    margin-bottom: 10px;
                  }
                  .prompt-section {
                    margin-bottom: 30px;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                  }
                  .prompt-header {
                    color: #d40075;
                    font-weight: bold;
                    margin-bottom: 15px;
                    font-size: 18px;
                  }
                  .prompt-content {
                    white-space: pre-wrap;
                    font-family: monospace;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 15px;
                    border-radius: 8px;
                    border-left: 4px solid #d40075;
                  }
                  .copy-btn {
                    background: #006837;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-top: 10px;
                    font-size: 12px;
                  }
                  .copy-btn:hover {
                    background: #005528;
                  }
                  .copy-all-btn {
                    background: #d40075;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    margin: 20px auto;
                    display: block;
                  }
                  .copy-all-btn:hover {
                    background: #b8005f;
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>🎨 AMTICS AI Graphic Designer</h1>
                  <p>Generated Prompts Collection</p>
                  <p><small>Total Prompts: ${generatedPrompts.length}</small></p>
                </div>
                <button class="copy-all-btn" onclick="copyAllPrompts()">📋 Copy All Prompts</button>
                ${generatedPrompts.map((prompt, i) => `
                  <div class="prompt-section">
                    <div class="prompt-header">
                      ${prompt.isCarouselSlide ? `📑 Carousel Slide ${i + 1}` : `✨ Prompt ${i + 1}`}
                    </div>
                    <div class="prompt-content" id="prompt-${i}">${prompt.content}</div>
                    <button class="copy-btn" onclick="copyPrompt(${i})">📋 Copy This Prompt</button>
                  </div>
                `).join('')}
                
                <script>
                  function copyPrompt(index) {
                    const content = document.getElementById('prompt-' + index).textContent;
                    navigator.clipboard.writeText(content).then(() => {
                      alert('Prompt ' + (index + 1) + ' copied to clipboard!');
                    }).catch(err => {
                      console.error('Copy failed:', err);
                      // Fallback for older browsers
                      const textarea = document.createElement('textarea');
                      textarea.value = content;
                      document.body.appendChild(textarea);
                      textarea.select();
                      document.execCommand('copy');
                      document.body.removeChild(textarea);
                      alert('Prompt ' + (index + 1) + ' copied to clipboard!');
                    });
                  }
                  
                  function copyAllPrompts() {
                    const allPrompts = ${JSON.stringify(combinedPrompts)};
                    navigator.clipboard.writeText(allPrompts).then(() => {
                      alert('All prompts copied to clipboard!');
                    }).catch(err => {
                      console.error('Copy failed:', err);
                      const textarea = document.createElement('textarea');
                      textarea.value = allPrompts;
                      document.body.appendChild(textarea);
                      textarea.select();
                      document.execCommand('copy');
                      document.body.removeChild(textarea);
                      alert('All prompts copied to clipboard!');
                    });
                  }
                </script>
              </body>
            </html>
          `);
          combinedWindow.document.close();
          
          actions.addToast({
            type: 'success',
            message: 'Combined prompts tab opened successfully!'
          });
        } else {
          actions.addToast({
            type: 'error',
            message: 'Failed to open combined tab. Check popup blocker.'
          });
        }
        
        actions.setExecutionProgress(1);
      }, generatedPrompts.length * 500 + 1000);

      actions.addToast({
        type: 'info',
        message: `Opening ${generatedPrompts.length + 1} tabs...`
      });
      
    } catch (error) {
      console.error('Execution error:', error);
      actions.addToast({
        type: 'error',
        message: 'Failed to execute prompts. Check popup blocker settings.'
      });
    } finally {
      setTimeout(() => {
        actions.setExecuting(false);
      }, generatedPrompts.length * 500 + 2000);
    }
  }, [generatedPrompts, isExecuting, formData, staticData, actions]);

  return (
    <div className="container">
      <motion.div 
        className="generator-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GeneratorForm 
          onGenerate={generatePrompts}
          isGenerating={isExecuting}
        />
        <OutputPanel 
          onExecuteAll={executeAllPrompts}
          isExecuting={isExecuting}
        />
      </motion.div>
    </div>
  );
};

export default HomePage;
