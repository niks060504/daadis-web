import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  questions: FAQItem[];
}

const AdvancedFAQ = () => {
  const [activeCategory, setActiveCategory] = useState<string>('basics');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const categories: Category[] = [
    {
      id: 'basics',
      title: 'The Basics',
      description: 'Fundamental questions about Daadi\'s heritage, foundation, and our journey in bringing traditional foods to modern tables.',
      questions: [
        {
          question: 'What is Daadi\'s?',
          answer: 'Daadi\'s is a leading ethnic food brand that provides traditional foods in convenient packaged form. Started in 2008, we are part of the 30-year-old Meghraj Group, specializing in healthy, hygienically manufactured traditional Indian snacks and foods.'
        },
        {
          question: 'What is our company heritage?',
          answer: 'Daadi\'s is proudly part of the 30-year-old Meghraj Group, bringing decades of experience in food manufacturing and traditional recipe preservation to modern consumers.'
        },
        {
          question: 'How does Daadi\'s ensure quality?',
          answer: 'All our products are manufactured in a state-of-the-art facility in Bengaluru using age-old traditional recipes. We ensure our products are free from preservatives, artificial colours, and flavours.'
        },
        {
          question: 'Will Daadi\'s expand to other regions?',
          answer: 'Yes! While we have a strong presence in South India, we are aggressively planning to spread to other states and explore new flavours to cater to diverse tastes across India.'
        },
        {
          question: 'What makes Daadi\'s products authentic?',
          answer: 'Our products are made using traditional recipes passed down through generations, maintaining authentic taste while meeting modern quality and hygiene standards in our state-of-the-art facility.'
        },
        {
          question: 'Are Daadi\'s products suitable for gifting?',
          answer: 'Absolutely! Our Premium Delight range offers beautifully packaged gift boxes with an assortment of Daadi\'s products, perfect for festivals and special occasions.'
        }
      ]
    },
    {
      id: 'products',
      title: 'Our Products',
      description: 'Everything about our traditional product ranges, from authentic khakhras to premium gift collections and specialty items.',
      questions: [
        {
          question: 'What makes Daadi\'s khakhras special?',
          answer: 'Our khakhras are made using traditional recipes passed down through generations, manufactured hygienically in our state-of-the-art facility. They are healthy, preservative-free, and come in various ranges.'
        },
        {
          question: 'What product ranges do we offer?',
          answer: 'We offer Traditional Range Khakhra (Golden Wheat Crisps), Wellness Range Khakhra (Cereal Khakhra), Mobile Range Khakhra (Pocket sized), Bhakhri, Miniatures Range, Besan Laddoo, Chutney Powder, and Premium Delight gift boxes.'
        },
        {
          question: 'Does Daadi\'s offer gift packaging?',
          answer: 'Yes! Our Premium Delight range offers beautifully packaged gift boxes with an assortment of Daadi\'s products, perfect for festivals and special events.'
        },
        {
          question: 'Are all products preservative-free?',
          answer: 'Absolutely! All our products are completely free from preservatives, artificial colours, and artificial flavours while maintaining authentic taste and nutritional value.'
        },
        {
          question: 'What is the shelf life of Daadi\'s products?',
          answer: 'Our products have varying shelf lives depending on the item. Khakhras and similar dry products typically have a shelf life of 6-9 months when stored properly in a cool, dry place.'
        },
        {
          question: 'Do you offer sugar-free or diabetic-friendly options?',
          answer: 'Yes, our Wellness Range includes options suitable for health-conscious consumers, including products with reduced sugar content and healthier ingredient alternatives.'
        }
      ]
    },
    {
      id: 'availability',
      title: 'Availability & Distribution',
      description: 'Information about where to find our products, our distribution network, and expansion plans across different regions.',
      questions: [
        {
          question: 'Where can I buy Daadi\'s products?',
          answer: 'Daadi\'s products are available in all leading supermarkets across South India. We have built a strong distribution network and are continuously expanding nationwide.'
        },
        {
          question: 'Are products available online?',
          answer: 'We are expanding our online presence and working with various e-commerce platforms to make Daadi\'s products easily accessible through online channels.'
        },
        {
          question: 'What regions do you currently serve?',
          answer: 'Currently, we have a strong presence in South India and are available in all leading supermarkets in the region. We are actively expanding to other states.'
        },
        {
          question: 'Do you offer bulk orders for businesses?',
          answer: 'Yes, we cater to bulk orders for businesses, events, and corporate gifting. Please contact us directly for customized bulk order requirements and pricing.'
        },
        {
          question: 'How can I become a distributor for Daadi\'s?',
          answer: 'We welcome potential distributors who share our vision. Please contact our business development team to discuss distribution opportunities in your region.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Currently, we focus on the Indian market, but we are exploring international shipping options to serve the global Indian diaspora. Stay tuned for updates!'
        }
      ]
    },
    {
      id: 'quality',
      title: 'Quality & Manufacturing',
      description: 'Details about our manufacturing processes, quality standards, traditional methods, and how we maintain authenticity.',
      questions: [
        {
          question: 'How is traditional authenticity maintained?',
          answer: 'We use age-old traditional recipes that have been preserved and passed down through generations. Our products maintain authentic taste profiles while meeting modern hygiene standards.'
        },
        {
          question: 'Where are products manufactured?',
          answer: 'All Daadi\'s products are manufactured in our state-of-the-art facility located in Bengaluru, Karnataka, ensuring hygienic production while maintaining traditional cooking methods.'
        },
        {
          question: 'What quality certifications do you have?',
          answer: 'Our manufacturing facility meets the highest hygiene and quality standards with strict quality control processes to ensure every product meets our traditional taste and safety standards.'
        },
        {
          question: 'How do you balance tradition with convenience?',
          answer: 'We transform traditional recipes into convenient, ready-to-eat formats. Our Mobile and Miniatures ranges are designed for busy lifestyles while preserving authentic flavours.'
        },
        {
          question: 'What ingredients do you use?',
          answer: 'We use only high-quality, natural ingredients sourced from trusted suppliers. All ingredients are carefully selected to maintain authenticity while ensuring nutritional value.'
        },
        {
          question: 'How do you ensure product freshness?',
          answer: 'Our products are manufactured using advanced packaging technology that preserves freshness without artificial preservatives. We follow strict rotation protocols to ensure fresh products reach consumers.'
        }
      ]
    }
  ];

  useEffect(() => {
    // Load GSAP
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = () => {
      setIsLoaded(true);
      animateInitialLoad();
      setupScrollTrigger();
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const animateInitialLoad = () => {
    if (!window.gsap) return;

    // Animate main header
    window.gsap.fromTo('.main-header',
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );

    // Animate left column
    window.gsap.fromTo(leftColumnRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
    );

    // Staggered animation for questions
    categories.forEach((category, categoryIndex) => {
      category.questions.forEach((_, questionIndex) => {
        const questionId = `${category.id}-${questionIndex}`;
        const element = questionRefs.current[questionId];
        if (element) {
          window.gsap.fromTo(element,
            { opacity: 0, y: 30 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.6, 
              delay: 0.4 + (categoryIndex * 0.1) + (questionIndex * 0.05),
              ease: 'power2.out'
            }
          );
        }
      });
    });
  };

    const setupScrollTrigger = () => {
    if (!window.gsap) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const triggerPoint = scrollY + windowHeight * 0.4; // Trigger point at 40% of viewport height
      
      let newActiveCategory = categories[0].id; // Default to first category
      
      // Go through categories in order and find which one should be active
      for (let i = categories.length - 1; i >= 0; i--) {
        const category = categories[i];
        const element = categoryRefs.current[category.id];
        
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollY;
          
          // If the trigger point has passed this category's top, make it active
          if (triggerPoint >= elementTop) {
            newActiveCategory = category.id;
            break;
          }
        }
      }

      if (newActiveCategory !== activeCategory) {
        updateActiveCategory(newActiveCategory);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Also trigger initially to set correct category
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  };

  const updateActiveCategory = (newCategory: string) => {
    if (!window.gsap || !leftColumnRef.current || newCategory === activeCategory) return;

    const leftColumn = leftColumnRef.current;
    
    // Create a smooth crossfade transition
    window.gsap.to(leftColumn, {
      opacity: 0.3,
      duration: 0.2,
      ease: 'power2.inOut',
      onComplete: () => {
        setActiveCategory(newCategory);
        
        // Fade back in with new content
        window.gsap.to(leftColumn, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  };

  const toggleQuestion = (categoryId: string, questionIndex: number) => {
    const key = `${categoryId}-${questionIndex}`;
    const isOpening = !openItems[key];
    
    setOpenItems(prev => ({
      ...prev,
      [key]: isOpening
    }));

    if (window.gsap && isOpening) {
      const answerElement = document.querySelector(`#answer-${key}`);
      if (answerElement) {
        window.gsap.fromTo(answerElement,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
      }
    }
  };

  const currentCategory = categories.find(cat => cat.id === activeCategory);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      
      {/* Main Header */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="main-header text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight opacity-0">
            Got questions?
          </h1>
          <h2 className="main-header text-6xl md:text-7xl font-bold text-gray-900 mb-12 tracking-tight opacity-0">
            We've got answers.
          </h2>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Left Column - Enlarged and Centered */}
          <div className="lg:col-span-2 lg:sticky lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:h-fit">
            <div ref={leftColumnRef} className="min-h-[200px]">
              {currentCategory && (
                <>
                  <h2 className="text-4xl font-medium text-gray-900 mb-6">
                    {currentCategory.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                    {currentCategory.description}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Scrollable Questions */}
          <div className="lg:col-span-3">
            <div className="space-y-16">
              {categories.map((category, categoryIndex) => (
                <div
                  key={category.id}
                  ref={(el) => categoryRefs.current[category.id] = el}
                  className="space-y-0"
                >
                  {/* Mobile Category Header */}
                  <div className="lg:hidden mb-8">
                    <h2 className="text-2xl font-medium text-gray-900 mb-2">
                      {category.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>

                  {/* Questions */}
                  <div className="space-y-0">
                    {category.questions.map((item, questionIndex) => {
                      const questionKey = `${category.id}-${questionIndex}`;
                      const isOpen = openItems[questionKey];
                      
                      return (
                        <div
                          key={questionKey}
                          ref={(el) => questionRefs.current[questionKey] = el}
                          className="border-b border-gray-200 last:border-b-0 opacity-0"
                        >
                          <button
                            onClick={() => toggleQuestion(category.id, questionIndex)}
                            className="w-full px-0 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 group"
                          >
                            <span className="font-medium text-gray-900 text-lg pr-4 group-hover:text-gray-700">
                              {item.question}
                            </span>
                            <div className="flex-shrink-0 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                              <Plus className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                            </div>
                          </button>
                          
                          {isOpen && (
                            <div 
                              id={`answer-${questionKey}`}
                              className="pb-6 -mt-2"
                            >
                              <p className="text-gray-600 leading-relaxed text-lg max-w-3xl">
                                {item.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFAQ;