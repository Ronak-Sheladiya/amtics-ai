// AMTICS Graphics AI - Professional Design Platform with Navigation
class AmticsGraphicsAI {
    constructor() {
        this.data = this.initializeData();
        this.state = {
            generatedPrompts: [],
            selectedPostType: null,
            selectedSize: null,
            selectedPlatform: null,
            isExecuting: false,
            executionProgress: 0,
            currentPage: 'home'
        };

        this.platformInjectors = this.initializePlatformInjectors();
        this.init();
    }

    initializeData() {
        return {
            postTypes: [
                {
                    id: "placement_card",
                    name: "Placement Card",
                    icon: "🎓",
                    description: "Congratulatory achievement cards",
                    designDNA: {
                        layout: "Portrait with circular photo + company logo",
                        colors: ["#003366", "#ffffff", "#d40075"],
                        typography: "Bold student name, clean company details",
                        elements: ["circular_photo", "company_logo", "congratulations_banner"],
                        mood: "Professional, celebratory, trustworthy"
                    }
                },
                {
                    id: "tech_event",
                    name: "Tech Event",
                    icon: "🚀",
                    description: "Workshops & hackathons",
                    designDNA: {
                        layout: "Dark tech backgrounds with neon accents",
                        colors: ["#0a0a0a", "#00ff88", "#6B46C1"],
                        typography: "Futuristic fonts, glitch effects",
                        elements: ["tech_graphics", "date_time_blocks", "registration_cta"],
                        mood: "Cutting-edge, energetic, innovative"
                    }
                },
                {
                    id: "cultural_festival",
                    name: "Cultural Festival",
                    icon: "🎨",
                    description: "Traditional celebrations",
                    designDNA: {
                        layout: "Traditional motifs with modern layout",
                        colors: ["#FF8C42", "#C41E3A", "#FFD700"],
                        typography: "Mix of traditional and modern fonts",
                        elements: ["traditional_patterns", "festival_imagery", "bilingual_text"],
                        mood: "Cultural, warm, respectful"
                    }
                },
                {
                    id: "campus_life",
                    name: "Campus Life",
                    icon: "📚",
                    description: "Student activities & events",
                    designDNA: {
                        layout: "Photo collages with overlaid text",
                        colors: ["#f5f5dc", "#deb887", "#d40075"],
                        typography: "Elegant serif for titles, sans-serif for body",
                        elements: ["photo_collage", "event_details", "campus_branding"],
                        mood: "Friendly, authentic, community-focused"
                    }
                },
                {
                    id: "workshop_invite",
                    name: "Workshop Invite",
                    icon: "🛠️",
                    description: "Educational workshops",
                    designDNA: {
                        layout: "Speaker photo + event details + tech graphics",
                        colors: ["#003366", "#006837", "#ffffff"],
                        typography: "Modern sans-serif, professional feel",
                        elements: ["speaker_highlight", "agenda_details", "registration_info"],
                        mood: "Educational, professional, engaging"
                    }
                }
            ],
            
            platforms: [
                {
                    id: "gemini",
                    name: "Gemini Imagen",
                    icon: "🔮",
                    url: "https://gemini.google.com/",
                    description: "Google's advanced AI generator"
                },
                {
                    id: "chatgpt",
                    name: "ChatGPT DALL-E",
                    icon: "🤖",
                    url: "https://chat.openai.com/",
                    description: "OpenAI's image platform"
                },
                {
                    id: "canva",
                    name: "Canva Magic",
                    icon: "🎨",
                    url: "https://www.canva.com/magic-design/",
                    description: "AI-powered design tool"
                },
                {
                    id: "midjourney",
                    name: "Midjourney",
                    icon: "🎭",
                    url: "https://discord.com/channels/662267976984297473/",
                    description: "Premium AI art via Discord"
                },
                {
                    id: "firefly",
                    name: "Adobe Firefly",
                    icon: "🔥",
                    url: "https://firefly.adobe.com/",
                    description: "Adobe's creative AI suite"
                }
            ],
            
            sizes: [
                { id: "square", name: "Square", dimensions: "1080x1080", description: "Instagram posts", preview: "⬜", aspectRatio: "1:1" },
                { id: "portrait", name: "Portrait", dimensions: "1080x1350", description: "Feed optimization", preview: "📱", aspectRatio: "4:5" },
                { id: "story", name: "Story", dimensions: "1080x1920", description: "Vertical content", preview: "📲", aspectRatio: "9:16" },
                { id: "landscape", name: "Landscape", dimensions: "1920x1080", description: "Wide presentations", preview: "🖥️", aspectRatio: "16:9" },
                { id: "carousel", name: "Carousel", dimensions: "1080x1080", description: "Multi-slide posts", preview: "📑", aspectRatio: "1:1" }
            ]
        };
    }

