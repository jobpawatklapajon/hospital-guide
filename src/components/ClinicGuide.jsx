import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import { HiOutlineMapPin } from "react-icons/hi2";
import { FaArrowLeft } from "react-icons/fa";
import { HiOutlineMap } from "react-icons/hi2";
import { LazyImage } from "./ClinicList";

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex justify-center items-center py-4">
    <div className="w-8 h-8 border-2 border-[#7ac142] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Navigation Step component
const NavigationStep = ({ step, index, onClick }) => (
  <div 
    id={`step-${index}`}
    className="mb-8 w-full"
    onClick={() => onClick(index)}
  >
    <div className="flex items-center mb-3 bg-[#f9f9f9] p-3 rounded-lg shadow-sm border-l-4 border-[#7ac142]">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#7ac142] text-white font-medium mr-3">
        {index + 1}
      </div>
      <p className="text-sm font-medium text-gray-700">
        {step.description}
      </p>
    </div>
    <div className="border border-[#f0f0f0] rounded-lg overflow-hidden shadow-sm">
      <LazyImage
        src={step.path}
        alt={`Navigation step ${index + 1}`}
        className="max-w-full h-auto"
      />
    </div>
  </div>
);

export default function ClinicGuide({
  selectedClinic,
  handleBackToClinicList,
  handleBackToBuildings,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = selectedClinic.navigation_guide.length;
  const [visibleSteps, setVisibleSteps] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef(null);
  const loaderRef = useRef(null);
  const lastScrollY = useRef(0);

  const handleStepClick = useCallback((index) => {
    setCurrentStep(index);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Handle scroll to show/hide controls
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const currentScrollY = containerRef.current.scrollTop;
      
      // Scrolling down - hide controls
      if (currentScrollY > lastScrollY.current && showControls) {
        setShowControls(false);
      } 
      // Scrolling up - show controls
      else if (currentScrollY < lastScrollY.current && !showControls) {
        setShowControls(true);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [showControls]);

  // Setup infinite scroll observer - similar to ClinicList
  useEffect(() => {
    const loadMoreSteps = () => {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleSteps(prev => Math.min(prev + 2, totalSteps));
        setIsLoading(false);
      }, 500); // Small delay to show loading effect
    };

    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading) {
        // Only load more if there are more steps to show
        if (visibleSteps < totalSteps) {
          loadMoreSteps();
        }
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [visibleSteps, totalSteps, isLoading]);

  // Memoize navigation steps to prevent unnecessary re-renders (like ClinicList)
  const visibleNavSteps = useMemo(() => {
    const stepsToRender = selectedClinic.navigation_guide.slice(0, visibleSteps);
    return stepsToRender.map((step, index) => (
      <NavigationStep
        key={index}
        step={step}
        index={index}
        onClick={handleStepClick}
      />
    ));
  }, [selectedClinic.navigation_guide, visibleSteps, handleStepClick]);

  // Check if there are more steps to load (like ClinicList's shouldShowLoader)
  const shouldShowLoader = visibleSteps < totalSteps;

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-y-auto px-4 pt-5 pb-20 relative"
    >
      <div className="mb-6 flex items-center">
        <HiOutlineMapPin size={24} className="text-[#7ac142] mr-2" />
        <h2 className="text-lg font-bold text-gray-800">
          {selectedClinic.name}
        </h2>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Navigation Steps */}
        <div className="flex flex-col items-center p-2">
          {visibleNavSteps}
          
          {shouldShowLoader && (
            <div ref={loaderRef}>
              <LoadingIndicator />
            </div>
          )}
        </div>

        {/* Control Panel - Shows/hides based on scroll direction */}
        <div 
          className={`fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md shadow-md border-t border-[#7ac142]/20 mx-4 mb-2 rounded-t-xl transition-transform duration-300 ${
            showControls ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Back buttons */}
          <div className="flex justify-center gap-x-2">
            <button
              onClick={handleBackToClinicList}
              className="flex items-center justify-center bg-[#7ac142] text-white px-5 py-2.5 rounded-lg hover:bg-[#68a936] transition-all shadow-sm hover:shadow font-medium"
            >
              <FaArrowLeft size={16} className="mr-2" />
              กลับ
            </button>
            <button
              onClick={handleBackToBuildings}
              className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg flex items-center hover:bg-gray-50 transition-all shadow-sm hover:shadow font-medium"
            >
              <HiOutlineMap size={16} className="mr-2 text-[#7ac142]" />
              คลินิกทั้งหมด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
