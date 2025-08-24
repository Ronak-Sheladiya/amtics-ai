// AMTICS Graphics Prompt Generator - JavaScript (Final Fix)
class PromptGenerator {
    constructor() {
        this.postTypes = {
            placement_card: {
                name: "Placement Card",
                designDNA: {
                    layout: "Portrait with circular photo + company logo",
                    colors: ["#003366", "#ffffff", "#d40075"],
                    typography: "Bold student name, clean company details",
                    elements: ["circular_photo", "company_logo", "congratulations_banner"]
                }
            },
            tech_event: {
                name: "Tech Event",
                designDNA: {
                    layout: "Dark tech backgrounds with neon accents",
                    colors: ["#0a0a0a", "#00ff88", "#6B46C1"],
                    typography: "Futuristic fonts, glitch effects",
                    elements: ["tech_graphics", "date_time_blocks", "registration_cta"]
                }
            },
            cultural_festival: {
                name: "Cultural Festival",
                designDNA: {
                    layout: "Traditional motifs with modern layout",
                    colors: ["#FF8C42", "#C41E3A", "#FFD700"],
                    typography: "Mix of Devanagari and English fonts",
                    elements: ["traditional_patterns", "festival_imagery", "bilingual_text"]
                }
            },
            campus_life: {
                name: "Campus Life",
                designDNA: {
                    layout: "Photo collages with overlaid text",
                    colors: ["#f5f5dc", "#deb887", "#d40075"],
                    typography: "Elegant serif for titles, sans-serif for body",
                    elements: ["photo_collage", "event_details", "campus_branding"]
                }
            },
            workshop_invite: {
                name: "Workshop Invite",
                designDNA: {
                    layout: "Speaker photo + event details + tech graphics",
                    colors: ["#003366", "#006837", "#ffffff"],
                    typography: "Modern sans-serif, professional feel",
                    elements: ["speaker_highlight", "agenda_details", "registration_info"]
                }
            },
            admission_promotion: {
                name: "Admission Promotion",
                designDNA: {
                    layout: "Split-screen or full-bleed hero image",
                    colors: ["#006837", "#00d4ff", "#ffd700"],
                    typography: "Large bold headlines, structured lists",
                    elements: ["course_details", "specializations", "contact_info"]
                }
            },
            achievement_highlight: {
                name: "Achievement Highlight",
                designDNA: {
                    layout: "Trophy/award imagery with statistics",
                    colors: ["#FFD700", "#d40075", "#003366"],
                    typography: "Bold numbers, clean descriptive text",
                    elements: ["achievement_stats", "award_imagery", "celebration_graphics"]
                }
            },
            brand_message: {
                name: "Brand Message",
                designDNA: {
                    layout: "Typography-focused with supporting imagery",
                    colors: ["#d40075", "#003366", "#006837"],
                    typography: "Large, impactful headlines",
                    elements: ["key_message", "brand_imagery", "institutional_logo"]
                }
            },
            social_cause: {
                name: "Social Cause",
                designDNA: {
                    layout: "Nature/cause imagery with call-to-action",
                    colors: ["#006837", "#228B22", "#32CD32"],
                    typography: "Friendly, approachable fonts",
                    elements: ["cause_imagery", "action_steps", "impact_metrics"]
                }
            },
            informational_carousel: {
                name: "Informational Carousel",
                designDNA: {
                    layout: "Multi-slide with consistent templates",
                    colors: ["#003366", "#d40075", "#ffffff"],
                    typography: "Clean, readable fonts with good contrast",
                    elements: ["slide_templates", "information_hierarchy", "navigation_indicators"]
                }
            }
        };

        this.platforms = {
            gemini: { name: "Gemini Imagen", url: "https://gemini.google.com/" },
            chatgpt: { name: "ChatGPT DALL-E", url: "https://chat.openai.com/" },
            canva: { name: "Canva Magic Design", url: "https://www.canva.com/magic-design/" },
            midjourney: { name: "Midjourney", url: "https://www.midjourney.com/" },
            firefly: { name: "Adobe Firefly", url: "https://firefly.adobe.com/" }
        };

        this.generatedPrompts = [];
        this.init();
    }

