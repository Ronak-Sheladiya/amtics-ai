import React, { useState } from 'react';
import { Settings, Layers, Edit3, Maximize, Hash, Cpu, Sparkles, Rocket, Minus, Plus } from 'lucide-react';
import { generateAdvancedPrompts } from '../utils/promptGenerator';
import { showToast } from '../utils/toast';

export const PromptGenerator = ({ onPromptsGenerated, isGenerating, setIsGenerating }) => {
  const [formData, setFormData] = useState({
    postType: '',
    postDetails: '',
    size: '',
    promptCount: 3,
    platform: ''
  });

  const postTypes = [
    { id: "placement_card", name: "🎓 Placement Card", description: "Congratulatory achievement cards" },
    { id: "tech_event", name: "🚀 Tech Event", description: "Workshops & hackathons" },
    { id: "cultural_festival", name: "🎨 Cultural Festival", description: "Traditional celebrations" },
    { id: "campus_life", name: "📚 Campus Life", description: "Student activities & events" },
    { id: "workshop_invite", name: "🛠️ Workshop Invite", description: "Educational workshops" },
    { id: "admission_promotion", name: "📢 Admission Promotion", description: "Enrollment campaigns" },
    { id: "achievement_highlight", name: "🏆 Achievement Highlight", description: "Success stories" },
    { id: "brand_message", name: "💼 Brand Message", description: "Corporate communications" },
    { id: "social_cause", name: "🤝 Social Cause", description: "Community initiatives" },
    { id: "informational_carousel", name: "📑 Informational Carousel", description: "Multi-slide content" }
  ];

  const sizes = [
    { id: "square", name: "⬜ Square (1080x1080)", description: "Instagram posts", aspectRatio: "1:1" },
    { id: "portrait", name: "📱 Portrait (1080x1350)", description: "Feed optimization", aspectRatio: "4:5" },
    { id: "story", name: "📲 Story (1080x1920)", description: "Vertical content", aspectRatio: "9:16" },
    { id: "landscape", name: "🖥️ Landscape (1920x1080)", description: "Wide presentations", aspectRatio: "16:9" },
    { id: "carousel", name: "📑 Carousel (1080x1080)", description: "Multi-slide posts", aspectRatio: "1:1" }
  ];

  const platforms = [
    { id: "gemini", name: "🔮 Gemini Imagen", description: "Google's advanced AI generator" },
    { id: "chatgpt", name: "🤖 ChatGPT DALL-E", description: "OpenAI's image platform" },
    { id: "canva", name: "🎨 Canva Magic Design", description: "AI-powered design tool" },
    { id: "midjourney", name: "🎭 Midjourney", description: "Premium AI art via Discord" },
    { id: "firefly", name: "🔥 Adobe Firefly", description: "Adobe's creative AI suite" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumberChange = (increment) => {
    setFormData(prev => ({
      ...prev,
      promptCount: Math.max(1, Math.min(10, prev.promptCount + increment))
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.postType) errors.push('Post Type');
    if (!formData.size) errors.push('Size Format');
    if (!formData.platform) errors.push('AI Platform');
    if (!formData.postDetails.trim()) errors.push('Post Details');

    if (errors.length > 0) {
      showToast('error', `Please select/fill: ${errors.join(', ')}`);
      return false;
    }

    if (formData.promptCount < 1 || formData.promptCount > 10) {
      showToast('error', 'Prompt quantity must be between 1 and 10');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const prompts = generateAdvancedPrompts(formData);
      onPromptsGenerated(prompts, formData);
      
      showToast('success', `Generated ${formData.promptCount} professional prompts!`);
    } catch (error) {
      console.error('Error generating prompts:', error);
      showToast('error', 'Failed to generate prompts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-card input-panel">
      <div className="card-header">
        <h2 className="card-title">
          <Settings size={20} />
          Design Requirements
        </h2>
        <p className="card-subtitle">Configure your graphics specifications</p>
      </div>

      <form onSubmit={handleSubmit} className="generator-form">
        {/* Post Type Selection */}
        <div className="form-section">
          <label className="form-label">
            <Layers size={16} />
            Post Type
          </label>
          <select
            value={formData.postType}
            onChange={(e) => handleInputChange('postType', e.target.value)}
            className="form-control"
            required
          >
            <option value="">Select post type...</option>
            {postTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        {/* Post Details */}
        <div className="form-section">
          <label className="form-label">
            <Edit3 size={16} />
            Post Details
          </label>
          <textarea
            value={formData.postDetails}
            onChange={(e) => handleInputChange('postDetails', e.target.value)}
            className="form-input form-textarea"
            placeholder="Describe your specific requirements, messaging, visual elements, and any special instructions..."
            rows="4"
            required
          />
        </div>

        {/* Size and Count Row */}
        <div className="form-row">
          <div className="form-section">
            <label className="form-label">
              <Maximize size={16} />
              Size Format
            </label>
            <select
              value={formData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
              className="form-control"
              required
            >
              <option value="">Select size...</option>
              {sizes.map(size => (
                <option key={size.id} value={size.id}>{size.name}</option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label className="form-label">
              <Hash size={16} />
              Prompt Quantity
            </label>
            <div className="number-input">
              <button
                type="button"
                className="number-btn"
                onClick={() => handleNumberChange(-1)}
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={formData.promptCount}
                onChange={(e) => handleInputChange('promptCount', parseInt(e.target.value) || 1)}
                className="form-input number-field"
                min="1"
                max="10"
                required
              />
              <button
                type="button"
                className="number-btn"
                onClick={() => handleNumberChange(1)}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="form-section">
          <label className="form-label">
            <Cpu size={16} />
            AI Platform
          </label>
          <select
            value={formData.platform}
            onChange={(e) => handleInputChange('platform', e.target.value)}
            className="form-control"
            required
          >
            <option value="">Select platform...</option>
            {platforms.map(platform => (
              <option key={platform.id} value={platform.id}>{platform.name}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isGenerating}>
            <Sparkles size={18} />
            <span className="btn-text">
              {isGenerating ? 'Generating...' : 'Generate Prompts'}
            </span>
            <span className="btn-shortcut">Enter</span>
          </button>
        </div>
      </form>
    </div>
  );
};
