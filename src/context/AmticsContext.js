import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  generatedPrompts: [],
  isExecuting: false,
  executionProgress: 0,
  toasts: [],
  showModal: false,
  modalData: null,
  formData: {
    postType: '',
    size: '',
    platform: '',
    postDetails: '',
    promptCount: 3
  }
};

// Action types
const ActionTypes = {
  SET_FORM_DATA: 'SET_FORM_DATA',
  SET_GENERATED_PROMPTS: 'SET_GENERATED_PROMPTS',
  SET_EXECUTING: 'SET_EXECUTING',
  SET_EXECUTION_PROGRESS: 'SET_EXECUTION_PROGRESS',
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
  RESET_FORM: 'RESET_FORM'
};

// Reducer
function amticsReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_FORM_DATA:
      return {
        ...state,
        formData: { ...state.formData, ...action.payload }
      };
    case ActionTypes.SET_GENERATED_PROMPTS:
      return {
        ...state,
        generatedPrompts: action.payload
      };
    case ActionTypes.SET_EXECUTING:
      return {
        ...state,
        isExecuting: action.payload
      };
    case ActionTypes.SET_EXECUTION_PROGRESS:
      return {
        ...state,
        executionProgress: action.payload
      };
    case ActionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, { ...action.payload, id: Date.now() }]
      };
    case ActionTypes.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    case ActionTypes.SHOW_MODAL:
      return {
        ...state,
        showModal: true,
        modalData: action.payload
      };
    case ActionTypes.HIDE_MODAL:
      return {
        ...state,
        showModal: false,
        modalData: null
      };
    case ActionTypes.RESET_FORM:
      return {
        ...state,
        formData: initialState.formData,
        generatedPrompts: []
      };
    default:
      return state;
  }
}

// Context
const AmticsContext = createContext();

// Provider component
export function AmticsProvider({ children }) {
  const [state, dispatch] = useReducer(amticsReducer, initialState);

  // Actions
  const setFormData = useCallback((data) => {
    dispatch({ type: ActionTypes.SET_FORM_DATA, payload: data });
  }, []);

  const setGeneratedPrompts = useCallback((prompts) => {
    dispatch({ type: ActionTypes.SET_GENERATED_PROMPTS, payload: prompts });
  }, []);

  const setExecuting = useCallback((isExecuting) => {
    dispatch({ type: ActionTypes.SET_EXECUTING, payload: isExecuting });
  }, []);

  const setExecutionProgress = useCallback((progress) => {
    dispatch({ type: ActionTypes.SET_EXECUTION_PROGRESS, payload: progress });
  }, []);

  const addToast = useCallback((toast) => {
    dispatch({ type: ActionTypes.ADD_TOAST, payload: toast });
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      dispatch({ type: ActionTypes.REMOVE_TOAST, payload: toast.id || Date.now() });
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: ActionTypes.REMOVE_TOAST, payload: id });
  }, []);

  const showModal = useCallback((data) => {
    dispatch({ type: ActionTypes.SHOW_MODAL, payload: data });
  }, []);

  const hideModal = useCallback(() => {
    dispatch({ type: ActionTypes.HIDE_MODAL });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_FORM });
  }, []);

  // Data for post types, platforms, etc.
  const staticData = {
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

  const value = {
    ...state,
    staticData,
    actions: {
      setFormData,
      setGeneratedPrompts,
      setExecuting,
      setExecutionProgress,
      addToast,
      removeToast,
      showModal,
      hideModal,
      resetForm
    }
  };

  return (
    <AmticsContext.Provider value={value}>
      {children}
    </AmticsContext.Provider>
  );
}

// Hook to use the context
export function useAmtics() {
  const context = useContext(AmticsContext);
  if (!context) {
    throw new Error('useAmtics must be used within an AmticsProvider');
  }
  return context;
}

export default AmticsContext;
