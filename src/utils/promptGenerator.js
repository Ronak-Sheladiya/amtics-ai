// Enhanced prompt generation with carousel slide-wise support
export const generateAdvancedPrompts = (formData) => {
  const { postType, postDetails, size, platform, promptCount } = formData;
  
  const postTypeData = getPostTypeData(postType);
  const sizeData = getSizeData(size);
  
  const prompts = [];
  
  // Special handling for carousel - generate slide-wise prompts
  if (size === 'carousel') {
    return generateCarouselPrompts(formData, postTypeData, sizeData);
  }
  
  // Regular prompt generation for other formats
  for (let i = 0; i < promptCount; i++) {
    const prompt = createAdvancedPrompt(formData, postTypeData, sizeData, i + 1);
    prompts.push(prompt);
  }
  
  return prompts;
};

const generateCarouselPrompts = (formData, postTypeData, sizeData) => {
  const { postDetails, promptCount, platform } = formData;
  const prompts = [];
  
  // Parse content for slide structure
  const slideContent = parseContentForSlides(postDetails, promptCount);
  
  for (let i = 0; i < promptCount; i++) {
    const slideNumber = i + 1;
    const isFirstSlide = i === 0;
    const isLastSlide = i === promptCount - 1;
    
    let prompt = createCarouselSlidePrompt({
      ...formData,
      postTypeData,
      sizeData,
      slideNumber,
      slideContent: slideContent[i],
      isFirstSlide,
      isLastSlide,
      totalSlides: promptCount
    });
    
    prompts.push(prompt);
  }
  
  return prompts;
};

const parseContentForSlides = (content, slideCount) => {
  // Split content intelligently for slides
  const sentences = content.split(/[.!?]+/).filter(s => s.trim());
  const slidesContent = [];
  
  if (sentences.length <= slideCount) {
    // One sentence per slide
    for (let i = 0; i < slideCount; i++) {
      slidesContent.push(sentences[i] || `Slide ${i + 1} content`);
    }
  } else {
    // Distribute sentences across slides
    const sentencesPerSlide = Math.ceil(sentences.length / slideCount);
    for (let i = 0; i < slideCount; i++) {
      const startIndex = i * sentencesPerSlide;
      const endIndex = Math.min(startIndex + sentencesPerSlide, sentences.length);
      slidesContent.push(sentences.slice(startIndex, endIndex).join('. '));
    }
  }
  
  return slidesContent;
};

const createCarouselSlidePrompt = ({
  postTypeData,
  sizeData,
  slideNumber,
  slideContent,
  isFirstSlide,
  isLastSlide,
  totalSlides,
  platform
}) => {
  const creativePrefixes = [
    "Design a professional carousel slide",
    "Create an engaging slide design",
    "Craft a cohesive carousel panel",
    "Generate a branded slide layout",
    "Produce a compelling slide design"
  ];

  const slideTypes = {
    1: "title/introduction slide",
    last: "conclusion/call-to-action slide",
    middle: "content/information slide"
  };

  const getSlideType = () => {
    if (isFirstSlide) return slideTypes[1];
    if (isLastSlide) return slideTypes.last;
    return slideTypes.middle;
  };

  let prompt = `${creativePrefixes[(slideNumber - 1) % creativePrefixes.length]} `;
  prompt += `for ${postTypeData.name.toLowerCase()}, `;
  prompt += `Slide ${slideNumber} of ${totalSlides} (${getSlideType()}). `;
  
  // Slide-specific content
  prompt += `Content for this slide: "${slideContent}". `;
  
  // Design consistency for carousel
  prompt += `CAROUSEL DESIGN REQUIREMENTS: `;
  prompt += `Maintain consistent visual identity across all slides. `;
  prompt += `Use unified color palette, typography, and layout structure. `;
  
  if (isFirstSlide) {
    prompt += `As the opening slide, include prominent branding, eye-catching title, and visual hook. `;
  } else if (isLastSlide) {
    prompt += `As the final slide, include clear call-to-action, contact information, and closure elements. `;
  } else {
    prompt += `As a content slide, focus on clear information hierarchy and visual flow. `;
  }
  
  // Design DNA integration
  const { designDNA } = postTypeData;
  prompt += `Design DNA: ${designDNA.layout}. `;
  prompt += `Color palette: ${designDNA.colors.join(', ')}. `;
  prompt += `Typography: ${designDNA.typography}. `;
  prompt += `Key elements: ${designDNA.elements.join(', ')}. `;
  prompt += `Visual mood: ${designDNA.mood}. `;
  
  // Technical specifications
  prompt += `Technical specs: ${sizeData.dimensions}px (${sizeData.aspectRatio} aspect ratio), `;
  prompt += `optimized for ${sizeData.description.toLowerCase()}. `;
  
  // Platform-specific enhancements
  if (platform === 'midjourney') {
    prompt += `--ar ${sizeData.aspectRatio} --style raw --quality 2 --stylize ${200 + (slideNumber * 50)} `;
  }
  
  // AMTICS branding mandate
  prompt += `MANDATORY BRANDING: Integrate AMTICS institutional branding with primary colors: `;
  prompt += `magenta (#d40075), navy blue (#003366), and green (#006837). `;
  prompt += `Slide indicator: Show "Slide ${slideNumber}/${totalSlides}" subtly in corner. `;
  prompt += `Maintain professional design standards with modern visual hierarchy. `;
  
  // Carousel navigation hints
  if (!isLastSlide) {
    prompt += `Include subtle visual cues suggesting more content follows (arrows, dots, etc.). `;
  }
  
  return prompt;
};

