import React, { useState } from 'react';
import { PromptGenerator } from '../PromptGenerator';
import { PromptDisplay } from '../PromptDisplay';

export const HomePage = () => {
  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState(null);

  const handlePromptsGenerated = (prompts, data) => {
    setGeneratedPrompts(prompts);
    setFormData(data);
  };

  const handleAutoExecute = () => {
    if (generatedPrompts.length === 0) {
      return;
    }

    onShowModal({
      prompts: generatedPrompts,
      platform: formData.platform,
      platformName: getPlatformName(formData.platform)
    });
  };

  const getPlatformName = (platformId) => {
    const platforms = {
      gemini: 'Gemini Imagen',
      chatgpt: 'ChatGPT DALL-E',
      canva: 'Canva Magic Design',
      midjourney: 'Midjourney',
      firefly: 'Adobe Firefly'
    };
    return platforms[platformId] || platformId;
  };

  return (
    <div id="home-page" className="page active">
      <div className="container">
        <div className="generator-grid">
          <PromptGenerator
            onPromptsGenerated={handlePromptsGenerated}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
          <PromptDisplay
            prompts={generatedPrompts}
            isGenerating={isGenerating}
            onAutoExecute={handleAutoExecute}
            hasPrompts={generatedPrompts.length > 0}
          />
        </div>
      </div>
    </div>
  );
};
