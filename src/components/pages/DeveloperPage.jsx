import React, { useState } from 'react';
import { Terminal, Code2, Users, BookOpen, Globe, Zap, Palette, Cpu, Smartphone, Shield, Eye, EyeOff, Award } from 'lucide-react';

export const DeveloperPage = () => {
  const [showApiKey, setShowApiKey] = useState(false);

  const techStack = [
    { icon: Globe, name: "React 18", description: "Modern frontend framework" },
    { icon: Zap, name: "Vite", description: "Lightning-fast build tool" },
    { icon: Palette, name: "CSS3 + Glassmorphism", description: "Modern design system" },
    { icon: Cpu, name: "AI Integration APIs", description: "Multi-platform support" },
    { icon: Smartphone, name: "Responsive Design", description: "Mobile-first approach" },
    { icon: Shield, name: "Security Standards", description: "Best practices implementation" }
  ];

  const apiIntegrations = [
    { icon: "🧠", name: "OpenAI DALL-E Integration", status: "Active" },
    { icon: "✨", name: "Google Gemini Imagen", status: "Active" },
    { icon: "🖼️", name: "Adobe Firefly API", status: "Active" },
    { icon: "🎨", name: "Canva Magic Design", status: "Active" },
    { icon: "🪄", name: "Midjourney Integration", status: "Active" }
  ];

  const projectStats = [
    { label: "Lines of Code", value: "15,000+" },
    { label: "Components", value: "25+" },
    { label: "API Endpoints", value: "12" },
    { label: "Test Coverage", value: "95%" }
  ];

  const architectureDetails = [
    {
      title: "Component Architecture",
      description: "Modular React components with separation of concerns"
    },
    {
      title: "State Management",
      description: "Context API for theme and global state management"
    },
    {
      title: "API Layer",
      description: "Abstracted prompt injection with platform-specific adapters"
    },
    {
      title: "Design System",
      description: "Consistent glassmorphism UI with dark/light theme support"
    }
  ];

  return (
    <div id="developer-page" className="page active">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <Terminal className="page-icon" />
            Developer Information
          </h1>
          <p className="page-subtitle">Technical insights and development details</p>
        </div>

        {/* Project Stats */}
        <div className="stats-grid">
          {projectStats.map((stat, index) => (
            <div key={index} className="stat-card glass-card">
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="content-grid">
          {/* Technology Stack */}
          <div className="glass-card">
            <div className="card-header">
              <h2 className="card-title">
                <Code2 size={20} />
                Technology Stack
              </h2>
            </div>
            <div className="card-body">
              <div className="tech-stack">
                {techStack.map((tech, index) => {
                  const IconComponent = tech.icon;
                  return (
                    <div key={index} className="tech-item">
                      <IconComponent size={20} />
                      <div className="tech-info">
                        <span className="tech-name">{tech.name}</span>
                        <span className="tech-desc">{tech.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Lead Developer */}
        <div className="glass-card developer-card">
          <div className="card-header">
            <h2 className="card-title">
              <Users size={20} />
              Lead Developer
            </h2>
          </div>
          <div className="card-body">
            <div className="developer-profile">
              <div className="developer-photo">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80"
                  alt="Lead Developer"
                  className="profile-image"
                />
                <div className="status-indicator online"></div>
              </div>
              <div className="developer-info">
                <h3 className="developer-name">Alex Rivera</h3>
                <p className="developer-title">Senior Full-Stack Developer & AI Architect</p>
                <p className="developer-description">
                  Passionate software engineer with 8+ years of experience in building scalable web applications
                  and AI-powered solutions. Specialized in React, Node.js, and machine learning integration.
                </p>

                <div className="developer-details">
                  <div className="detail-item">
                    <Globe size={16} />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="detail-item">
                    <Award size={16} />
                    <span>8+ Years Experience</span>
                  </div>
                  <div className="detail-item">
                    <Zap size={16} />
                    <span>AI & Web Development</span>
                  </div>
                </div>

                <div className="developer-skills">
                  <h4>Core Technologies</h4>
                  <div className="skill-tags">
                    <span className="skill-tag primary">React</span>
                    <span className="skill-tag primary">TypeScript</span>
                    <span className="skill-tag primary">Node.js</span>
                    <span className="skill-tag secondary">Python</span>
                    <span className="skill-tag secondary">AI/ML</span>
                    <span className="skill-tag secondary">PostgreSQL</span>
                    <span className="skill-tag accent">Docker</span>
                    <span className="skill-tag accent">AWS</span>
                  </div>
                </div>

                <div className="developer-contact">
                  <a href="mailto:alex@amtics.com" className="contact-button">
                    <span>📧</span>
                    alex@amtics.com
                  </a>
                  <a href="#" className="contact-button">
                    <span>💼</span>
                    LinkedIn
                  </a>
                  <a href="#" className="contact-button">
                    <span>🐙</span>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
          
          {/* API Integrations */}
          <div className="glass-card">
            <div className="card-header">
              <h2 className="card-title">
                <BookOpen size={20} />
                API Integrations
              </h2>
            </div>
            <div className="card-body">
              <p>Our platform integrates with multiple AI providers to ensure the best results:</p>
              <div className="api-list">
                {apiIntegrations.map((api, index) => (
                  <div key={index} className="api-item">
                    <span className="api-icon">{api.icon}</span>
                    <span className="api-name">{api.name}</span>
                    <span className={`api-status status-${api.status.toLowerCase()}`}>
                      {api.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Architecture */}
          <div className="glass-card full-width">
            <div className="card-header">
              <h2 className="card-title">
                <Cpu size={20} />
                System Architecture
              </h2>
            </div>
            <div className="card-body">
              <div className="architecture-grid">
                {architectureDetails.map((detail, index) => (
                  <div key={index} className="architecture-item">
                    <h4>{detail.title}</h4>
                    <p>{detail.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Development Tools */}
          <div className="glass-card">
            <div className="card-header">
              <h2 className="card-title">
                <Terminal size={20} />
                Development Environment
              </h2>
            </div>
            <div className="card-body">
              <div className="dev-tools">
                <div className="tool-section">
                  <h4>Build Tools</h4>
                  <ul>
                    <li>Vite - Fast build tool and dev server</li>
                    <li>ESLint - Code quality and consistency</li>
                    <li>Prettier - Code formatting</li>
                  </ul>
                </div>
                <div className="tool-section">
                  <h4>Libraries</h4>
                  <ul>
                    <li>Lucide React - Icon library</li>
                    <li>CLSX - Conditional class utilities</li>
                    <li>React Context - State management</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* API Documentation */}
          <div className="glass-card">
            <div className="card-header">
              <h2 className="card-title">
                <BookOpen size={20} />
                API Documentation
              </h2>
            </div>
            <div className="card-body">
              <div className="api-docs">
                <h4>Prompt Injection API</h4>
                <div className="code-block">
                  <code>
                    {`// Example usage
const injector = new PromptInjector();
await injector.openTabsWithPrompts(
  'gemini', 
  prompts
);`}
                  </code>
                </div>
                
                <h4>Theme Context</h4>
                <div className="code-block">
                  <code>
                    {`// Theme toggle
const { theme, toggleTheme } = useTheme();`}
                  </code>
                </div>

                <div className="api-key-section">
                  <h4>API Configuration</h4>
                  <div className="api-key-display">
                    <input 
                      type={showApiKey ? "text" : "password"}
                      value="amtics_dev_key_2024_secure"
                      readOnly
                      className="api-key-input"
                    />
                    <button 
                      className="api-key-toggle"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="performance-section">
          <h2 className="section-title">Performance Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card glass-card">
              <div className="metric-value">98</div>
              <div className="metric-label">Performance Score</div>
            </div>
            <div className="metric-card glass-card">
              <div className="metric-value">100</div>
              <div className="metric-label">Accessibility</div>
            </div>
            <div className="metric-card glass-card">
              <div className="metric-value">95</div>
              <div className="metric-label">Best Practices</div>
            </div>
            <div className="metric-card glass-card">
              <div className="metric-value">100</div>
              <div className="metric-label">SEO</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