const createAdvancedPrompt = (formData, postTypeData, sizeData, promptNumber) => {
  const { postDetails, platform } = formData;
  
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

  let prompt = `${prefix} ${postTypeData.name.toLowerCase()} graphic ${style}. `;
  
  // Content specification
  prompt += `Content Requirements: ${postDetails}. `;
  
  // Design DNA integration
  const { designDNA } = postTypeData;
  prompt += `Design DNA: ${designDNA.layout}. Color palette: ${designDNA.colors.join(', ')}. `;
  prompt += `Typography style: ${designDNA.typography}. Key elements: ${designDNA.elements.join(', ')}. `;
  prompt += `Visual mood: ${designDNA.mood}. `;
  
  // Technical specifications
  prompt += `Technical specs: ${sizeData.dimensions}px (${sizeData.aspectRatio} aspect ratio), `;
  prompt += `optimized for ${sizeData.description.toLowerCase()}. `;
  
  // Platform-specific enhancements
  if (platform === 'midjourney') {
    prompt += `--ar ${sizeData.aspectRatio} --style raw --quality 2 --stylize ${200 + (promptNumber * 50)} `;
  }
  
  // AMTICS branding mandate
  prompt += `MANDATORY: Integrate AMTICS institutional branding with primary colors: `;
  prompt += `magenta (#d40075), navy blue (#003366), and green (#006837). `;
  prompt += `Maintain professional design standards with modern visual hierarchy, `;
  prompt += `clean composition, and premium quality finish. `;
  
  // Creative variations
  const creativeVariations = [
    "Emphasize bold visual impact with contemporary design language.",
    "Focus on clean minimalism with strategic color placement.",
    "Highlight institutional excellence through sophisticated layouts.",
    "Showcase modern professionalism with dynamic visual elements.",
    "Create memorable brand presence through thoughtful design choices."
  ];
  
  prompt += creativeVariations[(promptNumber - 1) % creativeVariations.length];

  return prompt;
};

const getPostTypeData = (postTypeId) => {
  const postTypes = {
    placement_card: {
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
    tech_event: {
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
    cultural_festival: {
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
    campus_life: {
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
    workshop_invite: {
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
    },
    informational_carousel: {
      name: "Informational Carousel",
      icon: "📑",
      description: "Multi-slide content",
      designDNA: {
        layout: "Sequential information flow with consistent branding",
        colors: ["#003366", "#d40075", "#ffffff"],
        typography: "Clear hierarchy, readable fonts",
        elements: ["slide_numbers", "progress_indicators", "consistent_headers"],
        mood: "Informative, organized, professional"
      }
    }
  };

  return postTypes[postTypeId] || postTypes.campus_life;
};

const getSizeData = (sizeId) => {
  const sizes = {
    square: { 
      dimensions: "1080x1080", 
      description: "Instagram posts", 
      aspectRatio: "1:1" 
    },
    portrait: { 
      dimensions: "1080x1350", 
      description: "Feed optimization", 
      aspectRatio: "4:5" 
    },
    story: { 
      dimensions: "1080x1920", 
      description: "Vertical content", 
      aspectRatio: "9:16" 
    },
    landscape: { 
      dimensions: "1920x1080", 
      description: "Wide presentations", 
      aspectRatio: "16:9" 
    },
    carousel: { 
      dimensions: "1080x1080", 
      description: "Multi-slide posts", 
      aspectRatio: "1:1" 
    }
  };

  return sizes[sizeId] || sizes.square;
};