    initializePlatformInjectors() {
        // Simplified injectors that open tabs and show instructions
        return {
            gemini: () => this.openPlatformTabs('gemini'),
            chatgpt: () => this.openPlatformTabs('chatgpt'),
            canva: () => this.openPlatformTabs('canva'),
            midjourney: () => this.openPlatformTabs('midjourney'),
            firefly: () => this.openPlatformTabs('firefly')
        };
    }

    init() {
        this.waitForDOM(() => {
            console.log('DOM ready, initializing interface...');
            this.setupNavigation();
            this.renderInterface();
            this.bindEvents();
            this.setupKeyboardShortcuts();
            console.log('Initialization complete');
        });
    }

    waitForDOM(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    renderInterface() {
        // Only initialize form elements if we're on the home page
        if (this.state.currentPage === 'home') {
            this.setupNumberInput();
        }
    }

    setupNavigation() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('[data-page]');
            if (navLink) {
                e.preventDefault();
                this.navigateToPage(navLink.dataset.page);
            }
        });

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    navigateToPage(pageName) {
        console.log('Navigating to page:', pageName);

        // Update current page state
        this.state.currentPage = pageName;

        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation active states
        document.querySelectorAll('.nav-link, .footer-link').forEach(link => {
            link.classList.remove('active');
        });

        document.querySelectorAll(`[data-page="${pageName}"]`).forEach(link => {
            link.classList.add('active');
        });

        // Re-initialize Lucide icons for new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // If navigating to home, ensure form functionality is ready
        if (pageName === 'home') {
            setTimeout(() => {
                this.renderInterface();
            }, 100);
        }
    }

    setupNumberInput() {
        const decreaseBtn = document.querySelector('[data-action="decrease"]');
        const increaseBtn = document.querySelector('[data-action="increase"]');
        const input = document.getElementById('promptCount');

        if (decreaseBtn && input) {
            decreaseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const current = parseInt(input.value) || 1;
                input.value = Math.max(1, current - 1);
            });
        }

        if (increaseBtn && input) {
            increaseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const current = parseInt(input.value) || 1;
                input.value = Math.min(10, current + 1);
            });
        }
    }

    // Form handling methods for the updated HTML structure
    handleFormFieldChange(field, value) {
        switch(field) {
            case 'postType':
                this.state.selectedPostType = value;
                break;
            case 'size':
                this.state.selectedSize = value;
                break;
            case 'platform':
                this.state.selectedPlatform = value;
                break;
        }

        console.log(`Updated ${field}:`, value);
    }

    bindEvents() {
        console.log('Binding events...');
        
        const form = document.getElementById('promptForm');
        const generateBtn = document.getElementById('generateBtn');
        const executeBtn = document.getElementById('executeBtn');
        const copyAllBtn = document.getElementById('copyAllBtn');

        if (form) {
            form.addEventListener('submit', (e) => {
                console.log('Form submitted');
                this.handleFormSubmit(e);
            });
        }

        if (generateBtn) {
            generateBtn.addEventListener('click', (e) => {
                console.log('Generate button clicked');
                e.preventDefault();
                e.stopPropagation();
                this.handleFormSubmit(e);
            });
        }

        if (executeBtn) {
            executeBtn.addEventListener('click', (e) => {
                console.log('Execute button clicked');
                e.preventDefault();
                e.stopPropagation();
                this.executeAutoInjection();
            });
        }

        if (copyAllBtn) {
            copyAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.copyAllPrompts();
            });
        }

        // Modal events
        this.bindModalEvents();
        console.log('Events bound successfully');
    }

    bindModalEvents() {
        const modal = document.getElementById('injectionModal');
        const closeBtn = document.getElementById('closeModal');
        const closeBtn2 = document.getElementById('closeModal2');
        const startBtn = document.getElementById('startInjection');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('Modal close button 1 clicked');
                this.hideModal();
            });
        }

        if (closeBtn2) {
            closeBtn2.addEventListener('click', () => {
                console.log('Modal close button 2 clicked');
                this.hideModal();
            });
        }

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('Start injection button clicked');
                this.startAutoInjection();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    console.log('Modal overlay clicked');
                    this.hideModal();
                }
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter for auto-execution
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                console.log('Ctrl+Enter pressed');
                this.executeAutoInjection();
                return;
            }

            // Enter for form submission (but not in textarea)
            if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA') {
                const form = document.getElementById('promptForm');
                if (form && form.contains(e.target)) {
                    e.preventDefault();
                    console.log('Enter key pressed in form');
                    this.handleFormSubmit(e);
                }
            }
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Handling form submission...');
        
        const formData = this.gatherFormData();
        console.log('Form data gathered:', formData);
        
        if (!this.validateForm(formData)) {
            console.log('Form validation failed');
            return;
        }

        console.log('Form validation passed, generating prompts...');
        await this.generatePrompts(formData);
    }

    gatherFormData() {
        const postTypeEl = document.getElementById('postType');
        const sizeEl = document.getElementById('size');
        const platformEl = document.getElementById('platform');
        const postDetailsEl = document.getElementById('postDetails');
        const promptCountEl = document.getElementById('promptCount');

        const data = {
            postType: postTypeEl ? postTypeEl.value : '',
            size: sizeEl ? sizeEl.value : '',
            platform: platformEl ? platformEl.value : '',
            postDetails: postDetailsEl ? postDetailsEl.value.trim() : '',
            promptCount: parseInt(promptCountEl ? promptCountEl.value : '3') || 3
        };

        console.log('Gathered form data:', data);
        return data;
    }

    validateForm(data) {
        const errors = [];
        
        if (!data.postType) errors.push('Post Type');
        if (!data.size) errors.push('Size Format');
        if (!data.platform) errors.push('AI Platform');
        if (!data.postDetails) errors.push('Post Details');
        
        if (errors.length > 0) {
            this.showToast('error', `Please select/fill: ${errors.join(', ')}`);
            return false;
        }

        if (data.promptCount < 1 || data.promptCount > 10) {
            this.showToast('error', 'Prompt quantity must be between 1 and 10');
            return false;
        }

        return true;
    }

    async generatePrompts(data) {
        console.log('Starting prompt generation...');
        this.showLoading();
        
        try {
            // Simulate realistic processing delay
            await this.delay(2000);
            
            this.state.generatedPrompts = [];
            const postType = this.data.postTypes.find(p => p.id === data.postType);
            
            console.log('Found post type:', postType);
            
            for (let i = 0; i < data.promptCount; i++) {
                const prompt = this.createAdvancedPrompt(data, postType, i + 1);
                this.state.generatedPrompts.push(prompt);
                console.log(`Generated prompt ${i + 1}`);
            }
            
            console.log(`Generated ${this.state.generatedPrompts.length} prompts total`);
            
            // Force display prompts
            setTimeout(() => {
                this.hideLoading();
                this.displayPrompts();
                this.enableExecution();
                this.showToast('success', `Generated ${data.promptCount} professional prompts!`);
            }, 500);
            
        } catch (error) {
            console.error('Error during prompt generation:', error);
            this.hideLoading();
            this.showToast('error', 'Failed to generate prompts. Please try again.');
        }
    }

    createAdvancedPrompt(data, postType, promptNumber) {
        const platform = this.data.platforms.find(p => p.id === data.platform);
        const size = this.data.sizes.find(s => s.id === data.size);
        
        // Advanced prompt engineering with variation
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

        return prompt;
    }

    displayPrompts() {
        console.log('Displaying prompts...');
        
        const container = document.getElementById('promptsContainer');
        const emptyState = document.getElementById('emptyState');
        const copyAllBtn = document.getElementById('copyAllBtn');
        
        if (!container) {
            console.error('Prompts container not found!');
            return;
        }

        // Clear container and populate with prompts
        container.innerHTML = '';
        
        this.state.generatedPrompts.forEach((prompt, index) => {
            const card = this.createPromptCard(prompt, index + 1);
            container.appendChild(card);
        });
        
        // Show/hide elements
        if (emptyState) {
            emptyState.classList.add('hidden');
        }
        
        container.classList.remove('hidden');
        container.classList.add('fadeIn');
        
        if (copyAllBtn) {
            copyAllBtn.style.display = 'inline-flex';
        }
        
        console.log(`${this.state.generatedPrompts.length} prompts displayed successfully`);
    }

    createPromptCard(prompt, number) {
        const card = document.createElement('div');
        card.className = 'prompt-card fadeIn';
        
        card.innerHTML = `
            <div class="prompt-header">
                <div class="prompt-number">Prompt ${number}</div>
                <button class="prompt-copy-btn" data-index="${number - 1}">
                    <span>📋</span> Copy
                </button>
            </div>
            <pre class="prompt-text">${prompt}</pre>
        `;
        
        const copyBtn = card.querySelector('.prompt-copy-btn');
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.copyPrompt(number - 1);
        });
        
        return card;
    }

    async copyPrompt(index) {
        try {
            await navigator.clipboard.writeText(this.state.generatedPrompts[index]);
            this.showToast('success', `Prompt ${index + 1} copied successfully!`);
        } catch (error) {
            console.error('Copy failed:', error);
            this.showToast('error', 'Failed to copy prompt');
        }
    }

    async copyAllPrompts() {
        if (this.state.generatedPrompts.length === 0) {
            this.showToast('error', 'No prompts to copy');
            return;
        }
        
        const formatted = this.state.generatedPrompts
            .map((prompt, i) => `=== AMTICS PROMPT ${i + 1} ===\n${prompt}`)
            .join('\n\n');
        
        try {
            await navigator.clipboard.writeText(formatted);
            this.showToast('success', 'All prompts copied to clipboard!');
        } catch (error) {
            console.error('Copy all failed:', error);
            this.showToast('error', 'Failed to copy prompts');
        }
    }

    enableExecution() {
        const executeBtn = document.getElementById('executeBtn');
        if (executeBtn) {
            executeBtn.disabled = false;
        }
    }

    async executeAutoInjection() {
        console.log('Execute auto injection called');
        
        if (this.state.generatedPrompts.length === 0) {
            this.showToast('error', 'Generate prompts first before executing');
            return;
        }

        if (this.state.isExecuting) {
            this.showToast('info', 'Execution already in progress...');
            return;
        }

        console.log('Showing injection modal...');
        this.showInjectionModal();
    }

    showInjectionModal() {
        console.log('Attempting to show injection modal...');
        
        const modal = document.getElementById('injectionModal');
        const stepsList = document.getElementById('injectionSteps');
        const platform = this.data.platforms.find(p => p.id === this.state.selectedPlatform);
        
        console.log('Modal element:', modal);
        console.log('Steps list:', stepsList);
        console.log('Selected platform:', platform);
        
        if (!modal) {
            console.error('Modal not found!');
            return;
        }
        
        if (!stepsList) {
            console.error('Steps list not found!');
            return;
        }
        
        if (!platform) {
            console.error('Platform not found!');
            return;
        }

        const steps = [
            `Open ${platform.name} in ${this.state.generatedPrompts.length} tabs`,
            'Wait for each platform to fully load',
            'Copy prompts from the generated list',
            'Paste prompts into each platform\'s input field',
            'Submit prompts manually or use auto-injection'
        ];

        stepsList.innerHTML = steps.map(step => `<li>${step}</li>`).join('');
        
        // Force show modal
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        
        console.log('Modal should now be visible');
    }

    hideModal() {
        console.log('Hiding modal...');
        const modal = document.getElementById('injectionModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    }

    async startAutoInjection() {
        console.log('Starting auto injection...');
        this.hideModal();
        this.state.isExecuting = true;
        
        const platform = this.data.platforms.find(p => p.id === this.state.selectedPlatform);
        
        this.showExecutionStatus();
        this.showToast('info', `Opening ${this.state.generatedPrompts.length} tabs for ${platform.name}...`);
        
        try {
            await this.openPlatformTabs(platform.id);
            this.showToast('success', 'Tabs opened! Copy prompts and paste them manually.');
        } catch (error) {
            this.showToast('error', 'Failed to open tabs. Check popup blocker settings.');
            console.error('Tab opening error:', error);
        } finally {
            this.state.isExecuting = false;
        }
    }

    async openPlatformTabs(platformId) {
        const platform = this.data.platforms.find(p => p.id === platformId);
        const prompts = this.state.generatedPrompts;
        
        // Open tabs with staggered timing to prevent popup blocking
        for (let i = 0; i < prompts.length; i++) {
            setTimeout(() => {
                const newWindow = window.open(platform.url, `_blank_${Date.now()}_${i}`);
                if (!newWindow) {
                    this.addStatusItem(`Failed to open tab ${i + 1}`, 'error');
                } else {
                    this.addStatusItem(`Tab ${i + 1} opened successfully`, 'success');
                }
                
                this.updateExecutionProgress((i + 1) / prompts.length);
            }, i * 500); // 500ms delay between tabs
        }
    }

    showExecutionStatus() {
        const statusDiv = document.getElementById('executionStatus');
        
        if (statusDiv) {
            statusDiv.classList.remove('hidden');
            statusDiv.classList.add('fadeIn');
        }
        
        // Reset progress
        this.updateExecutionProgress(0);
        const statusList = document.getElementById('statusList');
        if (statusList) {
            statusList.innerHTML = '';
        }
    }

    updateExecutionProgress(progress) {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${progress * 100}%`;
        }
        this.state.executionProgress = progress;
    }

    addStatusItem(message, type) {
        const statusList = document.getElementById('statusList');
        if (!statusList) return;

        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️'
        };

        const item = document.createElement('div');
        item.className = 'status-item fadeIn';
        item.innerHTML = `
            <span class="status-icon">${icons[type]}</span>
            <p class="status-text">${message}</p>
        `;

        statusList.appendChild(item);
        statusList.scrollTop = statusList.scrollHeight;
    }

    showLoading() {
        console.log('Showing loading state...');
        
        const loadingState = document.getElementById('loadingState');
        const emptyState = document.getElementById('emptyState');
        const promptsContainer = document.getElementById('promptsContainer');
        
        if (loadingState) {
            loadingState.classList.remove('hidden');
            loadingState.style.display = 'flex';
            console.log('Loading state shown');
        } else {
            console.error('Loading state element not found');
        }
        
        if (emptyState) {
            emptyState.classList.add('hidden');
        }
        
        if (promptsContainer) {
            promptsContainer.classList.add('hidden');
        }
    }

    hideLoading() {
        console.log('Hiding loading state...');
        
        const loadingState = document.getElementById('loadingState');
        if (loadingState) {
            loadingState.classList.add('hidden');
            loadingState.style.display = 'none';
            console.log('Loading state hidden');
        }
    }

    showToast(type, message) {
        const container = document.getElementById('toastContainer');
        if (!container) {
            console.error('Toast container not found');
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <p class="toast-message">${message}</p>
        `;
        
        container.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in-out forwards';
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application
let amticsApp;

function initializeAmticsApp() {
    console.log('Initializing AMTICS Graphics AI Application...');
    
    try {
        amticsApp = new AmticsGraphicsAI();
        
        // Global access for debugging
        if (typeof window !== 'undefined') {
            window.amticsApp = amticsApp;
        }
        
        console.log('AMTICS App initialized successfully');
    } catch (error) {
        console.error('Failed to initialize AMTICS App:', error);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAmticsApp);
} else {
    initializeAmticsApp();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AmticsGraphicsAI;
}
