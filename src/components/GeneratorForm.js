import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Layers, Edit3, Maximize, Hash, Cpu, Sparkles, Rocket, Minus, Plus } from 'lucide-react';
import { useAmtics } from '../context/AmticsContext';

const GeneratorForm = ({ onGenerate, isGenerating }) => {
  const { formData, staticData, actions } = useAmtics();
  const [localFormData, setLocalFormData] = useState(formData);

  const handleInputChange = (field, value) => {
    const newData = { ...localFormData, [field]: value };
    setLocalFormData(newData);
    actions.setFormData(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const errors = [];
    if (!localFormData.postType) errors.push('Post Type');
    if (!localFormData.size) errors.push('Size Format');
    if (!localFormData.platform) errors.push('AI Platform');
    if (!localFormData.postDetails.trim()) errors.push('Post Details');
    
    if (errors.length > 0) {
      actions.addToast({
        type: 'error',
        message: `Please select/fill: ${errors.join(', ')}`
      });
      return;
    }

    if (localFormData.promptCount < 1 || localFormData.promptCount > 10) {
      actions.addToast({
        type: 'error',
        message: 'Prompt quantity must be between 1 and 10'
      });
      return;
    }

    onGenerate(localFormData);
  };

  const adjustPromptCount = (delta) => {
    const newCount = Math.max(1, Math.min(10, localFormData.promptCount + delta));
    handleInputChange('promptCount', newCount);
  };

  return (
    <motion.div 
      className="glass-card input-panel"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
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
            value={localFormData.postType} 
            onChange={(e) => handleInputChange('postType', e.target.value)}
            className="form-control" 
            required
          >
            <option value="">Select post type...</option>
            {staticData.postTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.icon} {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Post Details */}
        <div className="form-section">
          <label className="form-label">
            <Edit3 size={16} />
            Post Details
          </label>
          <div className="input-wrapper">
            <textarea 
              value={localFormData.postDetails}
              onChange={(e) => handleInputChange('postDetails', e.target.value)}
              className="form-input form-textarea"
              placeholder="Describe your specific requirements, messaging, visual elements, and any special instructions..."
              rows="4"
              required
            />
          </div>
        </div>

        {/* Size and Count Row */}
        <div className="form-row">
          <div className="form-section">
            <label className="form-label">
              <Maximize size={16} />
              Size Format
            </label>
            <select 
              value={localFormData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
              className="form-control" 
              required
            >
              <option value="">Select size...</option>
              {staticData.sizes.map(size => (
                <option key={size.id} value={size.id}>
                  {size.preview} {size.name} ({size.dimensions})
                </option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label className="form-label">
              <Hash size={16} />
              Prompt Quantity
            </label>
            <div className="input-wrapper">
              <div className="number-input">
                <motion.button 
                  type="button" 
                  className="number-btn" 
                  onClick={() => adjustPromptCount(-1)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus size={16} />
                </motion.button>
                <input 
                  type="number" 
                  value={localFormData.promptCount}
                  onChange={(e) => handleInputChange('promptCount', parseInt(e.target.value) || 1)}
                  className="form-input number-field" 
                  min="1" 
                  max="10" 
                  required 
                />
                <motion.button 
                  type="button" 
                  className="number-btn" 
                  onClick={() => adjustPromptCount(1)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={16} />
                </motion.button>
              </div>
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
            value={localFormData.platform}
            onChange={(e) => handleInputChange('platform', e.target.value)}
            className="form-control" 
            required
          >
            <option value="">Select platform...</option>
            {staticData.platforms.map(platform => (
              <option key={platform.id} value={platform.id}>
                {platform.icon} {platform.name}
              </option>
            ))}
          </select>
        </div>

        {/* Carousel Info */}
        {localFormData.size === 'carousel' && (
          <motion.div 
            className="carousel-info"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="info-card">
              <div className="info-icon">📑</div>
              <div className="info-content">
                <h4>Carousel Format Selected</h4>
                <p>Each prompt will be optimized for individual slides with consistent visual storytelling across {localFormData.promptCount} slides.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="form-actions">
          <motion.button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isGenerating}
            whileHover={!isGenerating ? { y: -2 } : {}}
            whileTap={!isGenerating ? { y: 0, scale: 0.98 } : {}}
          >
            <Sparkles size={18} />
            <span className="btn-text">
              {isGenerating ? 'Generating...' : 'Generate Prompts'}
            </span>
            <span className="btn-shortcut">Enter</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default GeneratorForm;