    init() {
        // Ensure DOM is ready before binding events
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindEvents();
                this.setupKeyboardShortcuts();
            });
        } else {
            this.bindEvents();
            this.setupKeyboardShortcuts();
        }
    }

    bindEvents() {
        const form = document.getElementById('promptForm');
        const generateBtn = document.getElementById('generateBtn');
        const executeBtn = document.getElementById('executeBtn');
        const copyAllBtn = document.getElementById('copyAllBtn');

        // Form submission
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Button clicks
        if (generateBtn) {
            generateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleFormSubmit(e);
            });
        }

        if (executeBtn) {
            executeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.executeAllPrompts();
            });
        }

        if (copyAllBtn) {
            copyAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.copyAllPrompts();
            });
        }

        // Fix all form element interactions
        this.fixAllFormElements();
    }

    fixAllFormElements() {
        // Reset all form controls to prevent conflicts
        const allSelects = document.querySelectorAll('select.form-control');
        const allInputs = document.querySelectorAll('input.form-control');
        const allTextareas = document.querySelectorAll('textarea.form-control');

        // Fix select elements
        allSelects.forEach(select => {
            // Remove any conflicting event listeners
            select.removeEventListener('click', this.preventConflicts);
            select.removeEventListener('focus', this.preventConflicts);
            
            // Add proper event handling
            select.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            
            select.addEventListener('focus', (e) => {
                e.stopPropagation();
            });
        });

        // Fix input elements
        allInputs.forEach(input => {
            input.addEventListener('click', (e) => {
                e.stopPropagation();
                input.focus();
            });
        });

        // Fix textarea elements
        allTextareas.forEach(textarea => {
            textarea.addEventListener('click', (e) => {
                e.stopPropagation();
                textarea.focus();
            });
            
            textarea.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });
        });

        // Prevent form-wide click conflicts
        const form = document.getElementById('promptForm');
        if (form) {
            form.addEventListener('click', (e) => {
                // Only prevent default if it's not a form control
                if (!e.target.classList.contains('form-control') && !e.target.classList.contains('btn')) {
                    e.stopPropagation();
                }
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Handle Ctrl+Enter for Execute All
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.executeAllPrompts();
                return;
            }

            // Handle Enter for form submission (but not in textarea)
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                const form = document.getElementById('promptForm');
                if (form && form.contains(e.target)) {
                    e.preventDefault();
                    this.handleFormSubmit(e);
                }
            }
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Get form data manually to ensure all values are captured
        const postType = document.getElementById('postType').value;
        const size = document.getElementById('size').value;
        const postDetails = document.getElementById('postDetails').value;
        const promptCount = parseInt(document.getElementById('promptCount').value);
        const platform = document.getElementById('platform').value;

        const data = {
            postType,
            size,
            postDetails,
            promptCount,
            platform
        };

        console.log('Form data:', data); // Debug log

        if (!this.validateForm(data)) {
            return;
        }

        this.generatePromptsProcess(data);
    }

    validateForm(data) {
        const errors = [];
        
        if (!data.postType) errors.push('Post Type');
        if (!data.size) errors.push('Size');
        if (!data.postDetails || data.postDetails.trim() === '') errors.push('Post Details');
        if (!data.platform) errors.push('AI Platform');
        
        if (errors.length > 0) {
            this.showToast('error', `Please fill in: ${errors.join(', ')}`);
            return false;
        }

        if (isNaN(data.promptCount) || data.promptCount < 1 || data.promptCount > 10) {
            this.showToast('error', 'Number of prompts must be between 1 and 10.');
            return false;
        }

        return true;
    }

    async generatePromptsProcess(data) {
        this.showLoading();
        
        try {
            await this.generatePrompts(data);
            this.displayPrompts();
            this.showToast('success', 'Prompts generated successfully!');
            document.getElementById('executeBtn').disabled = false;
        } catch (error) {
            this.showToast('error', 'Failed to generate prompts. Please try again.');
            console.error('Error generating prompts:', error);
        } finally {
            this.hideLoading();
        }
    }

    async generatePrompts(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.generatedPrompts = [];
                const postTypeConfig = this.postTypes[data.postType];
                
                for (let i = 0; i < data.promptCount; i++) {
                    const prompt = this.createTechnicalPrompt(data, postTypeConfig, i + 1);
                    this.generatedPrompts.push(prompt);
                }
                
                resolve();
            }, 1500); // Simulate API call delay
        });
    }

    createTechnicalPrompt(data, postTypeConfig, promptNumber) {
        const basePromptTemplates = this.getBasePromptTemplate(data.platform);
        const designElements = this.generateDesignElements(postTypeConfig, data);
        const technicalSpecs = this.getTechnicalSpecs(data.size);
        
        const variations = [
            "Create a professional",
            "Design a modern",
            "Generate a sleek",
            "Produce a striking",
            "Craft an elegant"
        ];
        
        const styleModifiers = [
            "with clean typography and balanced composition",
            "featuring bold visual hierarchy and contemporary aesthetics",
            "incorporating AMTICS brand guidelines and professional design principles",
            "with sophisticated color palette and modern layout techniques",
            "emphasizing visual impact and brand consistency"
        ];

        const variation = variations[(promptNumber - 1) % variations.length];
        const styleModifier = styleModifiers[(promptNumber - 1) % styleModifiers.length];
        
        let prompt = `${variation} ${postTypeConfig.name.toLowerCase()} graphic ${styleModifier}. `;
        
        // Add specific content requirements
        prompt += `Content: ${data.postDetails}. `;
        
        // Add design DNA elements
        prompt += `Design Requirements: ${designElements}. `;
        
        // Add technical specifications
        prompt += `Technical Specs: ${technicalSpecs}. `;
        
        // Add platform-specific instructions
        prompt += basePromptTemplates[Math.floor(Math.random() * basePromptTemplates.length)];
        
        // Add AMTICS branding
        prompt += " Ensure AMTICS institutional branding with colors magenta (#d40075), navy blue (#003366), and green (#006837).";
        
        return prompt;
    }

    getBasePromptTemplate(platform) {
        const templates = {
            gemini: [
                "High-resolution, professional design with crisp details and modern aesthetics.",
                "Ultra-detailed graphic with clean lines, perfect typography, and professional finish.",
                "Sophisticated design with premium quality and attention to visual hierarchy."
            ],
            chatgpt: [
                "Create a high-quality, professional graphic design with modern typography and clean layout.",
                "Design a polished, contemporary graphic with balanced composition and brand consistency.",
                "Generate a sophisticated visual with professional design principles and modern aesthetics."
            ],
            canva: [
                "Modern, clean design template with professional typography and balanced layout.",
                "Contemporary graphic design with brand-consistent colors and modern visual elements.",
                "Professional template design with clean aesthetics and visual impact."
            ],
            midjourney: [
                "--ar 1:1 --style raw --quality 2 --stylize 250 modern professional graphic design",
                "--ar 4:5 --style raw --quality 2 --stylize 200 contemporary institutional branding",
                "--ar 9:16 --style raw --quality 2 --stylize 300 clean professional layout"
            ],
            firefly: [
                "Professional graphic design, high quality, modern typography, clean composition.",
                "Contemporary design with brand consistency, professional finish, modern aesthetics.",
                "Sophisticated visual design with premium quality and professional standards."
            ]
        };
        
        return templates[platform] || templates.gemini;
    }

    generateDesignElements(postTypeConfig, data) {
        const { layout, colors, typography, elements } = postTypeConfig.designDNA;
        
        let designString = `Layout: ${layout}. `;
        designString += `Color scheme: ${colors.join(', ')}. `;
        designString += `Typography: ${typography}. `;
        designString += `Key elements: ${elements.join(', ')}. `;
        
        return designString;
    }

    getTechnicalSpecs(size) {
        const specs = {
            square: "1080x1080px square format, optimized for social media posts",
            portrait: "1080x1350px portrait orientation, ideal for detailed content display",
            story: "1080x1920px vertical format, perfect for stories and mobile viewing",
            landscape: "1920x1080px horizontal layout, suitable for wide content presentation",
            carousel: "1080x1080px multi-slide format with consistent template design"
        };
        
        return specs[size] || specs.square;
    }

    displayPrompts() {
        const container = document.getElementById('promptsContainer');
        const outputSection = document.getElementById('outputSection');
        const emptyState = document.getElementById('emptyState');
        
        container.innerHTML = '';
        
        this.generatedPrompts.forEach((prompt, index) => {
            const promptCard = this.createPromptCard(prompt, index + 1);
            container.appendChild(promptCard);
        });
        
        emptyState.classList.add('hidden');
        outputSection.classList.remove('hidden');
        outputSection.classList.add('fadeIn');
    }

    createPromptCard(prompt, number) {
        const card = document.createElement('div');
        card.className = 'prompt-card';
        
        card.innerHTML = `
            <div class="prompt-header">
                <span class="prompt-number">Prompt ${number}</span>
                <button class="prompt-copy-btn" data-index="${number - 1}">
                    Copy
                </button>
            </div>
            <pre class="prompt-text">${prompt}</pre>
        `;
        
        // Add event listener to the copy button
        const copyBtn = card.querySelector('.prompt-copy-btn');
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const index = parseInt(e.target.getAttribute('data-index'));
            this.copyPrompt(index);
        });
        
        return card;
    }

    async copyPrompt(index) {
        try {
            await navigator.clipboard.writeText(this.generatedPrompts[index]);
            this.showToast('success', `Prompt ${index + 1} copied to clipboard!`);
        } catch (error) {
            this.showToast('error', 'Failed to copy prompt. Please try again.');
        }
    }

    async copyAllPrompts() {
        const allPrompts = this.generatedPrompts
            .map((prompt, index) => `=== PROMPT ${index + 1} ===\n${prompt}`)
            .join('\n\n');
        
        try {
            await navigator.clipboard.writeText(allPrompts);
            this.showToast('success', 'All prompts copied to clipboard!');
        } catch (error) {
            this.showToast('error', 'Failed to copy prompts. Please try again.');
        }
    }

    async executeAllPrompts() {
        if (this.generatedPrompts.length === 0) {
            this.showToast('error', 'No prompts to execute. Generate prompts first.');
            return;
        }

        const platform = document.getElementById('platform').value;
        const platformConfig = this.platforms[platform];
        
        if (!platformConfig) {
            this.showToast('error', 'Invalid platform selected.');
            return;
        }

        this.showToast('info', `Opening ${this.generatedPrompts.length} tabs for ${platformConfig.name}...`);
        
        // Open tabs with delay to prevent browser blocking
        for (let i = 0; i < this.generatedPrompts.length; i++) {
            setTimeout(() => {
                const newWindow = window.open(platformConfig.url, `_blank_${i}`);
                
                if (!newWindow) {
                    this.showToast('error', `Failed to open tab ${i + 1}. Please check popup blocker settings.`);
                }
            }, i * 300); // Stagger tab opening
        }
        
        setTimeout(() => {
            this.showToast('success', 'All tabs opened! Copy the prompts and paste them into the respective platforms.');
        }, this.generatedPrompts.length * 300 + 1000);
    }

    showLoading() {
        document.getElementById('loadingState').classList.remove('hidden');
        document.getElementById('outputSection').classList.add('hidden');
        document.getElementById('emptyState').classList.add('hidden');
    }

    hideLoading() {
        document.getElementById('loadingState').classList.add('hidden');
    }

    showToast(type, message) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <span class="toast__icon">${icons[type]}</span>
            <p class="toast__message">${message}</p>
        `;
        
        container.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in-out forwards';
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }
}

// Add slideOut animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application
let promptGenerator;

function initializeApp() {
    promptGenerator = new PromptGenerator();
    window.promptGenerator = promptGenerator;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}